import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/home-page/Home'
import Login from './components/login/Login'
import Register from './components/register/Register'
import ChangePassword from './components/change-password/ChangePassword'
import './App.css'

// Seller Components
import SellerLayout from './components/seller/SellerLayout';
import SellerDashboard from './components/seller-dashboard/SellerDashboard';
import FruitManager from './components/seller-fruit/FruitManager';
import OrderManager from './components/seller-order/OrderManager';
import Voucher from './components/seller-voucher/Voucher';
import ProtectedRoute from './components/common/ProtectedRoute';

// Import helper để lấy thông tin user
import { getUserFromStorage } from './utils/apiClient';

function App() {
  // Lấy dữ liệu người dùng từ bộ nhớ cục bộ
  const user = getUserFromStorage();
  const shopId = user?.userId || 0; // Gán userId làm shopId cho các component seller

  return (
    <BrowserRouter>
      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* === PROTECTED SELLER ROUTES === */}
        <Route element={<ProtectedRoute allowedRole="SELLER" />}>
          <Route path="/seller" element={<SellerLayout />}>
            {/* Tự động chuyển hướng từ /seller sang /seller/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Các màn hình chức năng của Seller */}
            <Route path="dashboard" element={<SellerDashboard shopId={shopId} />} />
            <Route path="fruits" element={<FruitManager shopId={shopId} />} />
            <Route path="orders" element={<OrderManager shopId={shopId} />} />
            <Route path="vouchers" element={<Voucher shopId={shopId} />} />
          </Route>
        </Route>

        {/* Catch-all route: Chuyển hướng các đường dẫn không tồn tại về trang chủ */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App