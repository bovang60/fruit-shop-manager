import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/home-page/Home'
import Login from './components/login/Login'
import Register from './components/register/Register'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
