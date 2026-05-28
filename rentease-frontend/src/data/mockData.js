export const CATEGORIES = [
  { id:"vehicles",   icon:"🚗", label:"Vehicles",   count:48, color:"#1a56db" },
  { id:"appliances", icon:"❄️", label:"Appliances", count:63, color:"#0e9f6e" },
  { id:"furniture",  icon:"🛋️", label:"Furniture",  count:91, color:"#7e3af2" },
  { id:"electronics",icon:"💻", label:"Electronics",count:57, color:"#e3a008" },
  { id:"bikes",      icon:"🚲", label:"Bikes",      count:34, color:"#e02424" },
  { id:"other",      icon:"📦", label:"Other",      count:29, color:"#6b7280" },
];

export const PRODUCTS = [
  { id:"p1",  name:"Honda City 2023",       category:"vehicles",   price:2499, period:"month", rating:4.8, reviews:124, image:"🚗", badge:"Most Rented",  deposit:5000,  available:true,  features:["GPS","AC","Bluetooth"] },
  { id:"p2",  name:"Royal Enfield Bullet",  category:"bikes",      price:1299, period:"month", rating:4.6, reviews:89,  image:"🏍️", badge:"Popular",       deposit:3000,  available:true,  features:["Helmet","Insurance"] },
  { id:"p3",  name:"Samsung 1.5T Split AC", category:"appliances", price:899,  period:"month", rating:4.7, reviews:203, image:"❄️", badge:"New Arrival",   deposit:2000,  available:true,  features:["Installation","Warranty"] },
  { id:"p4",  name:"LG 350L Refrigerator",  category:"appliances", price:699,  period:"month", rating:4.5, reviews:156, image:"🧊", badge:null,            deposit:1500,  available:true,  features:["Delivery","Installation"] },
  { id:"p5",  name:"Premium Sofa Set",       category:"furniture",  price:1199, period:"month", rating:4.9, reviews:78,  image:"🛋️", badge:"Top Rated",     deposit:3000,  available:false, features:["Delivery","Setup"] },
  { id:"p6",  name:"MacBook Pro M2",         category:"electronics",price:3499, period:"month", rating:4.8, reviews:91,  image:"💻", badge:"Premium",       deposit:10000, available:true,  features:["Bag","Charger","Insurance"] },
  { id:"p7",  name:"Mountain Bicycle",       category:"bikes",      price:299,  period:"month", rating:4.3, reviews:67,  image:"🚲", badge:null,            deposit:1000,  available:true,  features:["Helmet","Lock"] },
  { id:"p8",  name:"King Size Bed Frame",    category:"furniture",  price:899,  period:"month", rating:4.6, reviews:112, image:"🛏️", badge:null,            deposit:2000,  available:true,  features:["Mattress","Delivery"] },
  { id:"p9",  name:"Washing Machine 7kg",    category:"appliances", price:799,  period:"month", rating:4.7, reviews:188, image:"🫧", badge:"Best Seller",   deposit:2000,  available:true,  features:["Installation","Warranty"] },
  { id:"p10", name:"Ola Electric Scooter",   category:"vehicles",   price:1799, period:"month", rating:4.5, reviews:143, image:"🛵", badge:"Eco-Friendly",  deposit:4000,  available:true,  features:["Charger","Insurance"] },
  { id:"p11", name:"Sony 55\" 4K TV",        category:"electronics",price:1499, period:"month", rating:4.8, reviews:99,  image:"📺", badge:null,            deposit:5000,  available:true,  features:["Mount","Remote"] },
  { id:"p12", name:"Office Chair Premium",   category:"furniture",  price:499,  period:"month", rating:4.4, reviews:54,  image:"🪑", badge:null,            deposit:1000,  available:true,  features:["Delivery","Assembly"] },
];

export const IBM_SERVICES = [
  { id:"appid",   name:"IBM App ID",        icon:"🔐", color:"#1a56db", description:"Secure authentication & authorization with JWT tokens, role-based access, and SSO support.",      features:["JWT Authentication","Role-Based Access","Social Login","MFA Support"] },
  { id:"watson",  name:"Watson Assistant",  icon:"🤖", color:"#7e3af2", description:"AI-powered chatbot providing smart rental recommendations, booking help, and 24/7 support.",      features:["NLP Processing","Intent Detection","Contextual Replies","Multi-turn Dialog"] },
  { id:"cloudant",name:"IBM Cloudant",      icon:"🗄️", color:"#0e9f6e", description:"Fully managed NoSQL database storing all platform data — users, products, bookings, analytics.", features:["NoSQL Database","Real-time Sync","99.99% Uptime","Auto Scaling"] },
  { id:"cloud",   name:"IBM Cloud",         icon:"☁️", color:"#e3a008", description:"Global cloud infrastructure hosting the entire RentEase AI platform with CI/CD pipelines.",       features:["Global CDN","Auto Scaling","CI/CD Pipeline","Monitoring"] },
];

export const TESTIMONIALS = [
  { name:"Priya Sharma", city:"Mumbai",    rating:5, text:"RentEase AI made renting a sofa set so easy! The Watson chatbot helped me choose the right package.", avatar:"PS" },
  { name:"Rahul Verma",  city:"Bengaluru", rating:5, text:"Rented a car for 3 months — seamless booking. IBM App ID login was super secure and fast!", avatar:"RV" },
  { name:"Anika Patel",  city:"Delhi",     rating:4, text:"Excellent AC rental service. Installation was quick and the app UI is just beautiful!", avatar:"AP" },
];

export const MOCK_BOOKINGS = [
  { id:"b1", productName:"Honda City 2023",       image:"🚗", price:2499, startDate:"2025-03-01", endDate:"2025-06-01", status:"active",    duration:3 },
  { id:"b2", productName:"Samsung 1.5T Split AC", image:"❄️", price:899,  startDate:"2025-01-15", endDate:"2025-07-15", status:"active",    duration:6 },
  { id:"b3", productName:"MacBook Pro M2",         image:"💻", price:3499, startDate:"2024-11-01", endDate:"2025-02-01", status:"completed", duration:3 },
];

export const MOCK_PAYMENTS = [
  { id:"pay1", date:"2025-05-01", product:"Honda City 2023",       amount:2499, status:"paid" },
  { id:"pay2", date:"2025-05-01", product:"Samsung 1.5T Split AC", amount:899,  status:"paid" },
  { id:"pay3", date:"2025-04-01", product:"Honda City 2023",       amount:2499, status:"paid" },
  { id:"pay4", date:"2025-04-01", product:"Samsung 1.5T Split AC", amount:899,  status:"paid" },
];
