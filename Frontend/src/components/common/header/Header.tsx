import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getUserFromStorage } from '../../../services/authService'
import HeaderView from './HeaderView'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined)
  const [userName, setUserName] = useState<string>('')
  const [userRole, setUserRole] = useState<string>('')

  // Load user info from localStorage
  useEffect(() => {
    const loadUserInfo = () => {
      const user = getUserFromStorage()
      if (user) {
        setUserAvatar(user.image)
        setUserName(user.fullName)
        setUserRole(user.role)
      } else {
        setUserAvatar(undefined)
        setUserName('')
        setUserRole('')
      }
    }

    loadUserInfo()

    // Listen for storage changes (when user updates avatar in another tab or after upload)
    const handleStorageChange = () => {
      loadUserInfo()
    }

    // Custom event for same-tab updates
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('userUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userUpdated', handleStorageChange)
    }
  }, [])

  const handleNavigateToProfile = () => navigate('/profile')
  const handleNavigateToHome = () => navigate('/home')
  const handleNavigateToProducts = () => navigate('/products')
  const handleNavigateToOrders = () => navigate('/order-history')
  const handleNavigateToCustomers = () => navigate('/cart')

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleNavigateToSellerRegistration = () => {
    navigate('/register-shop')
  }

  const handleNavigateToCart = () => {
    navigate('/cart')
  }

  const handleNavigateToSellerPortal = () => {
    navigate('/seller/dashboard')
  }

  return (
    <HeaderView 
      userAvatar={userAvatar}
      userName={userName}
      userRole={userRole}
      currentPath={location.pathname}
      onNavigateToHome={handleNavigateToHome}
      onNavigateToProducts={handleNavigateToProducts}
      onNavigateToOrders={handleNavigateToOrders}
      onNavigateToCustomers={handleNavigateToCustomers}
      onNavigateToProfile={handleNavigateToProfile}
      onLogout={handleLogout}
      onNavigateToSellerRegistration={handleNavigateToSellerRegistration}
      onNavigateToCart={handleNavigateToCart}
      onNavigateToSellerPortal={handleNavigateToSellerPortal}
    />
  )
}
