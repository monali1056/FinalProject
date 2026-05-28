import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IBMBadge, StatCard } from "../../components/UI";
import { IBM_SERVICES } from "../../data/mockData";
import { adminService, bookingService } from "../../services/api";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  useEffect(() => {
    Promise.all([
      adminService.getAnalytics(),
      bookingService.getAllBookings(),
    ]).then(([aRes, bRes]) => {
      setAnalytics(aRes.data);
      setBookings(bRes.data || []);
      setLoading(false);
    }).catch(err => {
      setError("Failed to load dashboard data.");
      setLoading(false);
    });
  }, []);

  const stats = analytics ? [
    { icon:"📈", value:`₹${(analytics.summary.totalRevenue||0).toLocaleString()}`, label:"Total Revenue",  color:"#0e9f6e", bg:"#f0fdf4" },
    { icon:"📦", value:String(analytics.summary.activeBookings||0),   label:"Active Rentals",  color:"#1a56db", bg:"#eff6ff" },
    { icon:"👥", value:String(analytics.summary.totalUsers||0),       label:"Total Users",     color:"#7e3af2", bg:"#f5f3ff" },
    { icon:"⭐", value:String(analytics.summary.avgRating||"0.0"),    label:"Avg. Rating",     color:"#e3a008", bg:"#fffbeb" },
  ] : [
    { icon:"📈", value:"...", label:"Total Revenue",  color:"#0e9f6e", bg:"#f0fdf4" },
    { icon:"📦", value:"...", label:"Active Rentals",  color:"#1a56db", bg:"#eff6ff" },
    { icon:"👥", value:"...", label:"Total Users",     color:"#7e3af2", bg:"#f5f3ff" },
    { icon:"⭐", value:"...", label:"Avg. Rating",     color:"#e3a008", bg:"#fffbeb" },
  ];

  const pending  = bookings.filter(b => b.status === "pending").length;
  const recent   = bookings.slice(0, 5);

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"2rem" }}>
        <div>
          <IBMBadge text="IBM Cloud Admin Console" />
          <h1 style={{ fontWeight:800, fontSize:28, margin:"0.75rem 0 0.25rem" }}>⚙️ Admin Dashboard</h1>
          <p style={{ color:"#6b7280" }}>Manage products, users, bookings & analytics</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Link to="/admin/products/add" style={{ background:"linear-gradient(135deg,#1a56db,#7e3af2)", color:"#fff", borderRadius:10, padding:"10px 18px", fontWeight:600, fontSize:14, textDecoration:"none" }}>+ Add Product</Link>
          <Link to="/admin/analytics"   style={{ background:"#fff", color:"#374151", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 18px", fontWeight:600, fontSize:14, textDecoration:"none" }}>📊 Analytics</Link>
        </div>
      </div>

      {error && (
        <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:10, padding:"1rem", marginBottom:"1.5rem", color:"#dc2626" }}>
          ✕ {error} — <span style={{ cursor:"pointer", textDecoration:"underline" }} onClick={() => window.location.reload()}>Retry</span>
        </div>
      )}

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:"2rem" }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Pending alert */}
      {pending > 0 && (
        <div style={{ background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:12, padding:"1rem 1.5rem", marginBottom:"1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontWeight:700, color:"#92400e" }}>⏳ {pending} booking(s) waiting for approval</span>
          <Link to="/admin/bookings" style={{ background:"#f59e0b", color:"#fff", borderRadius:8, padding:"6px 14px", fontWeight:700, fontSize:13, textDecoration:"none" }}>Review Now →</Link>
        </div>
      )}

      {/* Revenue chart */}
      <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:"1.5rem", marginBottom:"2rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
          <h2 style={{ fontWeight:700, fontSize:18, margin:0 }}>📈 Revenue (Last 6 Months)</h2>
          <IBMBadge text="IBM Cloudant Analytics" />
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"flex-end", height:120 }}>
          {(analytics?.monthlyRevenue || [{label:"Dec"},{label:"Jan"},{label:"Feb"},{label:"Mar"},{label:"Apr"},{label:"May"}]).map((m, i) => {
            const maxRev = Math.max(...(analytics?.monthlyRevenue||[]).map(x=>x.revenue||0), 1);
            const h = analytics ? Math.max(10, ((m.revenue||0)/maxRev)*100) : [60,75,55,90,85,100][i];
            return (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <span style={{ fontSize:10, color:"#6b7280" }}>₹{((m.revenue||0)/1000).toFixed(0)}k</span>
                <div style={{ width:"100%", height:`${h}%`, background:"linear-gradient(to top,#1a56db,#7e3af2)", borderRadius:"6px 6px 0 0" }} />
                <span style={{ fontSize:11, color:"#9ca3af" }}>{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20 }}>
        {/* Recent bookings */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
            <h2 style={{ fontWeight:700, fontSize:18, margin:0 }}>Recent Bookings</h2>
            <Link to="/admin/bookings" style={{ fontSize:13, color:"#1a56db" }}>View all →</Link>
          </div>
          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", padding:"0.75rem 1.25rem", background:"#f8fafc", fontSize:12, fontWeight:700, color:"#6b7280" }}>
              <span>CUSTOMER</span><span>PRODUCT</span><span>AMOUNT</span><span>STATUS</span>
            </div>
            {loading ? (
              <div style={{ padding:"1.5rem", textAlign:"center", color:"#9ca3af" }}>Loading...</div>
            ) : recent.length === 0 ? (
              <div style={{ padding:"1.5rem", textAlign:"center", color:"#9ca3af" }}>No bookings yet</div>
            ) : recent.map((b, i) => (
              <div key={b._id||i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", padding:"0.875rem 1.25rem", borderTop:"1px solid #f3f4f6", fontSize:14, alignItems:"center" }}>
                <span style={{ fontWeight:600 }}>{b.customerName || b.userName || "User"}</span>
                <span style={{ color:"#374151" }}>{b.productName || b.productId}</span>
                <span style={{ fontWeight:700, color:"#1a56db" }}>₹{(b.totalPrice||b.totalAmount||0).toLocaleString()}</span>
                <span style={{
                  background: b.status==="active"?"#dcfce7":b.status==="pending"?"#fef3c7":b.status==="cancelled"?"#fef2f2":"#f3f4f6",
                  color: b.status==="active"?"#166534":b.status==="pending"?"#92400e":b.status==="cancelled"?"#dc2626":"#374151",
                  borderRadius:4, padding:"2px 8px", fontSize:11, fontWeight:600, width:"fit-content"
                }}>{b.status}</span>
              </div>
            ))}
          </div>

          {/* Admin quick links */}
          <h2 style={{ fontWeight:700, fontSize:18, margin:"1.5rem 0 1rem" }}>Management</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[
              ["/admin/products", "📦 Products",  `${analytics?.summary?.totalProducts||0} items`,    "#1a56db"],
              ["/admin/users",    "👥 Users",      `${analytics?.summary?.totalUsers||0} registered`,  "#7e3af2"],
              ["/admin/bookings", "📋 Bookings",   `${pending} pending`,                               "#0e9f6e"],
              ["/admin/analytics","📊 Analytics",  "Revenue & insights",                               "#e3a008"],
            ].map(([to,label,sub,color]) => (
              <Link key={to} to={to} style={{ background:"#fff", border:`1px solid ${color}30`, borderLeft:`3px solid ${color}`, borderRadius:12, padding:"1rem", textDecoration:"none" }}>
                <p style={{ fontWeight:700, fontSize:14, margin:"0 0 4px", color:"#111827" }}>{label}</p>
                <p style={{ fontSize:12, color:"#9ca3af", margin:0 }}>{sub}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* IBM Cloud status */}
        <div>
          <h2 style={{ fontWeight:700, fontSize:18, marginBottom:"1rem" }}>IBM Cloud Status</h2>
          {IBM_SERVICES.map(svc => (
            <div key={svc.id} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"1rem", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:20 }}>{svc.icon}</span>
                <div>
                  <p style={{ fontWeight:600, fontSize:13, margin:0 }}>{svc.name}</p>
                  <p style={{ fontSize:11, color:"#9ca3af", margin:0 }}>Region: us-south</p>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80" }} />
                <span style={{ fontSize:11, color:"#4ade80", fontWeight:600 }}>LIVE</span>
              </div>
            </div>
          ))}

          {analytics?.ibmCloud && (
            <div style={{ background:"linear-gradient(135deg,#0f172a,#1e1b4b)", borderRadius:16, padding:"1.25rem", marginTop:8 }}>
              <p style={{ color:"#60a5fa", fontWeight:700, fontSize:14, margin:"0 0 8px" }}>☁️ IBM Cloud Metrics</p>
              {[
                ["Total Documents", analytics.ibmCloud.dbDocuments],
                ["Total Bookings",  analytics.summary.totalBookings],
                ["Pending",         analytics.summary.pendingBookings],
                ["Completed",       analytics.summary.completedBookings],
              ].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ color:"#94a3b8", fontSize:12 }}>{k}</span>
                  <span style={{ color:"#fff", fontSize:12, fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
