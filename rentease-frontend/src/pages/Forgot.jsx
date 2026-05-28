import { useState } from "react";
import { Link } from "react-router-dom";
import { IBMBadge } from "../components/UI";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [sent,  setSent]  = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  return (
    <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", background:"#f8fafc" }}>
      <div style={{ width:"100%", maxWidth:420, background:"#fff", borderRadius:20, padding:"2rem", border:"1px solid #e5e7eb", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#e3a008,#1a56db)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem", fontSize:24 }}>🔑</div>
          <h1 style={{ fontWeight:800, fontSize:24, margin:"0 0 8px" }}>Reset Password</h1>
          <IBMBadge text="Powered by IBM App ID" />
          <p style={{ color:"#6b7280", fontSize:14, marginTop:"1rem" }}>We'll send a secure reset link to your email via IBM App ID.</p>
        </div>

        {sent ? (
          <div style={{ background:"#dcfce7", border:"1px solid #86efac", borderRadius:12, padding:"1.5rem", textAlign:"center" }}>
            <div style={{ fontSize:32, marginBottom:8 }}>📧</div>
            <p style={{ color:"#166534", fontWeight:700, fontSize:16, margin:"0 0 4px" }}>Reset Link Sent!</p>
            <p style={{ color:"#166534", fontSize:13, margin:0 }}>Check your inbox and follow the instructions from IBM App ID.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:4 }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", boxSizing:"border-box" }} />
            </div>
            <button type="submit" disabled={loading}
              style={{ background:"linear-gradient(135deg,#1a56db,#7e3af2)", color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:15, cursor:"pointer" }}>
              {loading ? "Sending via IBM App ID…" : "Send Reset Link"}
            </button>
          </form>
        )}

        <div style={{ textAlign:"center", marginTop:"1.5rem" }}>
          <Link to="/login" style={{ color:"#6b7280", fontSize:14 }}>← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
