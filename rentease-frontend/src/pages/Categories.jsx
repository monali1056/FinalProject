import { useNavigate } from "react-router-dom";
import { IBMBadge } from "../components/UI";
import { CATEGORIES, PRODUCTS } from "../data/mockData";

export default function Categories() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      <IBMBadge text="Data from IBM Cloudant" />
      <h1 style={{ fontWeight: 800, fontSize: 28, margin: "0.75rem 0 0.5rem" }}>All Categories</h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>Browse rentals by category — 500+ products available</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {CATEGORIES.map(cat => {
          const catProducts = PRODUCTS.filter(p => p.category === cat.id);
          return (
            <div
              key={cat.id}
              onClick={() => navigate(`/products?category=${cat.id}`)}
              style={{
                background: "#fff", border: `2px solid ${cat.color}20`, borderRadius: 20,
                padding: "1.5rem", cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${cat.color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${cat.color}20`; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${cat.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{cat.icon}</div>
                <span style={{ background: `${cat.color}15`, color: cat.color, fontSize: 12, fontWeight: 700, borderRadius: 8, padding: "4px 10px" }}>{cat.count} items</span>
              </div>
              <h3 style={{ fontWeight: 800, fontSize: 18, margin: "0 0 8px", color: "#111827" }}>{cat.label}</h3>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1rem" }}>
                {catProducts.slice(0, 3).map(p => (
                  <span key={p.id} style={{ background: "#f3f4f6", color: "#374151", fontSize: 11, padding: "3px 8px", borderRadius: 4 }}>{p.name.split(" ").slice(0, 2).join(" ")}</span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: cat.color, fontSize: 13, fontWeight: 600 }}>From ₹{Math.min(...catProducts.map(p => p.price)).toLocaleString()}/mo</span>
                <span style={{ color: cat.color, fontWeight: 700 }}>Browse →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
