const express = require("express");
const router  = express.Router();
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");
const { getMyPayments, getAllPayments, updatePaymentStatus } = require("../controllers/payment.controller");

router.get("/my",            authenticate,               getMyPayments);
router.get("/all",           authenticate, requireAdmin, getAllPayments);
router.put("/:id/status",    authenticate, requireAdmin, updatePaymentStatus);

module.exports = router;
