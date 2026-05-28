require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const morgan     = require("morgan");
const rateLimit  = require("express-rate-limit");

// ── Route imports ─────────────────────────────────────────────────────────────
const authRoutes         = require("./routes/auth.routes");
const productRoutes      = require("./routes/product.routes");
const bookingRoutes      = require("./routes/booking.routes");
const adminRoutes        = require("./routes/admin.routes");
const watsonRoutes       = require("./routes/watson.routes");
const contactRoutes      = require("./routes/contact.routes");
const notificationRoutes = require("./routes/notification.routes");
const paymentRoutes      = require("./routes/payment.routes");

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));

// ── Global rate limiter ───────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: { error: "Too many requests. Please try again later." },
});
app.use("/api", limiter);

// ── Mount routes ──────────────────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/products",      productRoutes);
app.use("/api/bookings",      bookingRoutes);
app.use("/api/admin",         adminRoutes);
app.use("/api/watson",        watsonRoutes);
app.use("/api/contact",       contactRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments",      paymentRoutes);

// ── Health / IBM Cloud status ─────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status:    "ok",
    platform:  "IBM Cloud",
    database:  "IBM Cloudant",
    auth:      "IBM App ID (JWT)",
    chatbot:   "IBM Watson Assistant",
    timestamp: new Date().toISOString(),
    version:   "2.0.0",
  });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("❌", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║   🚀 RentEase AI Backend v2.0                ║
  ║   Running on  → http://localhost:${PORT}         ║
  ║   Database    → IBM Cloudant                 ║
  ║   Auth        → IBM App ID (JWT)             ║
  ║   Chatbot     → IBM Watson Assistant         ║
  ╚══════════════════════════════════════════════╝
  `);
});
