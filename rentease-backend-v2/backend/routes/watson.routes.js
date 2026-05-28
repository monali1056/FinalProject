const express = require("express");
const router  = express.Router();
const rateLimit = require("express-rate-limit");
const { sendMessage } = require("../controllers/watson.controller");

// Stricter rate limit for Watson — 30 messages/min per IP
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: "Chat rate limit reached. Please wait a moment." },
});

router.post("/message", chatLimiter, sendMessage);

module.exports = router;
