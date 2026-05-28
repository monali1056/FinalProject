const express = require("express");
const router  = express.Router();
const { authenticate } = require("../middleware/auth.middleware");
const {
  signup, login, getProfile, updateProfile, changePassword,
  forgotPassword, resetPassword, toggleWishlist, getWishlist,
} = require("../controllers/auth.controller");

// Public
router.post("/signup",          signup);
router.post("/login",           login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password",  resetPassword);

// Protected
router.get("/profile",                    authenticate, getProfile);
router.put("/profile",                    authenticate, updateProfile);
router.put("/change-password",            authenticate, changePassword);
router.get("/wishlist",                   authenticate, getWishlist);
router.post("/wishlist/:productId",       authenticate, toggleWishlist);

module.exports = router;
