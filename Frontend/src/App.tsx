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
import ShopRegistration from './components/shop-registration/ShopRegistration'
import AdminProfilePage from './components/admin-profile/AdminProfile'
import { PopupProvider } from './components/common/popup'
import ProtectedRoute from './components/common/protected-route/ProtectedRoute'
import './App.css'

function App() {
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
          <Route path="/admin-profile" element={<ProtectedRoute requiredRole="ADMIN"><AdminProfilePage /></ProtectedRoute>} />

          {/* Admin Routes - Required ADMIN role */}
          <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/category-management" element={<ProtectedRoute requiredRole="ADMIN"><CategoryManagement /></ProtectedRoute>} />
          <Route path="/shop-management" element={<ProtectedRoute requiredRole="ADMIN"><ShopManagement /></ProtectedRoute>} />
          <Route path="/user-management" element={<ProtectedRoute requiredRole="ADMIN"><UserManagement /></ProtectedRoute>} />
        </Routes>
      </PopupProvider>
    </BrowserRouter>
  )
}

export default App;
