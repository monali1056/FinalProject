const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { DB, saveDoc, getDoc, findDocs } = require("../config/cloudant");

// ── Helpers ───────────────────────────────────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function safeUser(user) {
  const { password, resetToken, resetExpiry, ...rest } = user;
  return rest;
}

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "name, email and password are required." });
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters." });

    const existing = await findDocs(DB.USERS, { email: email.toLowerCase() });
    if (existing.length > 0)
      return res.status(409).json({ error: "Email already registered. Please login." });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await saveDoc(DB.USERS, {
      _id:       uuidv4(),
      type:      "user",
      name:      name.trim(),
      email:     email.toLowerCase().trim(),
      password:  hashed,
      role:      "user",
      phone:     "",
      address:   "",
      wishlist:  [],
      createdAt: new Date().toISOString(),
    });

    const token = generateToken(user);
    res.status(201).json({ token, user: safeUser(user) });
  } catch (err) {
    console.error("signup:", err.message);
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
}

// ── POST /api/auth/login ──────────────────────────────────────────────────────
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "email and password are required." });

    const users = await findDocs(DB.USERS, { email: email.toLowerCase().trim() });
    if (users.length === 0)
      return res.status(401).json({ error: "Invalid email or password." });

    const user  = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password." });

    const token = generateToken(user);
    res.json({ token, user: safeUser(user) });
  } catch (err) {
    console.error("login:", err.message);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
}

// ── GET /api/auth/profile ─────────────────────────────────────────────────────
async function getProfile(req, res) {
  try {
    const users = await findDocs(DB.USERS, { _id: req.user.id });
    if (users.length === 0)
      return res.status(404).json({ error: "User not found." });
    res.json(safeUser(users[0]));
  } catch (err) {
    console.error("getProfile:", err.message);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
}

// ── PUT /api/auth/profile ─────────────────────────────────────────────────────
async function updateProfile(req, res) {
  try {
    const { name, phone, address } = req.body;
    const users = await findDocs(DB.USERS, { _id: req.user.id });
    if (users.length === 0)
      return res.status(404).json({ error: "User not found." });

    const user    = users[0];
    const updated = await saveDoc(DB.USERS, {
      ...user,
      name:      name      || user.name,
      phone:     phone     ?? user.phone,
      address:   address   ?? user.address,
      updatedAt: new Date().toISOString(),
    });
    res.json(safeUser(updated));
  } catch (err) {
    console.error("updateProfile:", err.message);
    res.status(500).json({ error: "Failed to update profile." });
  }
}

// ── PUT /api/auth/change-password ─────────────────────────────────────────────
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: "currentPassword and newPassword are required." });
    if (newPassword.length < 6)
      return res.status(400).json({ error: "New password must be at least 6 characters." });

    const users = await findDocs(DB.USERS, { _id: req.user.id });
    if (users.length === 0)
      return res.status(404).json({ error: "User not found." });

    const user  = users[0];
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
      return res.status(401).json({ error: "Current password is incorrect." });

    const hashed = await bcrypt.hash(newPassword, 12);
    await saveDoc(DB.USERS, { ...user, password: hashed, updatedAt: new Date().toISOString() });
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("changePassword:", err.message);
    res.status(500).json({ error: "Failed to change password." });
  }
}

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ error: "email is required." });

    const users = await findDocs(DB.USERS, { email: email.toLowerCase().trim() });
    // Always return 200 to prevent user enumeration
    if (users.length === 0)
      return res.json({ message: "If this email is registered, a reset link has been sent." });

    const user       = users[0];
    const resetToken = uuidv4();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    await saveDoc(DB.USERS, { ...user, resetToken, resetExpiry });

    // In production: send email via nodemailer / IBM SendGrid
    // For demo, log the token
    console.log(`🔑 Password reset token for ${email}: ${resetToken}`);
    console.log(`   Reset link: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`);

    res.json({ message: "If this email is registered, a reset link has been sent." });
  } catch (err) {
    console.error("forgotPassword:", err.message);
    res.status(500).json({ error: "Failed to process request." });
  }
}

// ── POST /api/auth/reset-password ────────────────────────────────────────────
async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return res.status(400).json({ error: "token and newPassword are required." });

    const users = await findDocs(DB.USERS, { resetToken: token });
    if (users.length === 0)
      return res.status(400).json({ error: "Invalid or expired reset token." });

    const user = users[0];
    if (new Date(user.resetExpiry) < new Date())
      return res.status(400).json({ error: "Reset token has expired. Please request a new one." });

    const hashed = await bcrypt.hash(newPassword, 12);
    await saveDoc(DB.USERS, {
      ...user,
      password:    hashed,
      resetToken:  null,
      resetExpiry: null,
      updatedAt:   new Date().toISOString(),
    });

    res.json({ message: "Password reset successfully. You can now login." });
  } catch (err) {
    console.error("resetPassword:", err.message);
    res.status(500).json({ error: "Failed to reset password." });
  }
}

// ── POST /api/auth/wishlist/:productId ───────────────────────────────────────
async function toggleWishlist(req, res) {
  try {
    const { productId } = req.params;
    const users = await findDocs(DB.USERS, { _id: req.user.id });
    if (users.length === 0)
      return res.status(404).json({ error: "User not found." });

    const user     = users[0];
    const wishlist = [...(user.wishlist || [])];
    const idx      = wishlist.indexOf(productId);
    if (idx > -1) wishlist.splice(idx, 1);
    else          wishlist.push(productId);

    const updated = await saveDoc(DB.USERS, { ...user, wishlist });
    res.json({ wishlist: updated.wishlist });
  } catch (err) {
    console.error("toggleWishlist:", err.message);
    res.status(500).json({ error: "Failed to update wishlist." });
  }
}

// ── GET /api/auth/wishlist ────────────────────────────────────────────────────
async function getWishlist(req, res) {
  try {
    const users = await findDocs(DB.USERS, { _id: req.user.id });
    if (users.length === 0)
      return res.status(404).json({ error: "User not found." });
    res.json({ wishlist: users[0].wishlist || [] });
  } catch (err) {
    console.error("getWishlist:", err.message);
    res.status(500).json({ error: "Failed to fetch wishlist." });
  }
}

module.exports = {
  signup, login, getProfile, updateProfile, changePassword,
  forgotPassword, resetPassword, toggleWishlist, getWishlist,
};
