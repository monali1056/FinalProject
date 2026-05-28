const express = require("express");
const router  = express.Router();
const { authenticate } = require("../middleware/auth.middleware");
const { getMyNotifications, markRead, markAllRead } = require("../controllers/notification.controller");

router.get("/",              authenticate, getMyNotifications);
router.put("/read-all",      authenticate, markAllRead);
router.put("/:id/read",      authenticate, markRead);

module.exports = router;
