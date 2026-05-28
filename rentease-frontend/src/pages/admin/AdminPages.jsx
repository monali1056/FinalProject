// AdminPages.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IBMBadge } from "../../components/UI";
import { productService, bookingService } from "../../services/api";

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    productService.getAll().then(res => setProducts(res.data || [])).catch(() => {});
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
        <div>
          <IBMBadge text="IBM Cloudant — Products DB" />
          <h1 style={{ fontWeight:800, fontSize:26, margin:"0.5rem 0 0" }}>Manage Products</h1>
        </div>
        <Link to="/admin/products/add" style={{ background:"linear-gradient(135deg,#1a56db,#7e3af2)", color:"#fff", borderRadius:10, padding:"10px 18px", fontWeight:600, fontSize:14, textDecoration:"none" }}>+ Add Product</Link>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", marginBottom:"1rem", boxSizing:"border-box" }} />
      <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", padding:"0.75rem 1.25rem", background:"#f8fafc", fontSize:12, fontWeight:700, color:"#6b7280" }}>
          <span>PRODUCT</span><span>CATEGORY</span><span>PRICE</span><span>STATUS</span><span>ACTIONS</span>
        </div>
        {filtered.map((p, i) => (
          <div key={p._id} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", padding:"1rem 1.25rem", borderTop:"1px solid #f3f4f6", alignItems:"center", fontSize:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:24 }}>{p.image}</span>
              <span style={{ fontWeight:600 }}>{p.name}</span>
            </div>
            <span style={{ color:"#6b7280", textTransform:"capitalize" }}>{p.category}</span>
            <span style={{ fontWeight:700, color:"#1a56db" }}>₹{p.price.toLocaleString()}/mo</span>
            <span style={{ background: p.available?"#dcfce7":"#fee2e2", color: p.available?"#166534":"#991b1b", borderRadius:4, padding:"2px 8px", fontSize:11, fontWeight:600, width:"fit-content" }}>
              {p.available ? "Available" : "Unavailable"}
            </span>
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ background:"#eff6ff", color:"#1a56db", border:"none", borderRadius:6, padding:"5px 10px", fontSize:12, cursor:"pointer", fontWeight:600 }}>Edit</button>
              <button onClick={async () => { await productService.delete(p._id); setProducts(ps => ps.filter(x => x._id !== p._id)); }} style={{ background:"#fef2f2", color:"#dc2626", border:"none", borderRadius:6, padding:"5px 10px", fontSize:12, cursor:"pointer", fontWeight:600 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminAddProduct() {
  const [form, setForm] = useState({ name:"", category:"vehicles", price:"", deposit:"", description:"" });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await productService.create({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        deposit: Number(form.deposit),
        description: form.description,
      });
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth:700, margin:"0 auto", padding:"2rem" }}>
      <IBMBadge text="Saving to IBM Cloudant" />
      <h1 style={{ fontWeight:800, fontSize:26, margin:"0.75rem 0 0.5rem" }}>Add New Product</h1>
      {saved ? (
        <div style={{ background:"#dcfce7", border:"1px solid #86efac", borderRadius:12, padding:"1.5rem", textAlign:"center", marginTop:"1rem" }}>
          <p style={{ color:"#166534", fontWeight:700, fontSize:16, margin:"0 0 12px" }}>✅ Product saved to IBM Cloudant!</p>
          <button onClick={() => { setSaved(false); setForm({ name:"", category:"vehicles", price:"", deposit:"", description:"" }); }}
            style={{ background:"linear-gradient(135deg,#1a56db,#7e3af2)", color:"#fff", border:"none", borderRadius:8, padding:"10px 20px", fontWeight:600, cursor:"pointer" }}>
            Add Another Product
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:"1.5rem", display:"flex", flexDirection:"column", gap:14, marginTop:"1rem" }}>
          {[["name","Product Name","e.g. Samsung 1.5T AC","text"],["price","Price (₹)","e.g. 899","number"],["deposit","Security Deposit (₹)","e.g. 2000","number"]].map(([key,label,ph,type]) => (
            <div key={key}>
              <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:4 }}>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm(f=>({...f,[key]:e.target.value}))} placeholder={ph} required style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", boxSizing:"border-box" }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:4 }}>Category</label>
            <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:14 }}>
              {["vehicles","appliances","furniture","electronics","bikes","other"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:4 }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} rows={3} placeholder="Product description…" style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", boxSizing:"border-box", resize:"vertical" }} />
          </div>
          {error && <p style={{ color:"#dc2626", fontWeight:600, margin:0 }}>❌ {error}</p>}
          <button type="submit" disabled={loading} style={{ background:"linear-gradient(135deg,#1a56db,#7e3af2)", color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:15, cursor:"pointer" }}>
            {loading ? "Saving..." : "Save to IBM Cloudant"}
          </button>
        </form>
      )}
    </div>
  );
}

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("../../services/api").then(({ adminService }) => {
      adminService.getAllUsers().then(res => { setUsers(res.data || []); setLoading(false); }).catch(() => setLoading(false));
    });
  }, []);

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem" }}>
      <IBMBadge text="IBM Cloudant — Users DB" />
      <h1 style={{ fontWeight:800, fontSize:26, margin:"0.75rem 0 1.5rem" }}>Manage Users</h1>
      <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1fr 1fr", padding:"0.75rem 1.25rem", background:"#f8fafc", fontSize:12, fontWeight:700, color:"#6b7280" }}>
          <span>NAME</span><span>EMAIL</span><span>ROLE</span><span>JOINED</span>
        </div>
        {loading ? (
          <div style={{ padding:"2rem", textAlign:"center", color:"#9ca3af" }}>Loading users...</div>
        ) : users.map((u) => (
          <div key={u._id} style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1fr 1fr", padding:"1rem 1.25rem", borderTop:"1px solid #f3f4f6", fontSize:14, alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#1a56db,#7e3af2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:12 }}>{u.name?.[0] || "U"}</div>
              <span style={{ fontWeight:600 }}>{u.name}</span>
            </div>
            <span style={{ color:"#6b7280" }}>{u.email}</span>
            <span style={{ background: u.role==="admin"?"#fef3c7":"#eff6ff", color: u.role==="admin"?"#92400e":"#1a56db", borderRadius:4, padding:"2px 8px", fontSize:11, fontWeight:700, width:"fit-content" }}>{u.role}</span>
            <span style={{ color:"#9ca3af" }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    bookingService.getAllBookings()
      .then(res => { setBookings(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await bookingService.updateStatus(id, status);
      setBookings(bs => bs.map(b => b._id === id ? { ...b, status } : b));
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  const pending  = bookings.filter(b => b.status === "pending").length;

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem" }}>
      <IBMBadge text="IBM Cloudant — Bookings DB" />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", margin:"0.75rem 0 1.5rem" }}>
        <h1 style={{ fontWeight:800, fontSize:26, margin:0 }}>Manage Bookings</h1>
        {pending > 0 && (
          <span style={{ background:"#fef3c7", color:"#92400e", borderRadius:8, padding:"6px 14px", fontWeight:700, fontSize:13 }}>
            ⏳ {pending} pending approval
          </span>
        )}
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:"1.5rem" }}>
        {["all","pending","active","completed","cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:"6px 16px", borderRadius:8, border:"none", cursor:"pointer", fontWeight:600, fontSize:13,
            background: filter===f ? "#1a56db" : "#f3f4f6",
            color: filter===f ? "#fff" : "#374151",
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "pending" && pending > 0 && ` (${pending})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:"3rem", color:"#9ca3af" }}>Loading bookings...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"3rem", color:"#9ca3af" }}>No {filter} bookings found.</div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {filtered.map(b => (
            <div key={b._id} style={{ background:"#fff", border:`2px solid ${b.status==="pending"?"#fcd34d":"#e5e7eb"}`, borderRadius:16, padding:"1.25rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                  <span style={{ fontWeight:700, fontSize:15 }}>{b.productName || b.productId}</span>
                  <span style={{
                    background: b.status==="active"?"#dcfce7":b.status==="pending"?"#fef3c7":b.status==="cancelled"?"#fef2f2":"#f3f4f6",
                    color: b.status==="active"?"#166534":b.status==="pending"?"#92400e":b.status==="cancelled"?"#dc2626":"#374151",
                    borderRadius:4, padding:"2px 8px", fontSize:11, fontWeight:700
                  }}>{b.status?.toUpperCase()}</span>
                </div>
                <div style={{ display:"flex", gap:16, fontSize:13, color:"#6b7280", flexWrap:"wrap" }}>
                  <span>👤 {b.customerName || b.userName || b.userId}</span>
                  <span>📱 {b.phone || "No phone"}</span>
                  <span>💰 ₹{(b.totalPrice||b.totalAmount||0).toLocaleString()}</span>
                  <span>📅 {b.duration} {b.durationType || "month"}(s)</span>
                  <span>🗓 {b.startDate ? new Date(b.startDate).toLocaleDateString() : "N/A"} → {b.endDate ? new Date(b.endDate).toLocaleDateString() : "N/A"}</span>
                </div>
                {b.deliveryAddress && (
                  <p style={{ fontSize:12, color:"#9ca3af", margin:"4px 0 0" }}>📍 {b.deliveryAddress}</p>
                )}
              </div>
              <div style={{ display:"flex", gap:8, marginLeft:16 }}>
                {b.status === "pending" && (
                  <>
                    <button onClick={() => updateStatus(b._id, "active")} disabled={updating===b._id}
                      style={{ background:"#dcfce7", color:"#166534", border:"1px solid #86efac", borderRadius:8, padding:"8px 16px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                      {updating===b._id ? "..." : "✅ Approve"}
                    </button>
                    <button onClick={() => updateStatus(b._id, "cancelled")} disabled={updating===b._id}
                      style={{ background:"#fef2f2", color:"#dc2626", border:"1px solid #fca5a5", borderRadius:8, padding:"8px 16px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                      {updating===b._id ? "..." : "❌ Reject"}
                    </button>
                  </>
                )}
                {b.status === "active" && (
                  <button onClick={() => updateStatus(b._id, "completed")} disabled={updating===b._id}
                    style={{ background:"#eff6ff", color:"#1a56db", border:"1px solid #bfdbfe", borderRadius:8, padding:"8px 16px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                    {updating===b._id ? "..." : "🏁 Complete"}
                  </button>
                )}
                {(b.status === "active" || b.status === "pending") && (
                  <button onClick={() => updateStatus(b._id, "cancelled")} disabled={updating===b._id}
                    style={{ background:"#f3f4f6", color:"#6b7280", border:"1px solid #e5e7eb", borderRadius:8, padding:"8px 16px", fontWeight:600, fontSize:13, cursor:"pointer" }}>
                    {updating===b._id ? "..." : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminAnalytics() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("../../services/api").then(({ adminService }) => {
      adminService.getAnalytics().then(res => { setData(res.data); setLoading(false); }).catch(() => setLoading(false));
    });
  }, []);

  const monthly = data?.monthlyRevenue || [{label:"Dec"},{label:"Jan"},{label:"Feb"},{label:"Mar"},{label:"Apr"},{label:"May"}];
  const max = Math.max(...monthly.map(m => m.revenue || 0), 1);

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem" }}>
      <IBMBadge text="IBM Cloudant Analytics" />
      <h1 style={{ fontWeight:800, fontSize:26, margin:"0.75rem 0 1.5rem" }}>Revenue Analytics</h1>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:"2rem" }}>
        {[
          [`₹${(data?.summary?.totalRevenue||0).toLocaleString()}`, "Total Revenue",    "#1a56db","#eff6ff"],
          [String(data?.summary?.totalBookings||0),                  "Total Bookings",   "#7e3af2","#f5f3ff"],
          [String(data?.summary?.activeBookings||0),                 "Active Rentals",   "#0e9f6e","#f0fdf4"],
          [String(data?.summary?.avgRating||"0.0"),                  "Avg. Rating",      "#e3a008","#fffbeb"],
        ].map(([v,l,c,bg]) => (
          <div key={l} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:"1.5rem" }}>
            <p style={{ fontWeight:800, fontSize:26, margin:"0 0 4px", color:c }}>{loading ? "..." : v}</p>
            <p style={{ color:"#6b7280", fontSize:13, margin:0 }}>{l}</p>
          </div>
        ))}
      </div>
      <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:"1.5rem", marginBottom:"1.5rem" }}>
        <h2 style={{ fontWeight:700, fontSize:18, margin:"0 0 1.5rem" }}>Monthly Revenue (₹)</h2>
        <div style={{ display:"flex", gap:10, alignItems:"flex-end", height:160 }}>
          {monthly.map((m, i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:11, color:"#374151", fontWeight:600 }}>₹{((m.revenue||0)/1000).toFixed(0)}K</span>
              <div style={{ width:"100%", height:`${Math.max(10,((m.revenue||0)/max)*100)}%`, background:"linear-gradient(to top,#1a56db,#7e3af2)", borderRadius:"6px 6px 0 0" }} />
              <span style={{ fontSize:11, color:"#9ca3af" }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:"1.5rem" }}>
          <h2 style={{ fontWeight:700, fontSize:16, margin:"0 0 1rem" }}>Category Breakdown</h2>
          {Object.entries(data?.categoryBreakdown || { appliances:0, vehicles:0, furniture:0, electronics:0 }).map(([cat, count]) => (
            <div key={cat} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}>
                <span style={{ fontWeight:600, textTransform:"capitalize" }}>{cat}</span>
                <span style={{ color:"#6b7280" }}>{count} bookings</span>
              </div>
              <div style={{ height:6, background:"#f3f4f6", borderRadius:3 }}>
                <div style={{ height:"100%", width:`${Math.min(100, (count / (data?.summary?.totalBookings||1)) * 100)}%`, background:"linear-gradient(to right,#1a56db,#7e3af2)", borderRadius:3 }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:"linear-gradient(135deg,#0f172a,#1e1b4b)", borderRadius:16, padding:"1.5rem" }}>
          <IBMBadge text="IBM Cloudant Live Data" />
          <p style={{ color:"#94a3b8", fontSize:13, margin:"1rem 0" }}>Analytics powered by real-time IBM Cloudant queries.</p>
          {[
            ["Total Documents",  data?.ibmCloud?.dbDocuments || 0],
            ["Total Users",      data?.summary?.totalUsers || 0],
            ["Total Products",   data?.summary?.totalProducts || 0],
            ["Pending Bookings", data?.summary?.pendingBookings || 0],
          ].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ color:"#64748b", fontSize:12 }}>{k}</span>
              <span style={{ color:"#fff", fontSize:12, fontWeight:600 }}>{loading ? "..." : v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
