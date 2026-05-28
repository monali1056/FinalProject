import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IBMBadge } from "../components/UI";

export default function Signup() {
  const { signup } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]     = useState({ name:"", email:"", password:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields"); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try {
      await signup(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    ["name",    "Full Name",        "Your full name",   "text"],
    ["email",   "Email Address",    "you@example.com",  "email"],
    ["password","Password",         "Min. 6 characters","password"],
    ["confirm", "Confirm Password", "••••••••",         "password"],
  ];

  return (
    <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", background:"#f8fafc" }}>
      <div style={{ width:"100%", maxWidth:440, background:"#fff", borderRadius:20, padding:"2rem", border:"1px solid #e5e7eb", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#0e9f6e,#1a56db)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem", fontSize:24 }}>✨</div>
          <h1 style={{ fontWeight:800, fontSize:24, margin:"0 0 8px" }}>Create Account</h1>
          <IBMBadge text="Registered via IBM App ID" />
        </div>

        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:13 }}>
          {fields.map(([key,label,ph,type]) => (
            <div key={key}>
              <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:4 }}>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm(f => ({...f,[key]:e.target.value}))} placeholder={ph}
                style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", boxSizing:"border-box" }} />
            </div>
          ))}

          {error && <p style={{ color:"#dc2626", fontSize:13, margin:0, background:"#fef2f2", padding:"8px 12px", borderRadius:8 }}>{error}</p>}

          <button type="submit" disabled={loading}
            style={{ background:"linear-gradient(135deg,#1a56db,#7e3af2)", color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:15, cursor:"pointer", marginTop:4 }}>
            {loading ? "Creating account on IBM Cloud…" : "Create Free Account"}
          </button>

          <p style={{ textAlign:"center", fontSize:12, color:"#9ca3af" }}>
            By signing up you agree to our <Link to="/terms" style={{ color:"#1a56db" }}>Terms</Link> & <Link to="/privacy" style={{ color:"#1a56db" }}>Privacy Policy</Link>
          </p>
          <div style={{ textAlign:"center" }}>
            <Link to="/login" style={{ color:"#1a56db", fontSize:14, fontWeight:600 }}>Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
