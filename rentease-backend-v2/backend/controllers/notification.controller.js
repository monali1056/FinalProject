const { v4: uuidv4 } = require("uuid");
const { DB, saveDoc, getDoc, findDocs } = require("../config/cloudant");

// ── Internal helper — called by booking/payment controllers ──────────────────
async function createNotification({ userId, icon, title, message }) {
  try {
    await saveDoc(DB.NOTIFICATIONS, {
      _id:       uuidv4(),
      type:      "notification",
      userId,
      icon:      icon  || "🔔",
      title:     title || "Notification",
      message,
      read:      false,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("createNotification (internal):", err.message);
  }
}

// ── GET /api/notifications ────────────────────────────────────────────────────
async function getMyNotifications(req, res) {
  try {
    const notifications = await findDocs(
      DB.NOTIFICATIONS,
      { type: "notification", userId: req.user.id },
      { limit: 50 }
    );
    // Sort newest first in memory
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(notifications);
  } catch (err) {
    console.error("getMyNotifications:", err.message);
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
}

// ── PUT /api/notifications/:id/read ──────────────────────────────────────────
async function markRead(req, res) {
  try {
    const notif = await getDoc(DB.NOTIFICATIONS, req.params.id);
    if (notif.userId !== req.user.id)
      return res.status(403).json({ error: "Not authorised." });

    const updated = await saveDoc(DB.NOTIFICATIONS, { ...notif, read: true });
    res.json(updated);
  } catch (err) {
    if (err.status === 404) return res.status(404).json({ error: "Notification not found." });
    res.status(500).json({ error: "Failed to mark notification as read." });
  }
}

// ── PUT /api/notifications/read-all ──────────────────────────────────────────
async function markAllRead(req, res) {
  try {
    const notifications = await findDocs(
      DB.NOTIFICATIONS,
      { type: "notification", userId: req.user.id, read: false },
      { limit: 100 }
    );

    await Promise.all(
      notifications.map((n) => saveDoc(DB.NOTIFICATIONS, { ...n, read: true }))
    );

    res.json({ message: `Marked ${notifications.length} notification(s) as read.` });
  } catch (err) {
    console.error("markAllRead:", err.message);
    res.status(500).json({ error: "Failed to mark all as read." });
  }
}

module.exports = { createNotification, getMyNotifications, markRead, markAllRead };
