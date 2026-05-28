import { IBMBadge } from "../components/UI";

export default function Privacy() {
  const sections = [
    ["Data We Collect",         "We collect your name, email, and phone number (via IBM App ID registration), booking history, product preferences, and payment records — all stored on IBM Cloudant."],
    ["How We Use Your Data",    "Your data is used to manage your rentals, personalise Watson AI recommendations, process payments, and send rental notifications."],
    ["IBM Cloud Data Security", "All data is stored on IBM Cloudant with AES-256 encryption at rest and TLS in transit. Authentication is handled by IBM App ID with JWT tokens. No data is sold to third parties."],
    ["Watson AI & Your Data",   "IBM Watson Assistant processes your chat messages to provide rental assistance. Conversations may be anonymously logged to improve AI accuracy."],
    ["Your Rights",             "You may request access to, correction of, or deletion of your personal data at any time by contacting support@rentease.ai."],
    ["Cookies",                 "We use session cookies for IBM App ID authentication and localStorage for wishlist preferences. No third-party advertising cookies are used."],
    ["Updates to This Policy",  "We may update this policy periodically. Significant changes will be communicated via email or in-app notification."],
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 2rem" }}>
      <IBMBadge text="IBM Cloud Data Protection" />
      <h1 style={{ fontWeight: 900, fontSize: 30, margin: "1rem 0 0.25rem" }}>Privacy Policy</h1>
      <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: "2rem" }}>Last updated: May 2025</p>

      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 14, padding: "1rem 1.25rem", marginBottom: "2rem", display: "flex", gap: 10 }}>
        <span style={{ fontSize: 20 }}>🔐</span>
        <p style={{ fontSize: 14, color: "#1e40af", margin: 0, lineHeight: 1.6 }}>
          Your data is protected by <strong>IBM App ID</strong> authentication and stored on <strong>IBM Cloudant</strong> with enterprise-grade encryption. We take privacy seriously.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {sections.map(([title, body]) => (
          <div key={title} style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: "1.25rem" }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, margin: "0 0 8px", color: "#111827" }}>{title}</h2>
            <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.8, margin: 0 }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
