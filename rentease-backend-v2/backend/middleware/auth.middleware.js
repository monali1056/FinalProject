const jwt = require("jsonwebtoken");

/**
 * authenticate — verifies JWT from Authorization: Bearer <token>
 * Attaches decoded payload to req.user: { id, email, name, role }
 */
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const token   = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token. Please login again." });
  }
}

/**
 * requireAdmin — must come after authenticate
 * Rejects non-admin users with 403
 */
function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  next();
}

/**
 * optionalAuth — attaches user if token present, but doesn't block if absent
 */
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    try {
      req.user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    } catch (_) {
      // silently ignore bad token in optional mode
    }
  }
  next();
}

module.exports = { authenticate, requireAdmin, optionalAuth };
