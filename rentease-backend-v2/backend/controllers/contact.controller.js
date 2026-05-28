const { v4: uuidv4 } = require("uuid");
const { DB, saveDoc, findDocs } = require("../config/cloudant");

// ── POST /api/contact ─────────────────────────────────────────────────────────
async function submitContact(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ error: "name, email and message are required." });

    await saveDoc(DB.CONTACTS, {
      _id:       uuidv4(),
      type:      "contact",
      name:      name.trim(),
      email:     email.toLowerCase().trim(),
      subject:   subject?.trim() || "General Enquiry",
      message:   message.trim(),
      status:    "new",      // new | read | replied
      createdAt: new Date().toISOString(),
    });

    // In production: send email notification to support@rentease.ai via nodemailer
    console.log(`📩 New contact from ${name} (${email}): ${subject}`);

    res.json({ message: "Message received! Our team will reply within 24 hours." });
  } catch (err) {
    console.error("submitContact:", err.message);
    res.status(500).json({ error: "Failed to send message. Please try again." });
  }
}

// ── GET /api/contact  [Admin] ─────────────────────────────────────────────────
async function getAllContacts(req, res) {
  try {
    const contacts = await findDocs(DB.CONTACTS, { type: "contact" }, { limit: 500 });
    contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(contacts);
  } catch (err) {
    console.error("getAllContacts:", err.message);
    res.status(500).json({ error: "Failed to fetch contacts." });
  }
}

module.exports = { submitContact, getAllContacts };
