import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IBMBadge, ProductCard, SkeletonCard } from "../components/UI";
import { useWishlist } from "../hooks/useWishlist";
import { CATEGORIES, TESTIMONIALS, IBM_SERVICES } from "../data/mockData";
import { productService } from "../services/api";

export default function Home() {
  const navigate = useNavigate();
  const { wishlist, toggle } = useWishlist();
  const [search, setSearch] = useState("");

  // Real product + category state
  const [products, setProducts]         = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading]           = useState(true);

  // Fetch all products once; derive featured + category counts from them
  useEffect(() => {
    (async () => {
      try {
        const res  = await productService.getAll();
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);

        // Count per category from real data
        const counts = {};
        data.forEach(p => {
          counts[p.category] = (counts[p.category] || 0) + 1;
        });
        setCategoryCounts(counts);
      } catch {
        // If backend unreachable keep empty — UI handles gracefully
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Featured = products that have a badge, up to 4
  const featured = products.filter(p => p.badge).slice(0, 4);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  // Merge real counts into the static CATEGORIES definition
  const categoriesWithCount = CATEGORIES.map(cat => ({
    ...cat,
    count: categoryCounts[cat.id] !== undefined ? categoryCounts[cat.id] : null,
  }));

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__content">
          <IBMBadge text="AI-Powered Rentals on IBM Cloud" />
          <h1 className="hero__title">
            Rent Anything.<br />
            <span className="hero__title-accent">Pay Monthly.</span>
          </h1>
          <p className="hero__subtitle">
            Cars, bikes, appliances, furniture & electronics — rent with confidence, powered by IBM Cloud AI.
          </p>

          <form onSubmit={handleSearch} className="hero__search">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for products to rent…"
              className="hero__search-input"
            />
            <button type="submit" className="hero__search-btn">Search</button>
          </form>

          <div className="hero__stats">
            {[["10K+","Happy Users"],["500+","Products"],["50+","Cities"],["24/7","AI Support"]].map(([n,l]) => (
              <div key={l} className="hero__stat">
                <div className="hero__stat-number">{n}</div>
                <div className="hero__stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section">
        <div className="section__header">
          <div>
            <h2 className="section__title">Browse Categories</h2>
            <p className="section__subtitle">Find the perfect rental for every need</p>
          </div>
          <button onClick={() => navigate("/categories")} className="btn-outline">View All →</button>
        </div>

        <div className="categories-grid">
          {categoriesWithCount.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate(`/products?category=${cat.id}`)}
              className="category-card"
              style={{ "--cat-color": cat.color }}
            >
              <span className="category-card__icon">{cat.icon}</span>
              <span className="category-card__label">{cat.label}</span>
              <span className="category-card__count">
                {loading
                  ? <span className="count-skeleton" />
                  : cat.count !== null
                    ? `${cat.count} listing${cat.count !== 1 ? "s" : ""}`
                    : "Browse"}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section section--no-top">
        <div className="section__header">
          <div>
            <h2 className="section__title">Featured Rentals</h2>
            <p className="section__subtitle">Handpicked by Watson AI for you</p>
          </div>
          <button onClick={() => navigate("/products")} className="btn-outline">View All →</button>
        </div>

        <div className="products-grid">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : featured.length > 0
              ? featured.map(p => (
                  <ProductCard
                    key={p.id || p._id}
                    product={p}
                    wishlisted={wishlist.includes(p.id || p._id)}
                    onWishlist={toggle}
                    onClick={() => navigate(`/products/${p.id || p._id}`)}
                  />
                ))
              : <p style={{ color:"#6b7280", gridColumn:"1/-1" }}>No featured products yet.</p>
          }
        </div>
      </section>

      {/* ── IBM Cloud Showcase ── */}
      <section className="ibm-section">
        <div className="ibm-section__inner">
          <div className="ibm-section__header">
            <IBMBadge text="IBM Cloud Integration" />
            <h2 className="ibm-section__title">Powered by IBM Cloud Services</h2>
            <p className="ibm-section__subtitle">
              Every feature of RentEase AI runs on IBM's enterprise-grade cloud infrastructure
            </p>
          </div>

          <div className="ibm-grid">
            {IBM_SERVICES.map(svc => (
              <div key={svc.id} className="ibm-card">
                <div className="ibm-card__icon">{svc.icon}</div>
                <h3 className="ibm-card__name">{svc.name}</h3>
                <p className="ibm-card__desc">{svc.description}</p>
                <div className="ibm-card__features">
                  {svc.features.map(f => (
                    <div key={f} className="ibm-card__feature">
                      <span className="ibm-card__check">✓</span> {f}
                    </div>
                  ))}
                </div>
                <div className="ibm-card__status">
                  <div className="ibm-card__dot" />
                  <span>LIVE — us-south</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:"2rem" }}>
            <button
              onClick={() => window.location.href="/ibm-cloud"}
              className="ibm-section__cta"
            >
              View Full IBM Architecture →
            </button>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section">
        <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
          <h2 className="section__title">Loved by Renters</h2>
          <p className="section__subtitle">Join 10,000+ happy customers across India</p>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-card__stars">{"★".repeat(t.rating)}</div>
              <p className="testimonial-card__text">"{t.text}"</p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">{t.avatar}</div>
                <div>
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="testimonial-card__city">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <h2 className="cta-section__title">Ready to Start Renting?</h2>
        <p className="cta-section__subtitle">Join thousands of happy renters. Secure, flexible, affordable.</p>
        <div className="cta-section__btns">
          <button onClick={() => navigate("/signup")} className="cta-section__btn cta-section__btn--white">
            Get Started Free
          </button>
          <button onClick={() => navigate("/products")} className="cta-section__btn cta-section__btn--ghost">
            Browse Products
          </button>
        </div>
        <p className="cta-section__footer">🔐 IBM App ID · 🗄️ IBM Cloudant · 🤖 Watson Assistant</p>
      </section>
    </div>
  );
}
