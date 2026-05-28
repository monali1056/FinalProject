const express = require("express");
const router  = express.Router();
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");
const { getAllUsers, getUserById, updateUserRole, deleteUser, getAnalytics } = require("../controllers/admin.controller");
const { getAllContacts } = require("../controllers/contact.controller");
const { getAllPayments, updatePaymentStatus } = require("../controllers/payment.controller");

// All admin routes require auth + admin role
router.use(authenticate, requireAdmin);

// Users
router.get("/users",              getAllUsers);
router.get("/users/:id",          getUserById);
router.put("/users/:id/role",     updateUserRole);
router.delete("/users/:id",       deleteUser);

// Analytics
router.get("/analytics",          getAnalytics);

// Contacts / Support messages
router.get("/contacts",           getAllContacts);

// Payments
router.get("/payments",           getAllPayments);
router.put("/payments/:id/status",updatePaymentStatus);

module.exports = router;
