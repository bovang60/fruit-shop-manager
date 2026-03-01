import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/home-page/Home'
import Login from './components/login/Login'
import Register from './components/register/Register'
import './App.css'
import ChangePassword from './components/change-password/ChangePassword'
import CategoryManagement from './components/category-management/CategoryManagement'
import AdminDashboard from './components/dashboard-admin/AdminDashboard'
import ShopManagement from './components/shop-management/ShopManagement'
import UserManagement from './components/user-management/UserManagement'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/category-management" element={<CategoryManagement />} />
        <Route path="/shop-management" element={<ShopManagement />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
