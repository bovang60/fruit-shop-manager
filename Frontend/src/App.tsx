import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/home-page/Home'
import Login from './components/login/Login'
import Register from './components/register/Register'
import ForgotPassword from './components/forgot-password/ForgotPassword'
import ChangePassword from './components/change-password/ChangePassword'
import CategoryManagement from './components/category-management/CategoryManagement'
import AdminDashboard from './components/dashboard-admin/AdminDashboard'
import ShopManagement from './components/shop-management/ShopManagement'
import UserManagement from './components/user-management/UserManagement'
import Profile from './components/profile/Profile'
import SellerLayout from './components/seller/SellerLayout'
import SellerDashboard from './components/seller-dashboard/SellerDashboard'
import FruitManager from './components/seller-fruit/FruitManager'
import OrderManager from './components/seller-order/OrderManager'
import Report from './components/seller-report/Report'
import Voucher from './components/seller-voucher/Voucher'
import { PopupProvider } from './components/common/popup'
import { getUserFromStorage } from './services/authService'
import { useState } from 'react'
import './App.css'

function App() {
  const [user, setUser] = useState(() => getUserFromStorage())
  const shopId = Number(user?.shopId || 0)

  const handleLoginSuccess = () => {
    setUser(getUserFromStorage())
  }

  return (
    <BrowserRouter>
      <PopupProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login onSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/category-management" element={<CategoryManagement />} />
          <Route path="/shop-management" element={<ShopManagement />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/seller/profile" element={<SellerLayout><Profile embedded /></SellerLayout>} />
          <Route path="/seller/dashboard" element={<SellerLayout><SellerDashboard shopId={shopId} /></SellerLayout>} />
          <Route path="/seller/fruits" element={<SellerLayout><FruitManager shopId={shopId} /></SellerLayout>} />
          <Route path="/seller/orders" element={<SellerLayout><OrderManager shopId={shopId} /></SellerLayout>} />
          <Route path="/seller/reports" element={<SellerLayout><Report shopId={shopId} /></SellerLayout>} />
          <Route path="/seller/vouchers" element={<SellerLayout><Voucher shopId={shopId} /></SellerLayout>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </PopupProvider>
    </BrowserRouter>
  )
}

export default App;



