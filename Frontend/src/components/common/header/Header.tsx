import { useNavigate } from 'react-router-dom'
import HeaderView from './HeaderView'

export default function Header() {
  const navigate = useNavigate()

  const handleNavigateToProfile = () => {
    navigate('/profile')
  }

  const handleLogout = () => {
    // Clear auth data from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')

    // Redirect to login page
    navigate('/login')
  }

  const handleNavigateToSellerRegistration = () => {
    navigate('/register-shop')
  }

  return (
    <HeaderView
      onNavigateToProfile={handleNavigateToProfile}
      onLogout={handleLogout}
      onNavigateToSellerRegistration={handleNavigateToSellerRegistration}
    />
  )
}
