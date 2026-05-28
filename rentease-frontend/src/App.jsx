import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar     from "./components/Navbar";
import Footer     from "./components/Footer";
import WatsonChat from "./components/WatsonChat";
import Home          from "./pages/Home";
import Products      from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Categories    from "./pages/Categories";
import SearchResults from "./pages/SearchResults";
import About         from "./pages/About";
import Contact       from "./pages/Contact";
import FAQ           from "./pages/FAQ";
import Terms         from "./pages/Terms";
import Privacy       from "./pages/Privacy";
import Login  from "./pages/Login";
import Signup from "./pages/Signup";
import Forgot from "./pages/Forgot";
import Dashboard from "./pages/Dashboard";
import { MyRentals, Wishlist, Notifications, Profile, PaymentHistory } from "./pages/UserPages";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AdminProducts, AdminAddProduct, AdminUsers, AdminBookings, AdminAnalytics } from "./pages/admin/AdminPages";
import { AdminContacts } from "./pages/admin/AdminContacts";
import { ProtectedRoute, AdminRoute } from "./routes/ProtectedRoute";

export default function App() {
  const { isAuthenticated } = useAuth();
  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
      <Navbar />
      <main style={{ flex:1 }}>
        <Routes>
          {/* Public */}
          <Route path="/"             element={<Home />} />
          <Route path="/products"     element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/categories"   element={<Categories />} />
          <Route path="/search"       element={<SearchResults />} />
          <Route path="/about"        element={<About />} />
          <Route path="/contact"      element={<Contact />} />
          <Route path="/faq"          element={<FAQ />} />
          <Route path="/terms"        element={<Terms />} />
          <Route path="/privacy"      element={<Privacy />} />

          {/* Auth */}
          <Route path="/login"  element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path="/forgot" element={<Forgot />} />

          {/* User dashboard */}
          <Route path="/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/my-rentals"      element={<ProtectedRoute><MyRentals /></ProtectedRoute>} />
          <Route path="/wishlist"        element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/notifications"   element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/payment-history" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />

          {/* Admin dashboard */}
          <Route path="/admin"                element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products"       element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/products/add"   element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
          <Route path="/admin/users"          element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/bookings"       element={<AdminRoute><AdminBookings /></AdminRoute>} />
          <Route path="/admin/analytics"      element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
          <Route path="/admin/contacts"       element={<AdminRoute><AdminContacts /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <WatsonChat />
    </div>
  );
}
