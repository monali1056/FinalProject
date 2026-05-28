import { useState, useEffect } from "react";
import { IBMBadge } from "../../components/UI";
import { adminService } from "../../services/api";

export function AdminContacts() {
  const [contacts,  setContacts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [filter,    setFilter]    = useState("all"); // all | watson | form
  const [search,    setSearch]    = useState("");

  useEffect(() => {
    adminService.getContacts()
      .then(res => setContacts(res.data))
      .catch(() => setError("Failed to load enquiries."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = contacts
    .filter(c => {
      if (filter === "watson") return c.source?.includes("watson");
      if (filter === "form")   return !c.source?.includes("watson");
      return true;
    })
    .filter(c =>
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.message?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase())
    );

  const watsonCount = contacts.filter(c => c.source?.includes("watson")).length;
  const formCount   = contacts.filter(c => !c.source?.includes("watson")).length;

  const formatDate = (iso) => iso
    ? new Date(iso).toLocaleString("en-IN", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })
    : "—";

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem" }}>
      <IBMBadge text="IBM Cloudant — Contacts DB" />
      <h1 style={{ fontWeight:800, fontSize:26, margin:"0.75rem 0 0.5rem" }}>📩 Enquiries & Chat Logs</h1>
      <p style={{ color:"#6b7280", marginBottom:"1.5rem" }}>
        All user enquiries from Watson chatbot and contact form — saved to IBM Cloudant
      </p>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:"1.5rem" }}>
        {[
          { label:"Total Enquiries",   value: contacts.length,  color:"#1a56db", bg:"#eff6ff",  icon:"📩" },
          { label:"Watson Chat Logs",  value: watsonCount,      color:"#7e3af2", bg:"#f5f3ff",  icon:"🤖" },
          { label:"Contact Form",      value: formCount,        color:"#0e9f6e", bg:"#f0fdf4",  icon:"📋" },
        ].map(s => (
          <div key={s.label} style={{ background:s.bg, border:`1px solid ${s.color}20`, borderRadius:14, padding:"1rem 1.25rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ fontSize:20 }}>{s.icon}</span>
              <span style={{ fontWeight:800, fontSize:24, color:s.color }}>{s.value}</span>
            </div>
            <p style={{ color:"#6b7280", fontSize:13, margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:10, marginBottom:"1rem", flexWrap:"wrap" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search enquiries…"
          style={{ flex:1, minWidth:200, border:"1px solid #e5e7eb", borderRadius:10, padding:"9px 14px", fontSize:14, outline:"none" }}
        />
        {["all","watson","form"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:"8px 16px", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer",
            border:`2px solid ${filter === f ? "#1a56db" : "#e5e7eb"}`,
            background: filter === f ? "#eff6ff" : "#fff",
            color:      filter === f ? "#1a56db" : "#6b7280",
          }}>
            {f === "all" ? "All" : f === "watson" ? "🤖 Watson" : "📋 Contact Form"}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign:"center", padding:"3rem", color:"#9ca3af" }}>
          ⏳ Loading from IBM Cloudant…
        </div>
      )}

      {error && (
        <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"1rem", color:"#dc2626" }}>
          {error}
        </div>
      )}

      {!loading && filtered.length === 0 && !error && (
        <div style={{ textAlign:"center", padding:"3rem", color:"#9ca3af" }}>
          <div style={{ fontSize:48, marginBottom:"1rem" }}>📭</div>
          <p style={{ fontWeight:600 }}>No enquiries yet</p>
          <p style={{ fontSize:13 }}>Watson chat logs and contact form submissions will appear here.</p>
        </div>
      )}

      {/* Enquiries list */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map((c, i) => {
          const isWatson = c.source?.includes("watson");
          return (
            <div key={c._id || i} style={{
              background:"#fff",
              border:`1px solid ${isWatson ? "#e9d5ff" : "#e5e7eb"}`,
              borderLeft:`4px solid ${isWatson ? "#7e3af2" : "#1a56db"}`,
              borderRadius:14, padding:"1.25rem",
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8, flexWrap:"wrap", gap:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:20 }}>{isWatson ? "🤖" : "👤"}</span>
                  <div>
                    <p style={{ fontWeight:700, fontSize:14, margin:0 }}>{c.name}</p>
                    <p style={{ color:"#6b7280", fontSize:12, margin:0 }}>{c.email}</p>
                  </div>
                  <span style={{
                    background: isWatson ? "#f5f3ff" : "#eff6ff",
                    color:      isWatson ? "#7e3af2" : "#1a56db",
                    fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:4
                  }}>
                    {isWatson ? "Watson Chat" : "Contact Form"}
                  </span>
                </div>
                <span style={{ fontSize:12, color:"#9ca3af" }}>{formatDate(c.createdAt)}</span>
              </div>

              <p style={{ fontWeight:600, fontSize:13, color:"#374151", margin:"0 0 6px" }}>
                📌 {c.subject}
              </p>
              <p style={{ color:"#6b7280", fontSize:13, margin:0, lineHeight:1.6, background:"#f8fafc", padding:"10px 14px", borderRadius:8 }}>
                {c.message}
              </p>

              <div style={{ display:"flex", gap:8, marginTop:10 }}>
                <a href={`mailto:${c.email}?subject=Re: ${c.subject}`}
                  style={{ background:"#eff6ff", color:"#1a56db", border:"none", borderRadius:8, padding:"5px 12px", fontSize:12, fontWeight:600, textDecoration:"none", cursor:"pointer" }}>
                  ✉️ Reply
                </a>
                <span style={{
                  background: c.status === "read" ? "#f3f4f6" : "#fef3c7",
                  color:      c.status === "read" ? "#6b7280"  : "#92400e",
                  borderRadius:8, padding:"5px 12px", fontSize:12, fontWeight:600
                }}>
                  {c.status === "read" ? "✓ Read" : "● New"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminContacts;
