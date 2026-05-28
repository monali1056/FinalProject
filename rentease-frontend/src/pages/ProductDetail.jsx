import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IBMBadge } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { productService, authService } from "../services/api";

const CATEGORY_ICONS = {
  vehicles: "🚗", bikes: "🏍️", appliances: "❄️",
  furniture: "🛋️", electronics: "💻", other: "📦"
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [duration, setDuration] = useState(1);
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({ name:"", phone:"", address:"", city:"", pincode:"" });
  const [formError, setFormError] = useState("");

  const isVehicle = product?.category === "vehicles" || product?.category === "bikes";

  useEffect(() => {
    productService.getOne(id)
      .then(res => { setProduct(res.data); setLoading(false); })
      .catch(() => { navigate("/products"); });
  }, [id]);

  useEffect(() => {
    if (isAuthenticated) {
      authService.getWishlist()
        .then(res => setInWishlist((res.data.wishlist || []).includes(id)))
        .catch(() => {});
    }
  }, [id, isAuthenticated]);

  if (loading) return <div style={{ textAlign:"center", padding:"4rem", fontSize:32 }}>⏳ Loading...</div>;
  if (!product) return null;

  const pricePerUnit = product.price;
  const total = pricePerUnit * duration;
  const unit = isVehicle ? "day" : "month";

  const durationOptions = isVehicle
    ? [1, 3, 7, 15, 30]
    : [1, 3, 6, 12];

  const getDurationLabel = (d) => {
    if (isVehicle) {
      if (d === 1)  return { label: "1 Day",   tag: null }
      if (d === 3)  return { label: "3 Days",  tag: null }
      if (d === 7)  return { label: "7 Days",  tag: { text:"Popular", color:"#0e9f6e" } }
      if (d === 15) return { label: "15 Days", tag: { text:"Save 5%", color:"#7e3af2" } }
      if (d === 30) return { label: "30 Days", tag: { text:"Save 10%", color:"#e3a008" } }
    } else {
      if (d === 1)  return { label: "1 Month",   tag: null }
      if (d === 3)  return { label: "3 Months",  tag: { text:"Popular", color:"#0e9f6e" } }
      if (d === 6)  return { label: "6 Months",  tag: { text:"Save 5%", color:"#7e3af2" } }
      if (d === 12) return { label: "12 Months", tag: { text:"Save 10%", color:"#e3a008" } }
    }
    return { label: `${d} ${unit}s`, tag: null };
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    setWishlistLoading(true);
    try {
      const res = await authService.toggleWishlist(product._id);
      setInWishlist((res.data.wishlist || []).includes(product._id));
    } catch (err) {
      alert("Failed to update wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleBook = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!showForm) { setShowForm(true); return; }

    // Validate form
    if (!customerDetails.name || !customerDetails.phone || !customerDetails.address || !customerDetails.city || !customerDetails.pincode) {
      setFormError("Please fill in all delivery details."); return;
    }
    if (!/^[6-9]\d{9}$/.test(customerDetails.phone)) {
      setFormError("Please enter a valid 10-digit Indian mobile number."); return;
    }
    setFormError("");

    try {
      const { bookingService } = await import("../services/api");
      const startDate = new Date();
      const endDate = new Date();
      if (isVehicle) {
        endDate.setDate(endDate.getDate() + duration);
      } else {
        endDate.setMonth(endDate.getMonth() + duration);
      }
      await bookingService.create({
        productId: product._id,
        duration,
        durationType: unit,
        totalPrice: total,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        deliveryAddress: `${customerDetails.address}, ${customerDetails.city} - ${customerDetails.pincode}`,
        phone: customerDetails.phone,
        customerName: customerDetails.name,
      });
      setBooked(true);
      setShowForm(false);
    } catch (err) {
      setFormError(err.response?.data?.error || "Booking failed. Try again.");
    }
  };

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem" }}>
      <button onClick={() => navigate(-1)} style={{ background:"none", border:"none", cursor:"pointer", color:"#6b7280", fontSize:14, marginBottom:"1.5rem", display:"flex", alignItems:"center", gap:6 }}>
        ← Back to Products
      </button>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 }}>
        {/* Left — image */}
        <div>
          <div style={{ background:"linear-gradient(135deg,#f8fafc,#f1f5f9)", borderRadius:20, height:360, display:"flex", alignItems:"center", justifyContent:"center", fontSize:100, marginBottom:16 }}>
            {product.image || CATEGORY_ICONS[product.category] || "📦"}
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {(product.features || []).map(f => (
              <span key={f} style={{ background:"#eff6ff", color:"#1a56db", fontSize:12, padding:"4px 10px", borderRadius:6, fontWeight:600 }}>{f}</span>
            ))}
          </div>
          <div style={{ marginTop:"1.5rem", background:"#f8fafc", borderRadius:12, padding:"1rem" }}>
            <p style={{ fontWeight:700, fontSize:13, color:"#374151", margin:"0 0 8px" }}>💡 Watson AI Recommendation</p>
            <p style={{ color:"#6b7280", fontSize:13, margin:0, lineHeight:1.6 }}>
              This product has a {product.rating}★ rating from {product.reviews} renters.
              {isVehicle
                ? ` For ${duration} day${duration > 1 ? "s" : ""}, you get great flexibility. Ask Watson for more info! 🤖`
                : ` For ${duration} month${duration > 1 ? "s" : ""}, you get excellent value. Ask Watson for more info! 🤖`}
            </p>
          </div>
        </div>

        {/* Right — booking */}
        <div>
          {product.badge && <span style={{ background:"#1a56db", color:"#fff", fontSize:12, borderRadius:6, padding:"4px 10px", fontWeight:700 }}>{product.badge}</span>}
          <h1 style={{ fontWeight:800, fontSize:26, margin:"1rem 0 0.5rem" }}>{product.name}</h1>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1.5rem" }}>
            <span style={{ color:"#f59e0b" }}>{"★".repeat(Math.floor(product.rating || 0))}</span>
            <span style={{ fontWeight:700 }}>{product.rating || 0}</span>
            <span style={{ color:"#6b7280", fontSize:14 }}>({product.reviews || 0} reviews)</span>
            <span style={{ color: product.available ? "#0e9f6e" : "#ef4444", fontSize:13, fontWeight:600 }}>
              {product.available ? "✓ Available" : "✗ Unavailable"}
            </span>
          </div>

          {/* Vehicle notice */}
          {isVehicle && (
            <div style={{ background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:10, padding:"10px 14px", marginBottom:"1rem", fontSize:13, color:"#92400e", fontWeight:600 }}>
              🚗 Vehicle rentals are charged <strong>per day</strong>
            </div>
          )}

          {/* Duration selector */}
          <div style={{ background:"#f8fafc", borderRadius:12, padding:"1.25rem", marginBottom:"1.5rem" }}>
            <p style={{ fontWeight:700, fontSize:13, color:"#6b7280", margin:"0 0 10px" }}>
              SELECT RENTAL DURATION ({isVehicle ? "DAYS" : "MONTHS"})
            </p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {durationOptions.map(d => {
                const { label, tag } = getDurationLabel(d);
                return (
                  <button key={d} onClick={() => setDuration(d)} style={{
                    padding:"8px 18px", borderRadius:8, cursor:"pointer", fontWeight:600, fontSize:14,
                    border:`2px solid ${duration===d ? "#1a56db" : "#e5e7eb"}`,
                    background: duration===d ? "#eff6ff" : "#fff",
                    color: duration===d ? "#1a56db" : "#374151",
                    transition:"all 0.15s",
                  }}>
                    {label}
                    {tag && <span style={{ display:"block", fontSize:10, color:tag.color, fontWeight:700 }}>{tag.text}</span>}
                  </button>
                );
              })}
            </div>

            {/* Custom input */}
            <div style={{ marginTop:12 }}>
              <p style={{ fontSize:12, color:"#6b7280", fontWeight:600, margin:"0 0 6px" }}>
                OR ENTER CUSTOM {isVehicle ? "DAYS" : "MONTHS"}
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:0, width:"fit-content", border:"1px solid #e5e7eb", borderRadius:10, overflow:"hidden" }}>
                <button onClick={() => setDuration(d => Math.max(1, d - 1))}
                  style={{ width:36, height:36, border:"none", background:"#f3f4f6", cursor:"pointer", fontSize:18, fontWeight:700, color:"#374151" }}>−</button>
                <input
                  type="number" min={1} max={isVehicle ? 365 : 24} value={duration}
                  onChange={e => setDuration(Math.max(1, Number(e.target.value)))}
                  style={{ width:60, height:36, border:"none", textAlign:"center", fontSize:15, fontWeight:700, outline:"none", color:"#111827" }}
                />
                <button onClick={() => setDuration(d => d + 1)}
                  style={{ width:36, height:36, border:"none", background:"#f3f4f6", cursor:"pointer", fontSize:18, fontWeight:700, color:"#374151" }}>+</button>
              </div>
            </div>
          </div>

          {/* Pricing breakdown */}
          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"1.25rem", marginBottom:"1.5rem" }}>
            {[
              [isVehicle ? "Daily Rent" : "Monthly Rent", `₹${pricePerUnit.toLocaleString()}/${unit}`],
              ["Duration", `${duration} ${unit}${duration > 1 ? "s" : ""}`],
              ["Security Deposit", `₹${(product.deposit || 0).toLocaleString()} (refundable)`],
            ].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <span style={{ color:"#6b7280", fontSize:14 }}>{k}</span>
                <span style={{ fontWeight:600, fontSize:14 }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop:"1px solid #e5e7eb", paddingTop:10, display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontWeight:700, fontSize:16 }}>Total Rent</span>
              <span style={{ fontWeight:800, fontSize:22, color:"#1a56db" }}>₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Wishlist / Cart button */}
          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            style={{
              width:"100%", marginBottom:10,
              background: inWishlist ? "#fef2f2" : "#f8fafc",
              color: inWishlist ? "#dc2626" : "#374151",
              border: `2px solid ${inWishlist ? "#fca5a5" : "#e5e7eb"}`,
              borderRadius:12, padding:"12px",
              fontWeight:700, fontSize:15, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              transition:"all 0.2s",
            }}
          >
            {wishlistLoading ? "⏳ Updating..." : inWishlist ? "❤️ Remove from Wishlist" : "🤍 Add to Wishlist"}
          </button>

          {/* Customer details form */}
          {showForm && !booked && (
            <div style={{ background:"#f8fafc", border:"1px solid #e5e7eb", borderRadius:12, padding:"1.25rem", marginBottom:"1rem" }}>
              <p style={{ fontWeight:700, fontSize:14, color:"#111827", margin:"0 0 12px" }}>📦 Delivery Details</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  ["name",    "Full Name",      "text",  "Enter your full name"],
                  ["phone",   "Mobile Number",  "tel",   "10-digit mobile number"],
                  ["address", "Delivery Address","text", "House/Flat, Street, Area"],
                  ["city",    "City",           "text",  "Your city"],
                  ["pincode", "PIN Code",       "text",  "6-digit PIN code"],
                ].map(([key, label, type, placeholder]) => (
                  <div key={key}>
                    <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:3 }}>{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={customerDetails[key]}
                      onChange={e => setCustomerDetails(d => ({ ...d, [key]: e.target.value }))}
                      style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:8, padding:"8px 12px", fontSize:14, outline:"none", boxSizing:"border-box" }}
                    />
                  </div>
                ))}

                {/* WhatsApp bill notice */}
                <div style={{ background:"#dcfce7", border:"1px solid #86efac", borderRadius:8, padding:"10px 12px", fontSize:12, color:"#166534", display:"flex", alignItems:"center", gap:8 }}>
                  📱 Your booking confirmation & bill will be sent to your WhatsApp number
                </div>

                {formError && <p style={{ color:"#dc2626", fontSize:12, margin:0, fontWeight:600 }}>❌ {formError}</p>}
              </div>
            </div>
          )}

          {booked ? (
            <div style={{ background:"#dcfce7", border:"1px solid #86efac", borderRadius:12, padding:"1.25rem" }}>
              <p style={{ color:"#166534", fontWeight:700, fontSize:18, margin:"0 0 4px", textAlign:"center" }}>Booking Confirmed!</p>
              <p style={{ color:"#166534", fontSize:13, margin:"0 0 12px", textAlign:"center" }}>Saved to IBM Cloudant · Awaiting admin approval</p>

              {/* Bill */}
              <div style={{ background:"#fff", borderRadius:10, padding:"1rem", marginBottom:12, fontSize:13 }}>
                <p style={{ fontWeight:800, fontSize:15, margin:"0 0 10px", color:"#111827", textAlign:"center" }}>RentEase AI — Booking Bill</p>
                {[
                  ["Product",   product.name],
                  ["Customer",  customerDetails.name],
                  ["Phone",     customerDetails.phone],
                  ["Address",   `${customerDetails.address}, ${customerDetails.city} - ${customerDetails.pincode}`],
                  ["Duration",  `${duration} ${unit}(s)`],
                  ["Start Date", new Date().toLocaleDateString()],
                  ["Rent",      `Rs.${pricePerUnit.toLocaleString()}/${unit}`],
                  ["Security Deposit", `Rs.${(product.deposit||0).toLocaleString()} (refundable)`],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", borderBottom:"1px solid #f3f4f6", padding:"5px 0" }}>
                    <span style={{ color:"#6b7280" }}>• {k}</span>
                    <span style={{ fontWeight:600, color:"#111827" }}>{v}</span>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"space-between", paddingTop:8, marginTop:4 }}>
                  <span style={{ fontWeight:800, fontSize:15 }}>• Total Amount</span>
                  <span style={{ fontWeight:800, fontSize:16, color:"#1a56db" }}>Rs.{total.toLocaleString()}</span>
                </div>
              </div>

              {/* WhatsApp button */}
              <a
                href={`https://wa.me/91${customerDetails.phone}?text=${encodeURIComponent(
`*RentEase AI - Booking Confirmation*

Your booking is confirmed!

. Product: ${product.name}
. Name: ${customerDetails.name}
. Delivery: ${customerDetails.address}, ${customerDetails.city} - ${customerDetails.pincode}
. Duration: ${duration} ${unit}(s)
. Rent: Rs.${pricePerUnit.toLocaleString()}/${unit}
. Security Deposit: Rs.${(product.deposit||0).toLocaleString()} (refundable)
. Total Amount: Rs.${total.toLocaleString()}

Status: Awaiting admin approval
Powered by IBM Cloud

Thank you for choosing RentEase AI!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:"#25D366", color:"#fff", borderRadius:10, padding:"12px", fontWeight:700, fontSize:15, textDecoration:"none", width:"100%", boxSizing:"border-box" }}
              >
                Send Bill on WhatsApp
              </a>
            </div>
          ) : (
            <button
              onClick={handleBook}
              disabled={!product.available}
              style={{ width:"100%", background: product.available ? "linear-gradient(135deg,#1a56db,#7e3af2)" : "#e5e7eb", color: product.available ? "#fff" : "#9ca3af", border:"none", borderRadius:12, padding:"14px", fontWeight:700, fontSize:16, cursor: product.available ? "pointer" : "not-allowed" }}
            >
              {!product.available ? "Currently Unavailable" : isAuthenticated ? (showForm ? `✅ Confirm Booking — ₹${total.toLocaleString()}` : `📦 Book Now — ₹${total.toLocaleString()}`) : "Login to Book"}
            </button>
          )}

          <p style={{ textAlign:"center", fontSize:12, color:"#9ca3af", marginTop:10 }}>
            🔐 Secured by IBM App ID · 🗄️ Stored on IBM Cloudant
          </p>
          <IBMBadge text="Powered by IBM Cloud" />
        </div>
      </div>
    </div>
  );
}
