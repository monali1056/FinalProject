# 🚀 RentEase AI — Backend v2.0

**Node.js + Express backend powered by IBM Cloud**

| Service | Usage |
|---------|-------|
| 🗄️ IBM Cloudant | Primary NoSQL database — users, products, bookings, payments |
| 🔐 IBM App ID | JWT-based authentication & role management |
| 🤖 IBM Watson Assistant | AI chatbot proxy with local NLP fallback |
| ☁️ IBM Cloud | Deployment target |

---

## 📁 Folder Structure

```
backend/
├── server.js                        # Entry point — Express app
├── .env.example                     # Environment variable template
├── config/
│   └── cloudant.js                  # IBM Cloudant client + DB helpers
├── middleware/
│   └── auth.middleware.js           # JWT verify, requireAdmin, optionalAuth
├── controllers/
│   ├── auth.controller.js           # signup, login, profile, wishlist, password reset
│   ├── product.controller.js        # Product CRUD + search/filter
│   ├── booking.controller.js        # Create/manage bookings
│   ├── admin.controller.js          # Users, roles, analytics
│   ├── watson.controller.js         # Watson Assistant proxy + NLP fallback
│   ├── notification.controller.js   # In-app notifications
│   ├── payment.controller.js        # Payment history & status
│   └── contact.controller.js        # Contact form submissions
├── routes/
│   ├── auth.routes.js
│   ├── product.routes.js
│   ├── booking.routes.js
│   ├── admin.routes.js
│   ├── watson.routes.js
│   ├── notification.routes.js
│   ├── payment.routes.js
│   └── contact.routes.js
└── utils/
    └── seed.js                      # Seeds 12 products + admin user to Cloudant
```

---

## 🚀 Setup & Run

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in CLOUDANT_URL, CLOUDANT_API_KEY, and JWT_SECRET (required)
# Watson Assistant keys are optional — chatbot works without them
```

### 3. Get IBM Cloudant credentials (free)
1. Go to [IBM Cloud](https://cloud.ibm.com) → Create account (free)
2. Search **Cloudant** → Create service → **Lite plan** (free)
3. Go to **Service Credentials** → **New credential**
4. Click the credential → copy:
   - `url` → `CLOUDANT_URL`
   - `apikey` → `CLOUDANT_API_KEY`

### 4. Seed the database
```bash
node utils/seed.js
```
This creates:
- **12 rental products** across all categories
- **Admin account**: `admin@rentease.com` / `admin123`

### 5. Start the server
```bash
npm run dev    # development (nodemon)
npm start      # production
```
Server: **http://localhost:5000**

---

## 📡 Complete API Reference

### 🔑 Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | ❌ | Register new user |
| POST | `/login` | ❌ | Login → returns JWT + user |
| POST | `/forgot-password` | ❌ | Request password reset link |
| POST | `/reset-password` | ❌ | Reset password with token |
| GET | `/profile` | ✅ | Get current user profile |
| PUT | `/profile` | ✅ | Update name / phone / address |
| PUT | `/change-password` | ✅ | Change password |
| GET | `/wishlist` | ✅ | Get wishlist product IDs |
| POST | `/wishlist/:productId` | ✅ | Toggle product in wishlist |

### 📦 Products — `/api/products`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | List products — supports `?category=&search=&minPrice=&maxPrice=&available=&sort=` |
| GET | `/:id` | ❌ | Single product detail |
| GET | `/:id/reviews` | ❌ | Product reviews (placeholder) |
| POST | `/` | 🔐 Admin | Create product |
| PUT | `/:id` | 🔐 Admin | Update product |
| DELETE | `/:id` | 🔐 Admin | Delete product |

**Sort options**: `price_asc`, `price_desc`, `rating`, `newest`

### 📅 Bookings — `/api/bookings`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Create booking (also creates payment record + notification) |
| GET | `/my` | ✅ | Get current user's bookings |
| GET | `/all` | 🔐 Admin | Get all bookings — supports `?status=&userId=` |
| PUT | `/:id/status` | 🔐 Admin | Update status: `pending/active/completed/cancelled` |
| PUT | `/:id/cancel` | ✅ | Cancel own booking |

### 🤖 Watson — `/api/watson`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/message` | ❌ | Send chat message → returns AI reply (Watson or local NLP) |

**Request body**: `{ "message": "Recommend an AC", "sessionId": null }`

### 🔔 Notifications — `/api/notifications`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ✅ | Get user's notifications |
| PUT | `/read-all` | ✅ | Mark all notifications as read |
| PUT | `/:id/read` | ✅ | Mark single notification as read |

### 💳 Payments — `/api/payments`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/my` | ✅ | User's payment history |
| GET | `/all` | 🔐 Admin | All payments |
| PUT | `/:id/status` | 🔐 Admin | Update payment status |

### 📩 Contact — `/api/contact`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ❌ | Submit contact form (saved to Cloudant) |

### ⚙️ Admin — `/api/admin`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users` | 🔐 Admin | All users |
| GET | `/users/:id` | 🔐 Admin | Single user |
| PUT | `/users/:id/role` | 🔐 Admin | Change role: `user/admin` |
| DELETE | `/users/:id` | 🔐 Admin | Delete user |
| GET | `/analytics` | 🔐 Admin | Full analytics (revenue, bookings, categories, IBM Cloud meta) |
| GET | `/contacts` | 🔐 Admin | All contact form submissions |
| GET | `/payments` | 🔐 Admin | All payments |
| PUT | `/payments/:id/status` | 🔐 Admin | Update payment status |

### 🏥 Health
```
GET /api/health
→ { status, platform, database, auth, chatbot, timestamp, version }
```

---

## 🔐 Auth Flow

```
1. POST /api/auth/signup  →  { token, user }
2. POST /api/auth/login   →  { token, user }
3. Store token in localStorage as "rentease_token"
4. All requests: Authorization: Bearer <token>
```

---

## 🗄️ IBM Cloudant Databases

| Database | Documents |
|----------|-----------|
| `rentease_users` | User accounts |
| `rentease_products` | Rental product listings |
| `rentease_bookings` | Booking records |
| `rentease_payments` | Payment records |
| `rentease_notifications` | In-app notifications |
| `rentease_contacts` | Contact form submissions |

All databases are **auto-created** on first startup.

---

## ☁️ IBM Cloud Deployment

### Deploy to IBM Cloud Code Engine
```bash
# Build and push Docker image
docker build -t rentease-backend .
ibmcloud cr push us.icr.io/<namespace>/rentease-backend

# Deploy to Code Engine
ibmcloud ce app create --name rentease-backend --image us.icr.io/<namespace>/rentease-backend --port 5000
```

### Deploy to Render (free alternative)
1. Push to GitHub
2. Connect Render → select repo
3. Add environment variables from `.env`
4. Deploy

---

## 👤 Default Admin Credentials
```
Email:    admin@rentease.com
Password: admin123
```
**Change these immediately in production!**
