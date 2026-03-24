import React, { useState, useRef, useEffect } from 'react'
import './Header.css'

export type Props = {
  userAvatar?: string
  userName: string
  currentPath: string
  onNavigateToHome: () => void
  onNavigateToProducts: () => void
  onNavigateToOrders: () => void
  onNavigateToCustomers: () => void
  onNavigateToProfile: () => void
  onLogout: () => void
  onNavigateToSellerRegistration: () => void
  onNavigateToCart: () => void
}

<<<<<<< HEAD
export default function HeaderView({ userAvatar, userName, currentPath, onNavigateToHome, onNavigateToProducts, onNavigateToOrders, onNavigateToCustomers, onNavigateToProfile, onLogout }: Props) {
=======
export default function HeaderView({ onNavigateToProfile, onLogout, onNavigateToSellerRegistration, onNavigateToCart }: Props) {
>>>>>>> e420909 (Cart)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleProfileClick = () => {
    setIsDropdownOpen(false)
    onNavigateToProfile()
  }

  const handleLogoutClick = () => {
    setIsDropdownOpen(false)
    onLogout()
  }

  return (
    <header className="site-header">
      <div className="brand">Fruit Shop Manager</div>
      <nav className="nav-tabs">
<<<<<<< HEAD
        <button
          className={`tab${currentPath === '/home' ? ' active' : ''}`}
          onClick={onNavigateToHome}
        >
          Trang chủ
        </button>
        <button
          className={`tab${currentPath === '/products' ? ' active' : ''}`}
          onClick={onNavigateToProducts}
        >
          Sản phẩm
        </button>
        <button
          className={`tab${currentPath === '/orders' ? ' active' : ''}`}
          onClick={onNavigateToOrders}
        >
          Đơn hàng
        </button>
        <button
          className={`tab${currentPath === '/customers' ? ' active' : ''}`}
          onClick={onNavigateToCustomers}
        >
          Khách hàng
        </button>
=======
        <button className="tab active">Trang chủ</button>
        <button className="tab">Sản phẩm</button>
        <button className="tab" onClick={onNavigateToCart}>Đơn hàng</button>
        <button className="tab" onClick={onNavigateToSellerRegistration}>Trở thành người bán</button>
>>>>>>> e420909 (Cart)
      </nav>
      <div className="header-actions">
        <div className="profile-dropdown-container" ref={dropdownRef}>
          <button
            className="profile-icon-btn"
            onClick={toggleDropdown}
            aria-label="User menu"
            title={userName || "User menu"}
            aria-expanded={isDropdownOpen}
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="profile-avatar-image"
                onError={(e) => {
                  // Fallback to SVG icon if image fails to load
                  e.currentTarget.style.display = 'none'
                  const svg = e.currentTarget.nextElementSibling as HTMLElement
                  if (svg) svg.style.display = 'block'
                }}
              />
            ) : null}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="profile-icon"
              style={{ display: userAvatar ? 'none' : 'block' }}
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="profile-dropdown-menu">
              <button className="dropdown-item" onClick={handleProfileClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="dropdown-icon"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span>Profile</span>
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item dropdown-item-danger" onClick={handleLogoutClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="dropdown-icon"
                >
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
