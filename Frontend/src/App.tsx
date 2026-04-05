import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home/Home";
import ProductList from "./components/home-page/Home";
import Wishlist from "./components/wishlist/Wishlist";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import ForgotPassword from "./components/forgot-password/ForgotPassword";
import ChangePassword from "./components/change-password/ChangePassword";
import CategoryManagement from "./components/category-management/CategoryManagement";
// import CategoryProducts from "./components/category-management/CategoryProducts";
import AdminDashboard from "./components/dashboard-admin/AdminDashboard";
import ShopManagement from "./components/shop-management/ShopManagement";
import UserManagement from "./components/user-management/UserManagement";
import SliderManagement from "./components/slider-management/SliderManagement";
import Profile from "./components/profile/Profile";
import ShopRegistration from "./components/shop-registration/ShopRegistration";
import { PopupProvider } from "./components/common/popup";
import ProtectedRoute from "./components/common/protected-route/ProtectedRoute";
import "./App.css";
import Cart from "./components/cart/Cart";
import Checkout from "./components/checkout/Checkout";
import OrderHistory from "./components/order-history/OrderHistory";
import OrderDetail from "./components/order-detail/OrderDetail";
import SellerDashboard from "./components/seller-dashboard/SellerDashboard";
import ProductDetail from "./components/product-detail/ProductDetail";
import SellerLayout from "./components/seller/SellerLayout";
import FruitManager from "./components/seller-fruit/FruitManager";
import OrderManager from "./components/seller-order/OrderManager";
import Voucher from "./components/seller-voucher/Voucher";
import Report from "./components/seller-report/Report";
import { getUserFromStorage } from "./services/authService";

function SellerRouteContent() {
  const user = getUserFromStorage();
  const shopId = user?.shopId ?? Number(localStorage.getItem("shopId") || 0);

  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<SellerDashboard shopId={shopId} />} />
      <Route path="fruits" element={<FruitManager shopId={shopId} />} />
      <Route path="orders" element={<OrderManager shopId={shopId} />} />
      <Route path="vouchers" element={<Voucher shopId={shopId} />} />
      <Route path="reports" element={<Report shopId={shopId} />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  );
}

function RootRedirect() {
  const user = getUserFromStorage()
  return <Navigate to={user ? '/home' : '/login'} replace />
}

function App() {
  return (
    <BrowserRouter>
      <PopupProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          {/* Public Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Private Routes - Required Login */}
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register-shop"
            element={
              <ProtectedRoute>
                <ShopRegistration />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/admin-profile"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminProfilePage />
              </ProtectedRoute>
            }
          /> */}

          {/* Admin Routes - Required ADMIN role */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category-management"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <CategoryManagement />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/category-management/:categoryId/products"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <CategoryProducts />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/shop-management"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ShopManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/slider-management"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <SliderManagement />
              </ProtectedRoute>
            }
          />
          {/*Cart Routes*/}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/order-detail/:orderId" element={<OrderDetail />} />
          <Route path="/seller-dashboard" element={<Navigate to="/seller/dashboard" replace />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route
            path="/seller/*"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellerLayout>
                  <SellerRouteContent />
                </SellerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller-dashboard"
            element={<Navigate to="/seller/dashboard" replace />}
          />
        </Routes>
      </PopupProvider>
    </BrowserRouter>
  );
}

export default App;
