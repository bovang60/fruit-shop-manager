import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getUserFromStorage } from '../../../services/authService'
import { checkCanRegisterShop } from '../../../services/shopService'
import { usePopup } from '../popup/PopupProvider'
import HeaderView from './HeaderView'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { showNotice } = usePopup()
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined)
  const [userName, setUserName] = useState<string>('')

  // Load user info from localStorage
  useEffect(() => {
    const loadUserInfo = () => {
      const user = getUserFromStorage()
      if (user) {
        setUserAvatar(user.image)
        setUserName(user.fullName)
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
  const handleNavigateToOrders = () => navigate('/orders')

  const handleLogout = () => {
    // Clear auth data from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')

    // Redirect to login page
    navigate('/login')
  }

  const handleNavigateToSellerRegistration = async () => {
    const user = getUserFromStorage();
    if (!user) {
      showNotice('Vui lòng đăng nhập để đăng ký trở thành người bán', 'Yêu cầu đăng nhập');
      navigate('/login');
      return;
    }

    // Kiểm tra quyền đăng ký mở shop
    const canRegisterRes = await checkCanRegisterShop(user.userId);
    if (canRegisterRes.resultCd === 0) {
      if (canRegisterRes.data) {
        navigate('/register-shop');
      } else {
        showNotice(canRegisterRes.message || 'Bạn đã có shop hoặc đơn đăng ký đang chờ duyệt.', 'Thông báo');
      }
    } else {
      // Nếu API lỗi, vẫn cho vào trang đăng ký để trang đó tự xử lý lại
      navigate('/register-shop');
    }
  }

  return (
    <HeaderView
      userAvatar={userAvatar}
      userName={userName}
      currentPath={location.pathname}
      onNavigateToHome={handleNavigateToHome}
      onNavigateToProducts={handleNavigateToProducts}
      onNavigateToOrders={handleNavigateToOrders}
      onNavigateToProfile={handleNavigateToProfile}
      onLogout={handleLogout}
      onNavigateToSellerRegistration={handleNavigateToSellerRegistration}
    />
  )
}
