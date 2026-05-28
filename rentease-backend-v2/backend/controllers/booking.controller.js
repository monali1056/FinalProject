const { v4: uuidv4 } = require("uuid");
const { DB, saveDoc, getDoc, findDocs } = require("../config/cloudant");
const { createNotification } = require("./notification.controller");

// ── POST /api/bookings ────────────────────────────────────────────────────────
async function create(req, res) {
  try {
    const { productId, startDate, endDate, duration } = req.body;

    if (!productId)
      return res.status(400).json({ error: "productId is required." });

    let product;
    try { product = await getDoc(DB.PRODUCTS, productId); }
    catch { return res.status(404).json({ error: "Product not found." }); }

    if (!product.available)
      return res.status(409).json({ error: "This product is currently unavailable." });

    const dur     = Number(duration) || 1;
    const total   = product.price * dur;

    const booking = await saveDoc(DB.BOOKINGS, {
      _id:          uuidv4(),
      type:         "booking",
      userId:       req.user.id,
      userName:     req.user.name,
      userEmail:    req.user.email,
      productId,
      productName:  product.name,
      productImage: product.image,
      category:     product.category,
      price:        product.price,
      deposit:      product.deposit,
      period:       product.period,
      startDate:    startDate || new Date().toISOString().split("T")[0],
      endDate:      endDate   || new Date().toISOString().split("T")[0],
      duration:     dur,
      totalAmount:  total,
      status:       "pending",
      createdAt:    new Date().toISOString(),
    });

    // Create payment record
    await saveDoc(DB.PAYMENTS, {
      _id:         uuidv4(),
      type:        "payment",
      bookingId:   booking._id,
      userId:      req.user.id,
      userName:    req.user.name,
      productName: product.name,
      amount:      total,
      deposit:     product.deposit,
      status:      "pending",
      method:      "online",
      createdAt:   new Date().toISOString(),
    });

    // Notify user
    await createNotification({
      userId:  req.user.id,
      icon:    "📦",
      title:   "Booking Confirmed!",
      message: `Your booking for ${product.name} is confirmed. Duration: ${dur} month(s).`,
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error("create booking:", err.message);
    res.status(500).json({ error: "Failed to create booking." });
  }
}

// ── GET /api/bookings/my ──────────────────────────────────────────────────────
async function getMyBookings(req, res) {
  try {
    // No sort param — Cloudant Lite doesn't support sort without an index
    const bookings = await findDocs(
      DB.BOOKINGS,
      { type: "booking", userId: req.user.id },
      { limit: 100 }
    );

    // Sort in memory — newest first
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(bookings);
  } catch (err) {
    console.error("getMyBookings:", err.message);
    res.status(500).json({ error: "Failed to fetch bookings. Error: " + err.message });
  }
}

// ── GET /api/bookings/all  [Admin] ────────────────────────────────────────────
async function getAllBookings(req, res) {
  try {
    const { status, userId } = req.query;
    const selector = { type: "booking" };
    if (status) selector.status = status;
    if (userId) selector.userId = userId;

    const bookings = await findDocs(DB.BOOKINGS, selector, { limit: 500 });

    // Sort in memory — newest first
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(bookings);
  } catch (err) {
    console.error("getAllBookings:", err.message);
    res.status(500).json({ error: "Failed to fetch bookings." });
  }
}

// ── PUT /api/bookings/:id/status  [Admin] ─────────────────────────────────────
async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const allowed = ["pending", "active", "completed", "cancelled"];

    if (!allowed.includes(status))
      return res.status(400).json({ error: `status must be one of: ${allowed.join(", ")}` });

    const booking = await getDoc(DB.BOOKINGS, req.params.id);
    const updated = await saveDoc(DB.BOOKINGS, {
      ...booking,
      status,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.id,
    });

    const statusMessages = {
      active:    `Your rental for ${booking.productName} is now active! 🎉`,
      completed: `Your rental for ${booking.productName} is completed.`,
      cancelled: `Your booking for ${booking.productName} has been cancelled.`,
    };
    if (statusMessages[status]) {
      await createNotification({
        userId:  booking.userId,
        icon:    status === "active" ? "✅" : status === "cancelled" ? "❌" : "🏁",
        title:   `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: statusMessages[status],
      });
    }

    res.json(updated);
  } catch (err) {
    if (err.status === 404) return res.status(404).json({ error: "Booking not found." });
    res.status(500).json({ error: "Failed to update booking status." });
  }
}

// ── PUT /api/bookings/:id/cancel  [User] ──────────────────────────────────────
async function cancelBooking(req, res) {
  try {
    const booking = await getDoc(DB.BOOKINGS, req.params.id);

    if (booking.userId !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ error: "Not authorised to cancel this booking." });

    if (["completed", "cancelled"].includes(booking.status))
      return res.status(400).json({ error: `Cannot cancel a ${booking.status} booking.` });

    const updated = await saveDoc(DB.BOOKINGS, {
      ...booking,
      status:      "cancelled",
      cancelledAt: new Date().toISOString(),
    });

    res.json(updated);
  } catch (err) {
    if (err.status === 404) return res.status(404).json({ error: "Booking not found." });
    res.status(500).json({ error: "Failed to cancel booking." });
  }
}

module.exports = { create, getMyBookings, getAllBookings, updateStatus, cancelBooking };
