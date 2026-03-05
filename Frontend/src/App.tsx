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
import { PopupProvider } from './components/common/popup'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <PopupProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/category-management" element={<CategoryManagement />} />
          <Route path="/shop-management" element={<ShopManagement />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </PopupProvider>
    </BrowserRouter>
  )
}

export default App;
