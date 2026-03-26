import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/home-page/Home'
import Login from './components/login/Login'
import Register from './components/register/Register'
import ChangePassword from './components/change-password/ChangePassword'

// Seller Components
import SellerLayout from './components/seller/SellerLayout';
import SellerDashboard from './components/seller-dashboard/SellerDashboard';
import FruitManager from './components/seller-fruit/FruitManager';
import OrderManager from './components/seller-order/OrderManager';
import Voucher from './components/seller-voucher/Voucher';

// Import helper để lấy thông tin user
import { getUserFromStorage } from './utils/apiClient';
import ForgotPassword from './components/forgot-password/ForgotPassword';
import CategoryManagement from './components/category-management/CategoryManagement';
import AdminDashboard from './components/dashboard-admin/AdminDashboard';
import ShopManagement from './components/shop-management/ShopManagement';
import UserManagement from './components/user-management/UserManagement';
import Profile from './components/profile/Profile';
import ShopRegistration from './components/shop-registration/ShopRegistration';
import { PopupProvider } from './components/common/popup';
import ProtectedRoute from './components/common/protected-route/ProtectedRoute';

function App() {
  // Lấy dữ liệu người dùng từ bộ nhớ cục bộ
  const user = getUserFromStorage();
  const shopId = user?.userId || 0; // Gán userId làm shopId cho các component seller

  return (
    <BrowserRouter>
      <PopupProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* Public Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Private Routes - Required Login */}
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/register-shop" element={<ProtectedRoute><ShopRegistration /></ProtectedRoute>} />

          {/* Admin Routes - Required ADMIN role */}
          <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/category-management" element={<ProtectedRoute requiredRole="ADMIN"><CategoryManagement /></ProtectedRoute>} />
          <Route path="/shop-management" element={<ProtectedRoute requiredRole="ADMIN"><ShopManagement /></ProtectedRoute>} />
          <Route path="/user-management" element={<ProtectedRoute requiredRole="ADMIN"><UserManagement /></ProtectedRoute>} />

          {/* === PROTECTED SELLER ROUTES === */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellerLayout />
              </ProtectedRoute>
            }
          >
            {/* Tự động chuyển hướng từ /seller sang /seller/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Các màn hình chức năng của Seller */}
            <Route path="dashboard" element={<SellerDashboard shopId={shopId} />} />
            <Route path="fruits" element={<FruitManager shopId={shopId} />} />
            <Route path="orders" element={<OrderManager shopId={shopId} />} />
            <Route path="vouchers" element={<Voucher shopId={shopId} />} />
          </Route>
        </Routes>
      </PopupProvider>
    </BrowserRouter>
  )
}

export default App;
