const { DB, findDocs, getDoc, saveDoc, deleteDoc, getAllDocs } = require("../config/cloudant");

// ── Helper: safe fetch with fallback ─────────────────────────────────────────
// Cloudant Lite sometimes fails on findDocs if no index exists.
// We fall back to getAllDocs + filter in memory.
async function safeFetch(db, type, limit = 2000) {
  try {
    const docs = await findDocs(db, { type }, { limit });
    return docs;
  } catch (err) {
    console.warn(`findDocs failed for ${db} (${type}), falling back to getAllDocs:`, err.message);
    const all = await getAllDocs(db);
    return all.filter(d => d.type === type);
  }
}

// ── GET /api/admin/users ──────────────────────────────────────────────────────
async function getAllUsers(req, res) {
  try {
    const users = await safeFetch(DB.USERS, "user", 500);
    const safe  = users.map(({ password, resetToken, resetExpiry, ...u }) => u);
    res.json(safe);
  } catch (err) {
    console.error("getAllUsers:", err.message);
    res.status(500).json({ error: "Failed to fetch users." });
  }
}

// ── GET /api/admin/users/:id ──────────────────────────────────────────────────
async function getUserById(req, res) {
  try {
    const user = await getDoc(DB.USERS, req.params.id);
    const { password, resetToken, ...safe } = user;
    res.json(safe);
  } catch (err) {
    if (err.status === 404) return res.status(404).json({ error: "User not found." });
    res.status(500).json({ error: "Failed to fetch user." });
  }
}

// ── PUT /api/admin/users/:id/role ─────────────────────────────────────────────
async function updateUserRole(req, res) {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role))
      return res.status(400).json({ error: "role must be 'user' or 'admin'." });

    const user    = await getDoc(DB.USERS, req.params.id);
    const updated = await saveDoc(DB.USERS, { ...user, role, updatedAt: new Date().toISOString() });
    const { password, ...safe } = updated;
    res.json(safe);
  } catch (err) {
    if (err.status === 404) return res.status(404).json({ error: "User not found." });
    res.status(500).json({ error: "Failed to update user role." });
  }
}

// ── DELETE /api/admin/users/:id ───────────────────────────────────────────────
async function deleteUser(req, res) {
  try {
    if (req.params.id === req.user.id)
      return res.status(400).json({ error: "Cannot delete your own admin account." });

    const user = await getDoc(DB.USERS, req.params.id);
    await deleteDoc(DB.USERS, user._id, user._rev);
    res.json({ message: "User deleted." });
  } catch (err) {
    if (err.status === 404) return res.status(404).json({ error: "User not found." });
    res.status(500).json({ error: "Failed to delete user." });
  }
}

// ── GET /api/admin/analytics ──────────────────────────────────────────────────
async function getAnalytics(req, res) {
  try {
    // Use safeFetch — falls back to getAllDocs if Cloudant index missing
    const [users, products, bookings, payments] = await Promise.all([
      safeFetch(DB.USERS,    "user",    2000),
      safeFetch(DB.PRODUCTS, "product", 2000),
      safeFetch(DB.BOOKINGS, "booking", 2000),
      safeFetch(DB.PAYMENTS, "payment", 2000),
    ]);

    const activeBookings    = bookings.filter(b => b.status === "active");
    const completedBookings = bookings.filter(b => b.status === "completed");
    const pendingBookings   = bookings.filter(b => b.status === "pending");
    const totalRevenue      = payments.filter(p => p.status === "paid").reduce((s, p) => s + (p.amount || 0), 0);
    const monthlyRevenue    = activeBookings.reduce((s, b) => s + (b.price || 0), 0);

    // Revenue by last 6 months (computed in memory)
    const now = new Date();
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const d      = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const label  = d.toLocaleString("default", { month: "short" });
      const monthBookings = bookings.filter(b => {
        const c = new Date(b.createdAt);
        return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth();
      });
      return {
        label,
        revenue:  monthBookings.reduce((s, b) => s + (b.price || 0), 0),
        bookings: monthBookings.length,
      };
    });

    // Category breakdown
    const categoryMap = {};
    bookings.forEach(b => {
      if (b.category) categoryMap[b.category] = (categoryMap[b.category] || 0) + 1;
    });

    // Top products
    const productCount = {};
    bookings.forEach(b => {
      if (b.productName) productCount[b.productName] = (productCount[b.productName] || 0) + 1;
    });
    const topProducts = Object.entries(productCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json({
      summary: {
        totalUsers:        users.length,
        totalProducts:     products.length,
        availableProducts: products.filter(p => p.available).length,
        totalBookings:     bookings.length,
        activeBookings:    activeBookings.length,
        completedBookings: completedBookings.length,
        pendingBookings:   pendingBookings.length,
        totalRevenue,
        monthlyRevenue,
        avgRating: products.length
          ? (products.reduce((s, p) => s + (p.rating || 0), 0) / products.length).toFixed(1)
          : "0.0",
      },
      monthlyRevenue: monthlyData,
      categoryBreakdown: categoryMap,
      topProducts,
      ibmCloud: {
        database:    "IBM Cloudant",
        auth:        "IBM App ID (JWT)",
        chatbot:     "IBM Watson Assistant",
        deployment:  "IBM Cloud / Vercel",
        dbDocuments: users.length + products.length + bookings.length + payments.length,
      },
    });
  } catch (err) {
    console.error("getAnalytics error:", err.message);
    res.status(500).json({ error: "Failed to fetch analytics. " + err.message });
  }
}

module.exports = { getAllUsers, getUserById, updateUserRole, deleteUser, getAnalytics };
