import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IBMBadge, ProductCard, SkeletonCard } from "../components/UI";
import { useWishlist } from "../hooks/useWishlist";
import { CATEGORIES } from "../data/mockData";
import { productService } from "../services/api";

export default function Products() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { wishlist, toggle } = useWishlist();
  const [category, setCategory] = useState(params.get("category") || "all");
  const [sort,     setSort]     = useState("popular");
  const [search,   setSearch]   = useState("");
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  // Fetch products from backend (IBM Cloudant)
  useEffect(() => {
    setLoading(true);
    setError("");
    const queryParams = {};
    if (category !== "all") queryParams.category = category;
    if (search)             queryParams.search   = search;
    if (sort === "price-asc")  queryParams.sort  = "price_asc";
    if (sort === "price-desc") queryParams.sort  = "price_desc";

    productService.getAll(queryParams)
      .then(res => setProducts(res.data))
      .catch(() => setError("Failed to load products. Please try again."))
      .finally(() => setLoading(false));
  }, [category, sort]);

  // Client-side search filter (instant, no extra API call)
  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem" }}>
      <div style={{ marginBottom:"1.5rem" }}>
        <IBMBadge text="Data from IBM Cloudant" />
        <h1 style={{ fontWeight:800, fontSize:28, margin:"0.75rem 0 0.25rem" }}>Browse All Rentals</h1>
        <p style={{ color:"#6b7280" }}>Choose from 500+ products across categories</p>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:12, marginBottom:"1.5rem", flexWrap:"wrap" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products…"
          style={{ flex:1, minWidth:200, border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none" }}
        />
        <select value={category} onChange={e => setCategory(e.target.value)}
          style={{ border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:14 }}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:14 }}>
          <option value="popular">Most Popular</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"1rem", marginBottom:"1rem", color:"#dc2626", fontSize:14 }}>
          {error}
        </div>
      )}

      <p style={{ color:"#6b7280", fontSize:14, marginBottom:"1rem" }}>
        {loading ? "Loading from IBM Cloudant…" : `${filtered.length} products found`}
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
        {/* Loading skeletons */}
        {loading && Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}

        {/* Product cards — use _id for navigation (Cloudant) */}
        {!loading && filtered.map(p => (
          <ProductCard
            key={p._id}
            product={p}
            wishlisted={wishlist.includes(p._id)}
            onWishlist={() => toggle(p._id)}
            onClick={() => navigate(`/products/${p._id}`)}
          />
        ))}

        {/* Empty state */}
        {!loading && filtered.length === 0 && !error && (
          <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"4rem", color:"#6b7280" }}>
            <div style={{ fontSize:48, marginBottom:"1rem" }}>🔍</div>
            <h3 style={{ fontWeight:700, margin:"0 0 0.5rem" }}>No products found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
