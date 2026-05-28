const { v4: uuidv4 } = require("uuid");
const { DB, saveDoc, getDoc, deleteDoc, findDocs } = require("../config/cloudant");

// ── GET /api/products ─────────────────────────────────────────────────────────
async function getAll(req, res) {
  try {
    const { category, search, minPrice, maxPrice, available, sort } = req.query;

    const selector = { type: "product" };
    if (category)              selector.category  = category;
    if (available !== undefined) selector.available = available === "true";

    let products = await findDocs(DB.PRODUCTS, selector, { limit: 200 });

    // Text search (Cloudant Lite doesn't support full-text index)
    if (search) {
      const q = search.toLowerCase();
      products = products.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    // Price range filter
    if (minPrice) products = products.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) products = products.filter((p) => p.price <= Number(maxPrice));

    // Sorting
    if (sort === "price_asc")    products.sort((a, b) => a.price - b.price);
    if (sort === "price_desc")   products.sort((a, b) => b.price - a.price);
    if (sort === "rating")       products.sort((a, b) => b.rating - a.rating);
    if (sort === "newest")       products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(products);
  } catch (err) {
    console.error("getAll products:", err.message);
    res.status(500).json({ error: "Failed to fetch products." });
  }
}

// ── GET /api/products/:id ─────────────────────────────────────────────────────
async function getOne(req, res) {
  try {
    const product = await getDoc(DB.PRODUCTS, req.params.id);
    res.json(product);
  } catch (err) {
    if (err.status === 404) return res.status(404).json({ error: "Product not found." });
    res.status(500).json({ error: "Failed to fetch product." });
  }
}

// ── POST /api/products  [Admin] ───────────────────────────────────────────────
async function create(req, res) {
  try {
    const { name, category, price, period, deposit, description, features, image, badge } = req.body;

    if (!name || !category || !price)
      return res.status(400).json({ error: "name, category and price are required." });

    const validCategories = ["vehicles", "appliances", "furniture", "electronics", "bikes", "other"];
    if (!validCategories.includes(category))
      return res.status(400).json({ error: `category must be one of: ${validCategories.join(", ")}` });

    const product = await saveDoc(DB.PRODUCTS, {
      _id:         uuidv4(),
      type:        "product",
      name:        name.trim(),
      category,
      price:       Number(price),
      period:      period || "month",
      deposit:     Number(deposit) || 0,
      description: description?.trim() || "",
      features:    Array.isArray(features) ? features : (features ? [features] : []),
      image: image || { vehicles:"🚗", bikes:"🏍️", appliances:"❄️", furniture:"🛋️", electronics:"💻", other:"📦" }[category] || "📦",
      badge:       badge || null,
      available:   true,
      rating:      0,
      reviews:     0,
      createdAt:   new Date().toISOString(),
      createdBy:   req.user.id,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("create product:", err.message);
    res.status(500).json({ error: "Failed to create product." });
  }
}

// ── PUT /api/products/:id  [Admin] ────────────────────────────────────────────
async function update(req, res) {
  try {
    const existing = await getDoc(DB.PRODUCTS, req.params.id);

    // Don't allow overwriting system fields
    const { _id, _rev, type, createdAt, ...changes } = req.body;

    const updated = await saveDoc(DB.PRODUCTS, {
      ...existing,
      ...changes,
      updatedAt:  new Date().toISOString(),
      updatedBy:  req.user.id,
    });

    res.json(updated);
  } catch (err) {
    if (err.status === 404) return res.status(404).json({ error: "Product not found." });
    res.status(500).json({ error: "Failed to update product." });
  }
}

// ── DELETE /api/products/:id  [Admin] ─────────────────────────────────────────
async function remove(req, res) {
  try {
    const doc = await getDoc(DB.PRODUCTS, req.params.id);
    await deleteDoc(DB.PRODUCTS, doc._id, doc._rev);
    res.json({ message: "Product deleted successfully." });
  } catch (err) {
    if (err.status === 404) return res.status(404).json({ error: "Product not found." });
    res.status(500).json({ error: "Failed to delete product." });
  }
}

// ── GET /api/products/:id/reviews  (placeholder for future ratings) ───────────
async function getReviews(req, res) {
  res.json({ productId: req.params.id, reviews: [], averageRating: 0 });
}
async function getCategoryCounts(req, res) {
  try {
    const allProducts = await findDocs(DB.PRODUCTS, { type: "product" }, { limit: 1000 });

    const counts = {};
    const validCategories = ["vehicles", "appliances", "furniture", "electronics", "bikes", "other"];
    validCategories.forEach(c => { counts[c] = 0; });

    allProducts.forEach(p => {
      if (p.category && counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });

    res.json(counts);
  } catch (err) {
    console.error("getCategoryCounts:", err.message);
    res.status(500).json({ error: "Failed to fetch category counts." });
  }
}

module.exports = { getAll, getOne, create, update, remove, getReviews, getCategoryCounts };
