import { useState } from "react";
import { IBMBadge } from "../components/UI";

const FAQS = [
  { q: "How does RentEase AI work?",          a: "Browse our 500+ products, choose a rental duration (1–12 months), pay the monthly fee + refundable deposit, and we deliver & install it. It's that simple!" },
  { q: "Is my payment information secure?",   a: "Yes! All authentication is handled by IBM App ID, and your data is stored on IBM Cloudant with enterprise-grade encryption. We never store card details directly." },
  { q: "What is the minimum rental period?",  a: "Our minimum rental period is 1 month. Longer rentals (6 or 12 months) come with discounts of 5–10%." },
  { q: "How does the security deposit work?", a: "A refundable deposit (typically 2–5x the monthly rent) is collected at the start. It's fully refunded when you return the product in good condition." },
  { q: "Can I extend my rental?",             a: "Yes, you can extend from your dashboard at any time before the rental end date. Your Watson AI assistant can also help with this." },
  { q: "What if a product breaks down?",      a: "We offer free maintenance and repairs for all rented products. Simply raise a ticket from your dashboard or chat with Watson." },
  { q: "How do I return a product?",          a: "Schedule a pickup from your My Rentals page at least 3 days before your rental ends. Our team will collect it from your doorstep." },
  { q: "What is IBM Watson in this app?",     a: "IBM Watson Assistant is our AI chatbot that provides smart rental recommendations, answers your questions, and helps you through the booking process 24/7." },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 2rem" }}>
      <IBMBadge text="AI answers by IBM Watson" />
      <h1 style={{ fontWeight: 900, fontSize: 32, margin: "1rem 0 0.5rem" }}>Frequently Asked Questions</h1>
      <p style={{ color: "#6b7280", marginBottom: "2.5rem" }}>Can't find your answer? Chat with Watson AI — bottom right corner!</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ background: "#fff", border: `1px solid ${open === i ? "#1a56db" : "#e5e7eb"}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s" }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: "100%", padding: "1.1rem 1.25rem", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}
            >
              <span style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>{faq.q}</span>
              <span style={{ fontSize: 18, color: "#9ca3af", flexShrink: 0, marginLeft: 12, transition: "transform 0.2s", transform: open === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
            </button>
            {open === i && (
              <div style={{ padding: "0 1.25rem 1.1rem", borderTop: "1px solid #f3f4f6" }}>
                <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.7, margin: "1rem 0 0" }}>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ background: "linear-gradient(135deg,#7e3af2,#1a56db)", borderRadius: 16, padding: "2rem", textAlign: "center", marginTop: "2.5rem" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🤖</div>
        <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 18, margin: "0 0 0.5rem" }}>Still have questions?</h3>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: "0 0 1rem" }}>Ask Watson — our IBM AI assistant — for instant answers anytime.</p>
        <IBMBadge text="Powered by IBM Watson Assistant" />
      </div>
    </div>
  );
}
