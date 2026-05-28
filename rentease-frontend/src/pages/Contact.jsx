import { useState } from "react";
import { IBMBadge } from "../components/UI";

export default function Contact() {
  const [form, setForm]   = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1400);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
      <IBMBadge />
      <h1 style={{ fontWeight: 900, fontSize: 32, margin: "1rem 0 0.5rem" }}>Contact Us</h1>
      <p style={{ color: "#6b7280", marginBottom: "2.5rem" }}>We're here to help. Reach out via the form or contact details below.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* Form */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: "2rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: 20, margin: "0 0 1.5rem" }}>Send a Message</h2>
          {sent ? (
            <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: 12, padding: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
              <p style={{ color: "#166534", fontWeight: 700, fontSize: 16, margin: "0 0 4px" }}>Message Sent!</p>
              <p style={{ color: "#166534", fontSize: 13, margin: 0 }}>Our team will reply within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["name","Your Name","text"],["email","Email Address","email"],["subject","Subject","text"]].map(([key,label,type]) => (
                <div key={key}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({...f,[key]:e.target.value}))}
                    style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Message</label>
                <textarea value={form.message} onChange={e => setForm(f => ({...f,message:e.target.value}))} rows={5}
                  style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical" }} />
              </div>
              <button type="submit" disabled={loading} style={{ background: "linear-gradient(135deg,#1a56db,#7e3af2)", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                {loading ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 20, margin: "0 0 1.5rem" }}>Get in Touch</h2>
          {[
            ["📧 Email",    "support@rentease.ai"],
            ["📞 Phone",    "+91 80001 00001"],
            ["📍 Address",  "Bangalore, Karnataka, India"],
            ["🕐 Hours",    "Mon–Sat, 9am–8pm IST"],
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", gap: 12, marginBottom: "1.25rem" }}>
              <span style={{ fontWeight: 700, fontSize: 14, minWidth: 110 }}>{label}</span>
              <span style={{ color: "#6b7280", fontSize: 14 }}>{val}</span>
            </div>
          ))}

          <div style={{ background: "linear-gradient(135deg,#0f172a,#1e1b4b)", borderRadius: 16, padding: "1.5rem", marginTop: "2rem" }}>
            <p style={{ color: "#60a5fa", fontWeight: 700, fontSize: 14, margin: "0 0 0.75rem" }}>🤖 Try Watson AI Chat</p>
            <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 1rem", lineHeight: 1.6 }}>
              Get instant answers 24/7 from our IBM Watson Assistant. Click the chat icon in the bottom-right corner.
            </p>
            <IBMBadge text="Powered by IBM Watson" />
          </div>
        </div>
      </div>
    </div>
  );
}
