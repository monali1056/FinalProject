import { IBMBadge } from "../components/UI";

export default function Terms() {
  const sections = [
    ["1. Acceptance of Terms", "By accessing RentEase AI, you agree to these Terms of Service. The platform is powered by IBM Cloud infrastructure including IBM App ID for authentication and IBM Cloudant for data storage."],
    ["2. Rental Agreement",    "All rentals are month-to-month unless a longer duration is selected. Rental fees are charged in advance. Security deposits are refundable upon satisfactory return of products."],
    ["3. User Responsibilities","Users must provide accurate information during signup (via IBM App ID). Users are responsible for the safe and appropriate use of rented products."],
    ["4. Data & Privacy",      "Your personal data is securely stored on IBM Cloudant. We follow IBM Cloud's enterprise security standards. See our Privacy Policy for full details."],
    ["5. Payment Terms",       "Monthly rent is due on the same date each month. Late payment may result in a temporary suspension of your account via IBM App ID role management."],
    ["6. Cancellation Policy", "Rentals can be cancelled with 7 days notice. Security deposits are returned within 7 business days after product inspection."],
    ["7. Liability",           "RentEase AI is not liable for damage caused by misuse. All products are covered by standard maintenance warranties during the rental period."],
    ["8. Governing Law",       "These terms are governed by the laws of India. Disputes shall be resolved in the courts of Bangalore, Karnataka."],
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 2rem" }}>
      <IBMBadge text="Data secured on IBM Cloud" />
      <h1 style={{ fontWeight: 900, fontSize: 30, margin: "1rem 0 0.25rem" }}>Terms of Service</h1>
      <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: "2rem" }}>Last updated: May 2025</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {sections.map(([title, body]) => (
          <div key={title}>
            <h2 style={{ fontWeight: 700, fontSize: 16, margin: "0 0 8px", color: "#1a56db" }}>{title}</h2>
            <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.8, margin: 0 }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
