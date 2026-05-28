import { useSearchParams, useNavigate } from "react-router-dom";
import { ProductCard, IBMBadge } from "../components/UI";
import { useWishlist } from "../hooks/useWishlist";
import { PRODUCTS } from "../data/mockData";

export default function SearchResults() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const { wishlist, toggle } = useWishlist();
  const query     = params.get("q") || "";

  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      <IBMBadge text="Search powered by IBM Cloudant" />
      <h1 style={{ fontWeight: 800, fontSize: 26, margin: "0.75rem 0 0.25rem" }}>
        Search results for "{query}"
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>{results.length} products found</p>

      {results.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div style={{ fontSize: 56, marginBottom: "1rem" }}>🔍</div>
          <h3 style={{ fontWeight: 700, fontSize: 20, margin: "0 0 0.5rem" }}>No results found</h3>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>Try different keywords or browse all categories</p>
          <button onClick={() => navigate("/products")} style={{ background: "linear-gradient(135deg,#1a56db,#7e3af2)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 600, cursor: "pointer" }}>
            Browse All Products
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {results.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              wishlisted={wishlist.includes(p.id)}
              onWishlist={toggle}
              onClick={() => navigate(`/products/${p.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
