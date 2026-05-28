import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { label: "Home",       to: "/" },
    { label: "Products",   to: "/products" },
    { label: "Categories", to: "/categories" },
    { label: "About",      to: "/about" },
  ];

  const active = (to) =>
    (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to));

  const handleLogout = () => { logout(); navigate("/"); setMobileOpen(false); };

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Add shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
        {/* ── Logo ── */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">R</div>
          <span className="navbar__logo-text">RentEase AI</span>
          <span className="navbar__logo-badge">IBM Cloud</span>
        </Link>

        {/* ── Desktop Links ── */}
        <div className="navbar__links">
          {navLinks.map(n => (
            <Link
              key={n.to}
              to={n.to}
              className={`navbar__link${active(n.to) ? " navbar__link--active" : ""}`}
            >
              {n.label}
            </Link>
          ))}
        </div>

        {/* ── Desktop Auth ── */}
        <div className="navbar__auth">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="navbar__btn navbar__btn--admin">⚙️ Admin</Link>
              )}
              <Link to="/dashboard" className="navbar__btn navbar__btn--dashboard">Dashboard</Link>
              <button onClick={handleLogout} className="navbar__btn navbar__btn--ghost">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"  className="navbar__btn navbar__btn--ghost">Login</Link>
              <Link to="/signup" className="navbar__btn navbar__btn--primary">Sign Up Free</Link>
            </>
          )}
        </div>

        {/* ── Hamburger (mobile) ── */}
        <button
          className={`navbar__hamburger${mobileOpen ? " navbar__hamburger--open" : ""}`}
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}
      <div className={`mobile-drawer${mobileOpen ? " mobile-drawer--open" : ""}`}>
        <div className="mobile-drawer__inner">
          {/* Nav links */}
          <div className="mobile-drawer__links">
            {navLinks.map(n => (
              <Link
                key={n.to}
                to={n.to}
                className={`mobile-drawer__link${active(n.to) ? " mobile-drawer__link--active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                {n.label}
              </Link>
            ))}
          </div>

          <div className="mobile-drawer__divider" />

          {/* Auth */}
          <div className="mobile-drawer__auth">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="mobile-drawer__auth-btn mobile-drawer__auth-btn--admin" onClick={() => setMobileOpen(false)}>⚙️ Admin Dashboard</Link>
                )}
                <Link to="/dashboard" className="mobile-drawer__auth-btn mobile-drawer__auth-btn--dashboard" onClick={() => setMobileOpen(false)}>My Dashboard</Link>
                <button onClick={handleLogout} className="mobile-drawer__auth-btn mobile-drawer__auth-btn--ghost">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login"  className="mobile-drawer__auth-btn mobile-drawer__auth-btn--ghost"   onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/signup" className="mobile-drawer__auth-btn mobile-drawer__auth-btn--primary" onClick={() => setMobileOpen(false)}>Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
