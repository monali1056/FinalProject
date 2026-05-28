import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background:"#111827", color:"#9ca3af", padding:"3rem 2rem 2rem" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:24, marginBottom:"2rem" }}>

          {/* Brand */}
          <div>
            <Link to="/" style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1rem", textDecoration:"none" }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#1a56db,#7e3af2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800 }}>R</div>
              <span style={{ color:"#fff", fontWeight:800 }}>RentEase AI</span>
            </Link>
            <p style={{ fontSize:13, lineHeight:1.7, marginBottom:"1rem" }}>India's AI-powered rental marketplace. Built on IBM Cloud infrastructure.</p>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(26,86,219,0.2)", border:"1px solid rgba(26,86,219,0.4)", borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:600, color:"#60a5fa" }}>
              ☁️ Powered by IBM Cloud
            </div>
          </div>

          {/* Links */}
          {[
            ["Products", [["Vehicles","/products"],["Appliances","/products"],["Furniture","/products"],["Electronics","/products"],["Bikes","/products"]]],
            ["Company",  [["About","/about"],["Contact","/contact"],["FAQ","/faq"]]],
            ["Legal",    [["Terms","/terms"],["Privacy","/privacy"]]],
          ].map(([title, links]) => (
            <div key={title}>
              <h4 style={{ color:"#fff", fontWeight:700, marginBottom:"0.75rem", fontSize:14 }}>{title}</h4>
              {links.map(([label, to]) => (
                <Link key={label} to={to} style={{ display:"block", color:"#9ca3af", fontSize:13, textDecoration:"none", padding:"3px 0" }}
                  onMouseEnter={e => e.target.style.color="#fff"}
                  onMouseLeave={e => e.target.style.color="#9ca3af"}
                >{label}</Link>
              ))}
            </div>
          ))}

          {/* IBM Services */}
          <div>
            <h4 style={{ color:"#fff", fontWeight:700, marginBottom:"0.75rem", fontSize:14 }}>IBM Cloud Services</h4>
            {[["🔐","IBM App ID","Auth"],["🗄️","IBM Cloudant","Database"],["🤖","Watson","AI Chatbot"],["☁️","IBM Cloud","Hosting"]].map(([icon,name,role]) => (
              <div key={name} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <span style={{ fontSize:14 }}>{icon}</span>
                <div>
                  <span style={{ color:"#e2e8f0", fontSize:12, fontWeight:600 }}>{name}</span>
                  <span style={{ color:"#64748b", fontSize:11 }}> — {role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop:"1px solid #374151", paddingTop:"1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <p style={{ fontSize:13, margin:0 }}>© {new Date().getFullYear()} RentEase AI. All rights reserved.</p>
          <p style={{ fontSize:11, margin:0 }}>🔐 IBM App ID · 🗄️ IBM Cloudant · 🤖 Watson Assistant · ☁️ IBM Cloud</p>
        </div>
      </div>
    </footer>
  );
}
