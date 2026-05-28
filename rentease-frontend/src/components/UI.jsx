// ── IBMBadge ─────────────────────────────────────────────────────────────────
export function IBMBadge({ text = "Powered by IBM Cloud" }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600, color:"#1a56db" }}>
      ☁️ {text}
    </span>
  );
}

// ── IBMServiceBadge ────────────────────────────────────────────────────────────
export function IBMServiceBadge({ service }) {
  const map = {
    appid:    { icon:"🔐", label:"IBM App ID",   color:"#1a56db", bg:"#eff6ff" },
    cloudant: { icon:"🗄️", label:"IBM Cloudant", color:"#0e9f6e", bg:"#f0fdf4" },
    watson:   { icon:"🤖", label:"IBM Watson",   color:"#7e3af2", bg:"#f5f3ff" },
    cloud:    { icon:"☁️", label:"IBM Cloud",    color:"#e3a008", bg:"#fffbeb" },
  };
  const s = map[service] || map.cloud;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:s.bg, border:`1px solid ${s.color}40`, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600, color:s.color }}>
      {s.icon} {s.label}
    </span>
  );
}

// ── ProductCard ────────────────────────────────────────────────────────────────
export function ProductCard({ product, onWishlist, wishlisted, onClick }) {
  return (
    <div
      onClick={() => onClick?.(product)}
      className="card-hover"
      style={{ background:"#fff", borderRadius:16, border:"1px solid #e5e7eb", overflow:"hidden", cursor:"pointer", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}
    >
      {/* Image area */}
      <div style={{ background:"linear-gradient(135deg,#f8fafc,#f1f5f9)", height:160, display:"flex", alignItems:"center", justifyContent:"center", fontSize:64, position:"relative" }}>
       {product.image || ({
          vehicles: "🚗",
          bikes: "🏍️",
          appliances: "❄️",
          furniture: "🛋️",
          electronics: "💻",
          other: "📦"
        })[product.category] || "📦"}
        {product.badge && (
          <span style={{ position:"absolute", top:12, left:12, background:"#1a56db", color:"#fff", fontSize:11, fontWeight:700, borderRadius:6, padding:"3px 8px" }}>{product.badge}</span>
        )}
        {!product.available && (
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontWeight:700, fontSize:13 }}>Unavailable</span>
          </div>
        )}
        <button
          onClick={e => { e.stopPropagation(); onWishlist?.(product.id); }}
          style={{ position:"absolute", top:12, right:12, width:32, height:32, borderRadius:"50%", background:"#fff", border:"none", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.12)" }}
        >{wishlisted ? "❤️" : "🤍"}</button>
      </div>

      {/* Info */}
      <div style={{ padding:"1rem" }}>
        <p style={{ fontWeight:700, fontSize:15, margin:"0 0 4px", color:"#111827" }}>{product.name}</p>
        <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:8 }}>
          <span style={{ color:"#f59e0b" }}>{"★".repeat(Math.floor(product.rating))}</span>
          <span style={{ fontSize:12, color:"#6b7280" }}>{product.rating} ({product.reviews} reviews)</span>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:12 }}>
          {(product.features || []).slice(0,3).map(f => (
            <span key={f} style={{ background:"#f3f4f6", color:"#374151", fontSize:11, padding:"2px 7px", borderRadius:4 }}>{f}</span>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <span style={{ fontWeight:800, fontSize:18, color:"#111827" }}>₹{product.price?.toLocaleString()}</span>
            <span style={{ fontSize:12, color:"#9ca3af" }}>/{product.period || "month"}</span>
          </div>
          <button
            style={{ background: product.available ? "linear-gradient(135deg,#1a56db,#7e3af2)" : "#e5e7eb", color: product.available ? "#fff" : "#9ca3af", border:"none", borderRadius:8, padding:"8px 14px", fontSize:13, fontWeight:600, cursor: product.available ? "pointer" : "not-allowed" }}
            disabled={!product.available}
          >
            {product.available ? "Rent Now" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SkeletonCard ───────────────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e5e7eb", overflow:"hidden" }}>
      <div className="skeleton" style={{ height:160 }} />
      <div style={{ padding:"1rem", display:"flex", flexDirection:"column", gap:8 }}>
        <div className="skeleton" style={{ height:16, width:"70%" }} />
        <div className="skeleton" style={{ height:12, width:"40%" }} />
        <div style={{ display:"flex", gap:6 }}>
          <div className="skeleton" style={{ height:20, width:60, borderRadius:4 }} />
          <div className="skeleton" style={{ height:20, width:60, borderRadius:4 }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:4 }}>
          <div className="skeleton" style={{ height:24, width:80 }} />
          <div className="skeleton" style={{ height:34, width:90, borderRadius:8 }} />
        </div>
      </div>
    </div>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────────────
export function StatCard({ icon, value, label, color = "#1a56db", bg = "#eff6ff" }) {
  return (
    <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:"1.5rem" }}>
      <div style={{ width:44, height:44, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:12 }}>{icon}</div>
      <p style={{ fontWeight:800, fontSize:26, margin:"0 0 4px", color:"#111827" }}>{value}</p>
      <p style={{ color:"#6b7280", fontSize:13, margin:0 }}>{label}</p>
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon = "📭", title, subtitle, action }) {
  return (
    <div style={{ textAlign:"center", padding:"4rem 2rem" }}>
      <div style={{ fontSize:48, marginBottom:"1rem" }}>{icon}</div>
      <h3 style={{ fontWeight:700, fontSize:18, margin:"0 0 0.5rem" }}>{title}</h3>
      {subtitle && <p style={{ color:"#6b7280", margin:"0 0 1.5rem" }}>{subtitle}</p>}
      {action}
    </div>
  );
}
