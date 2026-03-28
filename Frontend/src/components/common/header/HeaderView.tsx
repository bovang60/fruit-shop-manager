import { useState, useRef, useEffect } from "react";
import "./Header.css";

export type Props = {
  userAvatar?: string;
  userName: string;
  currentPath: string;
  isAdmin?: boolean;
  onNavigateToHome: () => void;
  onNavigateToProducts: () => void;
  onNavigateToOrders: () => void;
  onNavigateToProfile: () => void;
  onLogout: () => void;
  onNavigateToSellerRegistration: () => void;
  onNavigateToCart: () => void;
  onNavigateToAdminDashboard: () => void;
  hideProfile?: boolean;
};

export default function HeaderView({
  userAvatar,
  userName,
  currentPath,
  isAdmin = false,
  onNavigateToHome,
  onNavigateToProducts,
  onNavigateToProfile,
  onLogout,
  onNavigateToSellerRegistration,
  onNavigateToCart,
  onNavigateToAdminDashboard,
  hideProfile = false,
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    onNavigateToProfile();
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  return (
    <header className="site-header">
      <div className="brand">Trái cây tươi</div>
      <nav className="nav-tabs">
        <button
          className={`tab${currentPath === "/home" ? " active" : ""}`}
          onClick={onNavigateToHome}
        >
          Trang chủ
        </button>
        <button
          className={`tab${currentPath === "/products" ? " active" : ""}`}
          onClick={onNavigateToProducts}
        >
          Sản phẩm
        </button>
        <button
          className={`tab${currentPath === "/cart" ? " active" : ""}`}
          onClick={onNavigateToCart}
        >
          Đơn hàng
        </button>
        {!isAdmin && (
          <button
            className={`tab${currentPath === "/register-shop" ? " active" : ""}`}
            onClick={onNavigateToSellerRegistration}
          >
            Đăng kí bán hàng
          </button>
        )}
      </nav>
      <div className="header-actions">
        {!hideProfile && (
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
                    e.currentTarget.style.display = "none";
                    const svg = e.currentTarget
                      .nextElementSibling as HTMLElement;
                    if (svg) {
                      svg.style.display = "block";
                    }
                  }}
                />
              ) : null}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="profile-icon"
                style={{ display: userAvatar ? "none" : "block" }}
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="profile-dropdown-menu">
                <div className="profile-dropdown-header">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="profile-dropdown-avatar"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const placeholder = e.currentTarget
                          .nextElementSibling as HTMLElement;
                        if (placeholder) {
                          placeholder.style.display = "flex";
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className="profile-avatar-placeholder"
                    style={{ display: userAvatar ? "none" : "flex" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="profile-dropdown-info">
                    <p className="profile-dropdown-name">{userName}</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleProfileClick}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="dropdown-icon"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span>Hồ sơ</span>
                </button>
                {isAdmin && (
                  <>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onNavigateToAdminDashboard();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="dropdown-icon"
                      >
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                      </svg>
                      <span>Admin Dashboard</span>
                    </button>
                  </>
                )}
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item dropdown-item-danger"
                  onClick={handleLogoutClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="dropdown-icon"
                  >
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                  </svg>
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
