import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IBMBadge } from "../components/UI";

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]     = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields"); return; }
    setLoading(true); setError("");
    try {
      const user = await login(form.email, form.password);
      if (user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", background:"#f8fafc" }}>
      <div style={{ width:"100%", maxWidth:420, background:"#fff", borderRadius:20, padding:"2rem", border:"1px solid #e5e7eb", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#1a56db,#7e3af2)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem", fontSize:24 }}>🔐</div>
          <h1 style={{ fontWeight:800, fontSize:24, margin:"0 0 8px" }}>Welcome Back</h1>
          <IBMBadge text="Secured by IBM App ID" />
        </div>

        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {[["email","Email","you@example.com","email"],["password","Password","••••••••","password"]].map(([key,label,ph,type]) => (
            <div key={key}>
              <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm(f => ({...f,[key]:e.target.value}))} placeholder={ph}
                style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", boxSizing:"border-box" }} />
            </div>
          ))}

          {error && <p style={{ color:"#dc2626", fontSize:13, margin:0, background:"#fef2f2", padding:"8px 12px", borderRadius:8 }}>{error}</p>}

          <button type="submit" disabled={loading}
            style={{ background:"linear-gradient(135deg,#1a56db,#7e3af2)", color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:15, cursor:loading?"not-allowed":"pointer", opacity:loading?0.8:1 }}>
            {loading ? "Authenticating via IBM App ID…" : "Sign In"}
          </button>

          <div style={{ textAlign:"center" }}>
            <Link to="/forgot" style={{ color:"#6b7280", fontSize:13 }}>Forgot password?</Link>
          </div>
          <div style={{ textAlign:"center" }}>
            <Link to="/signup" style={{ color:"#1a56db", fontSize:14, fontWeight:600 }}>Don't have an account? Sign up free</Link>
          </div>
        </form>

        <div style={{ marginTop:"1.5rem", padding:"1rem", background:"#f8fafc", borderRadius:10, fontSize:12, color:"#6b7280" }}>
          <strong>Demo credentials:</strong><br />
          Admin: admin@rentease.com / any password<br />
          User: user@rentease.com / any password
        </div>
      </div>
    </div>
  );
}
