const { DB, findDocs, getDoc, saveDoc } = require("../config/cloudant");
const { createNotification }            = require("./notification.controller");

// ── GET /api/payments/my ──────────────────────────────────────────────────────
async function getMyPayments(req, res) {
  try {
    const payments = await findDocs(
      DB.PAYMENTS,
      { type: "payment", userId: req.user.id },
      { limit: 200 }
    );
    payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(payments);
  } catch (err) {
    console.error("getMyPayments:", err.message);
    res.status(500).json({ error: "Failed to fetch payment history." });
  }
}

// ── GET /api/payments/all  [Admin] ────────────────────────────────────────────
async function getAllPayments(req, res) {
  try {
    const payments = await findDocs(DB.PAYMENTS, { type: "payment" }, { limit: 1000 });
    payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(payments);
  } catch (err) {
    console.error("getAllPayments:", err.message);
    res.status(500).json({ error: "Failed to fetch payments." });
  }
}

// ── PUT /api/payments/:id/status  [Admin] ─────────────────────────────────────
async function updatePaymentStatus(req, res) {
  try {
    const { status } = req.body;
    const allowed = ["pending", "paid", "refunded", "failed"];

    if (!allowed.includes(status))
      return res.status(400).json({ error: `status must be one of: ${allowed.join(", ")}` });

    const payment = await getDoc(DB.PAYMENTS, req.params.id);
    const updated = await saveDoc(DB.PAYMENTS, {
      ...payment,
      status,
      updatedAt: new Date().toISOString(),
    });

    if (status === "paid") {
      await createNotification({
        userId:  payment.userId,
        icon:    "💳",
        title:   "Payment Confirmed",
        message: `₹${payment.amount.toLocaleString()} payment for ${payment.productName} confirmed.`,
      });
    }

    if (status === "refunded") {
      await createNotification({
        userId:  payment.userId,
        icon:    "💰",
        title:   "Refund Processed",
        message: `₹${payment.amount.toLocaleString()} refund for ${payment.productName} has been processed.`,
      });
    }

    res.json(updated);
  } catch (err) {
    if (err.status === 404) return res.status(404).json({ error: "Payment not found." });
    res.status(500).json({ error: "Failed to update payment." });
  }
}

module.exports = { getMyPayments, getAllPayments, updatePaymentStatus };
