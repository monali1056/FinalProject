require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { DB, saveDoc, findDocs } = require("../config/cloudant");

const PRODUCTS = [
  { name:"Honda City 2023",       category:"vehicles",    price:2499, deposit:5000,  image:"🚗", badge:"Most Rented",  features:["GPS","AC","Bluetooth"],               description:"Premium sedan for comfortable city drives." },
  { name:"Royal Enfield Bullet",  category:"bikes",       price:1299, deposit:3000,  image:"🏍️", badge:"Popular",      features:["Helmet","Insurance"],                 description:"Classic cruiser for long rides." },
  { name:"Samsung 1.5T Split AC", category:"appliances",  price:899,  deposit:2000,  image:"❄️", badge:"New Arrival",  features:["Installation","Warranty"],            description:"Energy-efficient 5-star rated AC." },
  { name:"LG 350L Refrigerator",  category:"appliances",  price:699,  deposit:1500,  image:"🧊", badge:null,           features:["Delivery","Installation"],            description:"Frost-free refrigerator with inverter compressor." },
  { name:"Premium Sofa Set",       category:"furniture",   price:1199, deposit:3000,  image:"🛋️", badge:"Top Rated",    features:["Delivery","Setup"],    available:false, description:"3-seater + 2-seater luxury sofa set." },
  { name:"MacBook Pro M2",         category:"electronics", price:3499, deposit:10000, image:"💻", badge:"Premium",      features:["Bag","Charger","Insurance"],           description:"Apple M2 chip, 16GB RAM, 512GB SSD." },
  { name:"Mountain Bicycle",       category:"bikes",       price:299,  deposit:1000,  image:"🚲", badge:null,           features:["Helmet","Lock"],                      description:"21-speed mountain bike for trails and roads." },
  { name:"King Size Bed Frame",    category:"furniture",   price:899,  deposit:2000,  image:"🛏️", badge:null,           features:["Mattress","Delivery"],                description:"Solid wood king-size bed with storage." },
  { name:"Washing Machine 7kg",    category:"appliances",  price:799,  deposit:2000,  image:"🫧", badge:"Best Seller",  features:["Installation","Warranty"],            description:"Fully automatic front-load washing machine." },
  { name:"Ola Electric Scooter",   category:"vehicles",    price:1799, deposit:4000,  image:"🛵", badge:"Eco-Friendly", features:["Charger","Insurance"],                description:"100% electric, 120km range, fast charging." },
  { name:"Sony 55\" 4K TV",        category:"electronics", price:1499, deposit:5000,  image:"📺", badge:null,           features:["Wall Mount","Remote"],                description:"55-inch OLED 4K Smart TV with Alexa." },
  { name:"Office Chair Premium",   category:"furniture",   price:499,  deposit:1000,  image:"🪑", badge:null,           features:["Delivery","Assembly"],                description:"Ergonomic mesh chair with lumbar support." },
];

async function seed() {
  console.log("\n🌱 RentEase AI — Seeding IBM Cloudant databases...\n");

  // ── Seed admin user ──────────────────────────────────────────────────────────
  const existing = await findDocs(DB.USERS, { email: "admin@rentease.com" });
  if (existing.length === 0) {
    const hashed = await bcrypt.hash("admin123", 12);
    await saveDoc(DB.USERS, {
      _id:       uuidv4(),
      type:      "user",
      name:      "Admin User",
      email:     "admin@rentease.com",
      password:  hashed,
      role:      "admin",
      phone:     "+91 80001 00001",
      address:   "Bangalore, Karnataka, India",
      wishlist:  [],
      createdAt: new Date().toISOString(),
    });
    console.log("✅ Admin user created — admin@rentease.com / admin123");
  } else {
    console.log("ℹ️  Admin user already exists");
  }

  // ── Seed products ────────────────────────────────────────────────────────────
  console.log("\n📦 Seeding products into IBM Cloudant...");
  for (const p of PRODUCTS) {
    await saveDoc(DB.PRODUCTS, {
      _id:         uuidv4(),
      type:        "product",
      period:      "month",
      available:   p.available !== false,
      rating:      +(Math.random() * 1.0 + 4.0).toFixed(1),
      reviews:     Math.floor(Math.random() * 180 + 50),
      createdAt:   new Date().toISOString(),
      ...p,
    });
    console.log(`   ✅ ${p.name} (₹${p.price}/mo)`);
  }

  console.log("\n✅ Seeding complete! IBM Cloudant is ready.\n");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
