import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// Attach JWT to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("rentease_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("rentease_token");
      localStorage.removeItem("rentease_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Auth
export const authService = {
  signup:         (data) => API.post("/auth/signup", data),
  login:          (data) => API.post("/auth/login", data),
  getProfile:     ()     => API.get("/auth/profile"),
  updateProfile:  (data) => API.put("/auth/profile", data),
  changePassword: (data) => API.put("/auth/change-password", data),
  forgotPassword: (data) => API.post("/auth/forgot-password", data),
  resetPassword:  (data) => API.post("/auth/reset-password", data),
  getWishlist:    ()     => API.get("/auth/wishlist"),
  toggleWishlist: (id)   => API.post(`/auth/wishlist/${id}`),
};

// Products
export const productService = {
  getAll:          (params) => API.get("/products", { params }),
  getOne:          (id)     => API.get(`/products/${id}`),
  getCategoryCounts: ()     => API.get("/products/category-counts"), // ← NEW
  create:          (data)   => API.post("/products", data),
  update:          (id, data) => API.put(`/products/${id}`, data),
  delete:          (id)     => API.delete(`/products/${id}`),
};

// Bookings
export const bookingService = {
  create:        (data) => API.post("/bookings", data),
  getMyBookings: ()     => API.get("/bookings/my"),
  getAllBookings: ()     => API.get("/bookings/all"),
  updateStatus:  (id, status) => API.put(`/bookings/${id}/status`, { status }),
  cancel:        (id)   => API.put(`/bookings/${id}/cancel`),
};

// Notifications
export const notificationService = {
  getAll:      () => API.get("/notifications"),
  markRead:    (id) => API.put(`/notifications/${id}/read`),
  markAllRead: () => API.put("/notifications/read-all"),
};

// Payments
export const paymentService = {
  getMy:  () => API.get("/payments/my"),
  getAll: () => API.get("/payments/all"),
};

// Watson chatbot
export const watsonService = {
  sendMessage: (message, sessionId = null) =>
    API.post("/watson/message", { message, sessionId }),
};

// Contact form
export const contactService = {
  submit: (data) => API.post("/contact", data),
};

// Admin
export const adminService = {
  getUsers:      ()         => API.get("/admin/users"),
  updateRole:    (id, role) => API.put(`/admin/users/${id}/role`, { role }),
  deleteUser:    (id)       => API.delete(`/admin/users/${id}`),
  getAnalytics:  ()         => API.get("/admin/analytics"),
  getContacts:   ()         => API.get("/admin/contacts"),
  getAllPayments: ()         => API.get("/admin/payments"),
};

export default API;
