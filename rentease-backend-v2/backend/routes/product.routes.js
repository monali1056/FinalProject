const express = require("express");
const router  = express.Router();
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");
const { getAll, getOne, create, update, remove, getReviews, getCategoryCounts }
  = require("../controllers/product.controller");

router.get("/category-counts", getCategoryCounts);       // Public — NEW
router.get("/",                getAll);                   // Public
router.get("/:id",             getOne);                   // Public
router.get("/:id/reviews",     getReviews);               // Public
router.post("/",               authenticate, requireAdmin, create);
router.put("/:id",             authenticate, requireAdmin, update);
router.delete("/:id",          authenticate, requireAdmin, remove);

module.exports = router;
