const express = require("express");
const router  = express.Router();
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");
const { create, getMyBookings, getAllBookings, updateStatus, cancelBooking } = require("../controllers/booking.controller");

router.post("/",             authenticate,               create);           // User
router.get("/my",            authenticate,               getMyBookings);    // User
router.get("/all",           authenticate, requireAdmin, getAllBookings);   // Admin
router.put("/:id/status",    authenticate, requireAdmin, updateStatus);    // Admin
router.put("/:id/cancel",    authenticate,               cancelBooking);   // User

module.exports = router;
