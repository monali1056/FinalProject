import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IBMBadge, EmptyState, ProductCard } from "../components/UI";
import { useWishlist } from "../hooks/useWishlist";
import {
  bookingService,
  notificationService,
  paymentService,
  authService,
  productService,
} from "../services/api";

// ── Shared loading skeleton ───────────────────────────────────────────────────
function Skeleton({ height = 80, count = 3 }) {
  return Array(count).fill(0).map((_, i) => (
    <div key={i} style={{
      height, background:"#f3f4f6", borderRadius:14, marginBottom:10,
      animation:"pulse 1.5s infinite",
    }} />
  ));
}

const pulseStyle = `@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`;

// ── STATUS badge helper ───────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active:    { bg:"#dcfce7", color:"#166534" },
    completed: { bg:"#f3f4f6", color:"#374151" },
    pending:   { bg:"#fef3c7", color:"#92400e" },
    cancelled: { bg:"#fee2e2", color:"#991b1b" },
    paid:      { bg:"#dcfce7", color:"#166534" },
    refunded:  { bg:"#eff6ff", color:"#1a56db" },
    failed:    { bg:"#fee2e2", color:"#991b1b" },
  };
  const s = map[status] || { bg:"#f3f4f6", color:"#374151" };
  return (
    <span style={{ background:s.bg, color:s.color, borderRadius:4, padding:"2px 8px", fontSize:11, fontWeight:600 }}>
      {status}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MY RENTALS
// ═══════════════════════════════════════════════════════════════════════════════
export function MyRentals() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    bookingService.getMyBookings()
      .then(res => setBookings(res.data))
      .catch(() => setError("Failed to load rentals."))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    setCancelling(id);
    try {
      const res = await bookingService.cancel(id);
      setBookings(bs => bs.map(b => b._id === id ? res.data : b));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to cancel.");
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"2rem" }}>
      <style>{pulseStyle}</style>
      <IBMBadge text="IBM Cloudant — Bookings DB" />
      <h1 style={{ fontWeight:800, fontSize:26, margin:"0.75rem 0 1.5rem" }}>My Rentals</h1>

      {loading && <Skeleton count={3} height={90} />}
      {error   && <p style={{ color:"#dc2626" }}>{error}</p>}

      {!loading && bookings.length === 0 && !error && (
        <EmptyState icon="📦" title="No rentals yet"
          subtitle="Browse our products and book your first rental!"
          action={
            <button onClick={() => navigate("/products")}
              style={{ background:"linear-gradient(135deg,#1a56db,#7e3af2)", color:"#fff", border:"none", borderRadius:10, padding:"10px 20px", fontWeight:600, cursor:"pointer" }}>
              Browse Products
            </button>
          }
        />
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {bookings.map(b => (
          <div key={b._id} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:"1.25rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ fontSize:36 }}>{b.productImage || "📦"}</span>
              <div>
                <p style={{ fontWeight:700, fontSize:15, margin:"0 0 4px" }}>{b.productName}</p>
                <p style={{ color:"#6b7280", fontSize:13, margin:"0 0 6px" }}>
                  {b.startDate} → {b.endDate} · {b.duration} {b.period || "month"}(s)
                </p>
                <StatusBadge status={b.status} />
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ fontWeight:800, fontSize:20, color:"#1a56db", margin:"0 0 4px" }}>
                ₹{(b.price || 0).toLocaleString()}/mo
              </p>
              <p style={{ color:"#9ca3af", fontSize:12, margin:"0 0 8px" }}>
                Total: ₹{(b.totalAmount || 0).toLocaleString()}
              </p>
              {["pending","active"].includes(b.status) && (
                <button
                  onClick={() => handleCancel(b._id)}
                  disabled={cancelling === b._id}
                  style={{ background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", borderRadius:8, padding:"4px 12px", fontSize:12, cursor:"pointer", fontWeight:600 }}>
                  {cancelling === b._id ? "Cancelling…" : "Cancel"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WISHLIST
// ═══════════════════════════════════════════════════════════════════════════════
export function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, toggle } = useWishlist();
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) { setLoading(false); return; }
    // Fetch each wishlisted product from Cloudant
    Promise.all(wishlist.map(id => productService.getOne(id).then(r => r.data).catch(() => null)))
      .then(results => setItems(results.filter(Boolean)))
      .finally(() => setLoading(false));
  }, [wishlist.length]);

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem" }}>
      <style>{pulseStyle}</style>
      <h1 style={{ fontWeight:800, fontSize:26, margin:"0 0 1.5rem" }}>
        ❤️ My Wishlist ({wishlist.length})
      </h1>

      {loading && <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}><Skeleton count={3} height={200} /></div>}

      {!loading && wishlist.length === 0 && (
        <EmptyState icon="🤍" title="Wishlist is empty"
          subtitle="Browse products and tap the heart icon to save them here."
          action={
            <button onClick={() => navigate("/products")}
              style={{ background:"linear-gradient(135deg,#1a56db,#7e3af2)", color:"#fff", border:"none", borderRadius:10, padding:"10px 20px", fontWeight:600, cursor:"pointer" }}>
              Browse Products
            </button>
          }
        />
      )}

      {!loading && items.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
          {items.map(p => (
            <ProductCard
              key={p._id}
              product={p}
              wishlisted
              onClick={() => navigate(`/products/${p._id}`)}
              onWishlist={() => toggle(p._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
export function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    notificationService.getAll()
      .then(res => {
        setNotifications(res.data);
        // Auto mark all as read when page opens
        notificationService.markAllRead().catch(() => {});
      })
      .catch(() => setError("Failed to load notifications."))
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (iso) => {
    if (!iso) return "";
    const diff = Date.now() - new Date(iso).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    if (days > 0)  return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0)  return `${mins}m ago`;
    return "Just now";
  };

  return (
    <div style={{ maxWidth:700, margin:"0 auto", padding:"2rem" }}>
      <style>{pulseStyle}</style>
      <h1 style={{ fontWeight:800, fontSize:26, margin:"0 0 1.5rem" }}>🔔 Notifications</h1>

      {loading && <Skeleton count={4} height={70} />}
      {error   && <p style={{ color:"#dc2626" }}>{error}</p>}

      {!loading && notifications.length === 0 && !error && (
        <div style={{ textAlign:"center", padding:"3rem", color:"#9ca3af" }}>
          <div style={{ fontSize:48, marginBottom:"1rem" }}>🔔</div>
          <p style={{ fontWeight:600 }}>No notifications yet</p>
          <p style={{ fontSize:13 }}>You'll see booking confirmations and updates here.</p>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {notifications.map(n => (
          <div key={n._id} style={{
            background: n.read ? "#fff" : "#eff6ff",
            border:`1px solid ${n.read ? "#e5e7eb" : "#bfdbfe"}`,
            borderRadius:14, padding:"1rem 1.25rem",
            display:"flex", alignItems:"flex-start", gap:12,
          }}>
            <span style={{ fontSize:24 }}>{n.icon || "🔔"}</span>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <p style={{ fontWeight:700, fontSize:14, margin:"0 0 4px" }}>{n.title}</p>
                <span style={{ fontSize:11, color:"#9ca3af", whiteSpace:"nowrap", marginLeft:8 }}>
                  {formatTime(n.createdAt)}
                </span>
              </div>
              <p style={{ color:"#6b7280", fontSize:13, margin:0 }}>{n.message}</p>
            </div>
            {!n.read && (
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#1a56db", marginTop:4, flexShrink:0 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════
export function Profile() {
  const { user, setUser } = useAuth();
  const [form,    setForm]    = useState({ name: user?.name || "", phone: user?.phone || "", address: user?.address || "" });
  const [pwForm,  setPwForm]  = useState({ currentPassword:"", newPassword:"", confirm:"" });
  const [saved,   setSaved]   = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [pwError, setPwError] = useState("");

  const handleSave = async () => {
    setLoading(true); setError(""); setSaved(false);
    try {
      const res = await authService.updateProfile(form);
      if (setUser) setUser(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePw = async () => {
    setPwError(""); setPwSaved(false);
    if (pwForm.newPassword !== pwForm.confirm) { setPwError("Passwords do not match."); return; }
    if (pwForm.newPassword.length < 6) { setPwError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await authService.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwSaved(true);
      setPwForm({ currentPassword:"", newPassword:"", confirm:"" });
      setTimeout(() => setPwSaved(false), 3000);
    } catch (err) {
      setPwError(err.response?.data?.error || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth:600, margin:"0 auto", padding:"2rem" }}>
      <h1 style={{ fontWeight:800, fontSize:26, margin:"0 0 1.5rem" }}>👤 Profile Settings</h1>

      {/* Profile card */}
      <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:"1.5rem", marginBottom:"1.5rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:"1.5rem" }}>
          <div style={{ width:60, height:60, borderRadius:"50%", background:"linear-gradient(135deg,#1a56db,#7e3af2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:22 }}>
            {(form.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight:700, fontSize:16, margin:"0 0 2px" }}>{form.name || user?.name}</p>
            <p style={{ color:"#6b7280", fontSize:13, margin:"0 0 4px" }}>{user?.email}</p>
            <span style={{ background:"#eff6ff", color:"#1a56db", fontSize:11, borderRadius:4, padding:"2px 8px", fontWeight:600 }}>
              🔐 IBM App ID
            </span>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[
            ["name",    "Full Name", "text"],
            ["phone",   "Phone",     "tel"],
            ["address", "Address",   "text"],
          ].map(([key, label, type]) => (
            <div key={key}>
              <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:4 }}>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm(f => ({...f,[key]:e.target.value}))}
                style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", boxSizing:"border-box" }} />
            </div>
          ))}

          {error && <p style={{ color:"#dc2626", fontSize:13, background:"#fef2f2", padding:"8px 12px", borderRadius:8, margin:0 }}>{error}</p>}
          {saved && <p style={{ color:"#0e9f6e", fontWeight:600, fontSize:13, margin:0 }}>✅ Profile updated and saved to IBM Cloudant!</p>}

          <button onClick={handleSave} disabled={loading}
            style={{ background:"linear-gradient(135deg,#1a56db,#7e3af2)", color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, cursor:"pointer", opacity: loading ? 0.8 : 1 }}>
            {loading ? "Saving to IBM Cloudant…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Change password */}
      <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:"1.5rem" }}>
        <h2 style={{ fontWeight:700, fontSize:18, margin:"0 0 1rem" }}>🔑 Change Password</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[
            ["currentPassword","Current Password"],
            ["newPassword",    "New Password"],
            ["confirm",        "Confirm New Password"],
          ].map(([key, label]) => (
            <div key={key}>
              <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:4 }}>{label}</label>
              <input type="password" value={pwForm[key]} onChange={e => setPwForm(f => ({...f,[key]:e.target.value}))}
                style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", boxSizing:"border-box" }} />
            </div>
          ))}

          {pwError && <p style={{ color:"#dc2626", fontSize:13, background:"#fef2f2", padding:"8px 12px", borderRadius:8, margin:0 }}>{pwError}</p>}
          {pwSaved && <p style={{ color:"#0e9f6e", fontWeight:600, fontSize:13, margin:0 }}>✅ Password changed successfully!</p>}

          <button onClick={handleChangePw} disabled={loading}
            style={{ background:"#111827", color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, cursor:"pointer" }}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENT HISTORY
// ═══════════════════════════════════════════════════════════════════════════════
export function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    paymentService.getMy()
      .then(res => setPayments(res.data))
      .catch(() => setError("Failed to load payment history."))
      .finally(() => setLoading(false));
  }, []);

  const total = payments
    .filter(p => p.status === "paid")
    .reduce((s, p) => s + (p.amount || 0), 0);

  const formatDate = (iso) => iso
    ? new Date(iso).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
    : "—";

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"2rem" }}>
      <style>{pulseStyle}</style>
      <IBMBadge text="IBM Cloudant — Payments DB" />
      <h1 style={{ fontWeight:800, fontSize:26, margin:"0.75rem 0 1.5rem" }}>💳 Payment History</h1>

      {loading && <Skeleton count={4} height={56} />}
      {error   && <p style={{ color:"#dc2626" }}>{error}</p>}

      {!loading && payments.length === 0 && !error && (
        <div style={{ textAlign:"center", padding:"3rem", color:"#9ca3af" }}>
          <div style={{ fontSize:48, marginBottom:"1rem" }}>💳</div>
          <p style={{ fontWeight:600 }}>No payments yet</p>
          <p style={{ fontSize:13 }}>Your payment history will appear here after booking.</p>
        </div>
      )}

      {!loading && payments.length > 0 && (
        <>
          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr 1fr 1fr", padding:"0.75rem 1.25rem", background:"#f8fafc", fontSize:12, fontWeight:700, color:"#6b7280" }}>
              <span>DATE</span><span>PRODUCT</span><span>AMOUNT</span><span>STATUS</span>
            </div>
            {payments.map((p, i) => (
              <div key={p._id || i} style={{ display:"grid", gridTemplateColumns:"1fr 2fr 1fr 1fr", padding:"1rem 1.25rem", borderTop:"1px solid #f3f4f6", fontSize:14, alignItems:"center" }}>
                <span style={{ color:"#6b7280", fontSize:13 }}>{formatDate(p.createdAt)}</span>
                <span style={{ fontWeight:600 }}>{p.productName}</span>
                <span style={{ fontWeight:700, color:"#1a56db" }}>₹{(p.amount || 0).toLocaleString()}</span>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>

          <div style={{ background:"#f8fafc", borderRadius:12, padding:"1rem", marginTop:"1rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <span style={{ fontWeight:600 }}>Total Paid</span>
              <p style={{ color:"#9ca3af", fontSize:12, margin:"2px 0 0" }}>Confirmed payments only</p>
            </div>
            <span style={{ fontWeight:800, fontSize:20, color:"#1a56db" }}>₹{total.toLocaleString()}</span>
          </div>
        </>
      )}
    </div>
  );
}
