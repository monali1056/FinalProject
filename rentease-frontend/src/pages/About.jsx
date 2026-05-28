import { useNavigate } from "react-router-dom";
import { IBMBadge } from "../components/UI";

export default function About() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 2rem" }}>
      <IBMBadge />
      <h1 style={{ fontWeight: 900, fontSize: 36, margin: "1rem 0 0.5rem" }}>About RentEase AI</h1>
      <p style={{ color: "#6b7280", fontSize: 17, marginBottom: "2.5rem", lineHeight: 1.8, maxWidth: 700 }}>
        RentEase AI is India's most advanced AI-powered rental marketplace, built entirely on IBM Cloud
        infrastructure. We make renting easy, affordable, and intelligent — backed by enterprise-grade security.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: "2.5rem" }}>
        {[
          ["🎯 Our Mission",      "Make premium products accessible to everyone through flexible monthly rentals — no EMIs, no large upfront costs."],
          ["🤖 AI-Powered",       "IBM Watson Assistant provides personalised recommendations, 24/7 customer support, and smart rental guidance."],
          ["🔐 Enterprise Secure","IBM App ID ensures every user account and transaction is protected with industry-grade authentication and JWT."],
          ["🗄️ Reliable Data",    "IBM Cloudant NoSQL database offers 99.99% uptime, automatic scaling, and real-time sync for all platform data."],
          ["🌍 Pan India",        "Serving 50+ cities with 500+ products across 6 categories, growing every day with new stock."],
          ["🎓 IBM Showcase",     "Built as an IBM Student Cloud showcase project demonstrating deep integration of IBM enterprise services."],
        ].map(([title, desc]) => (
          <div key={title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "1.5rem" }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, margin: "0 0 8px" }}>{title}</h3>
            <p style={{ color: "#6b7280", fontSize: 14, margin: 0, lineHeight: 1.7 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Team / Project info */}
      <div style={{ background: "#f8fafc", borderRadius: 20, padding: "2rem", marginBottom: "2rem" }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, margin: "0 0 1rem" }}>🏆 Project Highlights</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          {[["4","IBM Services Used"],["30+","Pages Built"],["12","REST API Endpoints"],["500+","Products Listed"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center", background: "#fff", borderRadius: 12, padding: "1.25rem", border: "1px solid #e5e7eb" }}>
              <p style={{ fontWeight: 900, fontSize: 32, margin: "0 0 4px", background: "linear-gradient(135deg,#1a56db,#7e3af2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{n}</p>
              <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg,#1a56db,#7e3af2)", borderRadius: 20, padding: "2.5rem", textAlign: "center" }}>
        <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 24, margin: "0 0 0.75rem" }}>Built on IBM Student Cloud Account</h2>
        <p style={{ color: "rgba(255,255,255,0.8)", margin: "0 0 1.5rem" }}>
          This project showcases real-world IBM Cloud integration — App ID, Cloudant, Watson Assistant and IBM Cloud hosting.
        </p>
        <button onClick={() => navigate("/ibm-cloud")} style={{ background: "#fff", color: "#1a56db", border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
          View IBM Architecture →
        </button>
      </div>
    </div>
  );
}
