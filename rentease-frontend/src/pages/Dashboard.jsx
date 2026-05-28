import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IBMBadge, StatCard } from "../components/UI";
import { bookingService, authService, notificationService } from "../services/api";
import { IBM_SERVICES } from "../data/mockData";

const CATEGORY_ICONS = {
  vehicles:"🚗", bikes:"🏍️", appliances:"❄️",
  furniture:"🛋️", electronics:"💻", other:"📦"
};

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings,      setBookings]      = useState([]);
  const [wishlist,      setWishlist]      = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      bookingService.getMyBookings().catch(() => ({ data: [] })),
      authService.getWishlist().catch(() => ({ data: { wishlist: [] } })),
      notificationService.getAll().catch(() => ({ data: [] })),
    ]).then(([bRes, wRes, nRes]) => {
      setBookings(bRes.data || []);
      setWishlist(wRes.data?.wishlist || []);
      setNotifications(nRes.data || []);
      setLoading(false);
    });
  }, []);

  const activeBookings  = bookings.filter(b => b.status === "active");
  const monthlySpend    = activeBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const unreadCount     = notifications.filter(n => !n.read).length;

  const stats = [
    { icon:"📦", value: loading ? "..." : String(activeBookings.length), label:"Active Rentals",  color:"#1a56db", bg:"#eff6ff" },
    { icon:"💰", value: loading ? "..." : `₹${monthlySpend.toLocaleString()}`, label:"Total Spend", color:"#0e9f6e", bg:"#f0fdf4" },
    { icon:"❤️", value: loading ? "..." : String(wishlist.length), label:"Wishlist Items",  color:"#e02424", bg:"#fef2f2" },
    { icon:"🔔", value: loading ? "..." : String(unreadCount), label:"Notifications",  color:"#7e3af2", bg:"#f5f3ff" },
  ];

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"2rem" }}>
        <div>
          <IBMBadge text="IBM Cloud User Dashboard" />
          <h1 style={{ fontWeight:800, fontSize:28, margin:"0.75rem 0 0.25rem" }}>👋 Hello, {user?.name}!</h1>
          <p style={{ color:"#6b7280" }}>Manage your rentals and explore new products</p>
        </div>
        <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"0.75rem 1rem", fontSize:12, color:"#6b7280", textAlign:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"center", marginBottom:4 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#4ade80" }} />
            <span style={{ color:"#4ade80", fontWeight:600 }}>Session Active</span>
          </div>
          <p style={{ margin:0 }}>IBM App ID · JWT</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:"2rem" }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20 }}>
        {/* Active rentals */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
            <h2 style={{ fontWeight:700, fontSize:18, margin:0 }}>Active Rentals</h2>
            <Link to="/my-rentals" style={{ fontSize:13, color:"#1a56db" }}>View all →</Link>
          </div>
          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, overflow:"hidden" }}>
            {loading ? (
              <div style={{ padding:"2rem", textAlign:"center", color:"#9ca3af" }}>Loading rentals...</div>
            ) : activeBookings.length === 0 ? (
              <div style={{ padding:"2rem", textAlign:"center" }}>
                <p style={{ fontSize:32, margin:"0 0 8px" }}>📦</p>
                <p style={{ color:"#9ca3af", fontSize:14, margin:0 }}>No active rentals yet.</p>
                <Link to="/products" style={{ color:"#1a56db", fontSize:13, fontWeight:600 }}>Browse products →</Link>
              </div>
            ) : activeBookings.slice(0, 3).map((b, i, arr) => (
              <div key={b._id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1rem 1.25rem", borderBottom: i<arr.length-1 ? "1px solid #f3f4f6" : "none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:28 }}>{CATEGORY_ICONS[b.category] || "📦"}</span>
                  <div>
                    <p style={{ fontWeight:600, margin:0, fontSize:14 }}>{b.productName || b.productId}</p>
                    <p style={{ color:"#9ca3af", fontSize:12, margin:0 }}>
                      Ends: {b.endDate ? new Date(b.endDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ fontWeight:700, color:"#1a56db", margin:0 }}>₹{(b.totalPrice || 0).toLocaleString()}</p>
                  <span style={{ background:"#dcfce7", color:"#166534", fontSize:11, borderRadius:4, padding:"2px 8px", fontWeight:600 }}>Active</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <h2 style={{ fontWeight:700, fontSize:18, margin:"1.5rem 0 1rem" }}>Quick Actions</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[
              ["/my-rentals",     "📦 My Rentals",    `${activeBookings.length} active`],
              ["/wishlist",       "❤️ Wishlist",       `${wishlist.length} saved`],
              ["/notifications",  "🔔 Notifications",  `${unreadCount} new`],
              ["/payment-history","💳 Payments",       "Transaction history"],
              ["/profile",        "👤 Profile",        "Edit your info"],
              ["/products",       "🔍 Browse More",    "Find new products"],
            ].map(([to,label,sub]) => (
              <Link key={to} to={to} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"1rem", textDecoration:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <p style={{ fontWeight:600, fontSize:14, margin:0, color:"#111827" }}>{label}</p>
                  <p style={{ fontSize:12, color:"#9ca3af", margin:0 }}>{sub}</p>
                </div>
                <span style={{ color:"#9ca3af" }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* IBM Cloud status */}
        <div>
          <h2 style={{ fontWeight:700, fontSize:18, marginBottom:"1rem" }}>IBM Cloud Status</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {IBM_SERVICES.map(svc => (
              <div key={svc.id} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"1rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:20 }}>{svc.icon}</span>
                  <div>
                    <p style={{ fontWeight:600, fontSize:13, margin:0 }}>{svc.name}</p>
                    <p style={{ fontSize:11, color:"#9ca3af", margin:0 }}>us-south</p>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80" }} />
                  <span style={{ fontSize:11, color:"#4ade80", fontWeight:600 }}>LIVE</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent notifications */}
          {notifications.length > 0 && (
            <>
              <h2 style={{ fontWeight:700, fontSize:18, margin:"1.5rem 0 1rem" }}>Recent Notifications</h2>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {notifications.slice(0,3).map(n => (
                  <div key={n._id} style={{ background: n.read ? "#fff" : "#eff6ff", border:`1px solid ${n.read ? "#e5e7eb" : "#bfdbfe"}`, borderRadius:10, padding:"0.75rem 1rem" }}>
                    <p style={{ fontWeight:600, fontSize:13, margin:"0 0 2px", color:"#111827" }}>{n.title || "Notification"}</p>
                    <p style={{ fontSize:12, color:"#6b7280", margin:0 }}>{n.message}</p>
                  </div>
                ))}
                <Link to="/notifications" style={{ fontSize:13, color:"#1a56db", textAlign:"center" }}>View all →</Link>
              </div>
            </>
          )}

          <div style={{ marginTop:"1rem", background:"linear-gradient(135deg,#0f172a,#1e1b4b)", borderRadius:16, padding:"1.25rem" }}>
            <IBMBadge text="IBM Cloud Platform" />
            <p style={{ color:"#94a3b8", fontSize:12, margin:"0.75rem 0 0", lineHeight:1.6 }}>
              Your data is securely stored on IBM Cloudant and your session is managed by IBM App ID.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
