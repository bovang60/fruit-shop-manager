import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/home-page/Home'
import Login from './components/login/Login'
import Register from './components/register/Register'
import ForgotPassword from './components/forgot-password/ForgotPassword'
import ChangePassword from './components/change-password/ChangePassword'
import Profile from './components/profile/Profile'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
