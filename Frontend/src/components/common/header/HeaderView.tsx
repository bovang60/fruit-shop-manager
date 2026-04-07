import { useState, useRef, useEffect } from "react";
import type { SellerOrderDto } from "../../../services/sellerOrderService";
import "./Header.css";

export type Props = {
  userAvatar?: string;
  userName: string;
  userRole: string;
  currentPath: string;
  onNavigateToHome: () => void;
  onNavigateToProducts: () => void;
  onNavigateToOrders: () => void;
  onNavigateToCustomers?: () => void;
  onNavigateToProfile: () => void;
  onLogout: () => void;
  onNavigateToSellerRegistration: () => void;
  onNavigateToCart: () => void;
  onNavigateToWishlist: () => void;
  onNavigateToSellerPortal: () => void;
  // Seller notifications
  isSeller?: boolean;
  newOrderCount?: number;
  pendingOrders?: SellerOrderDto[];
  isNotifOpen?: boolean;
  onNotifToggle?: () => void;
  onMarkAllRead?: () => void;
  onNotifOrderClick?: (orderId: number) => void;
  hideProfile?: boolean;
  isAdmin?: boolean;
  onNavigateToAdminDashboard: () => void;
};

export default function HeaderView({
  userAvatar,
  userName,
  userRole,
  currentPath,
  onNavigateToHome,
  onNavigateToProducts,
  onNavigateToProfile,
  onLogout,
  onNavigateToSellerRegistration,
  onNavigateToCart,
  onNavigateToWishlist,
  onNavigateToSellerPortal,
  isSeller = false,
  newOrderCount = 0,
  pendingOrders = [],
  isNotifOpen = false,
  onNotifToggle,
  onMarkAllRead,
  onNotifOrderClick,
  isAdmin = false,
  onNavigateToAdminDashboard,
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        if (isNotifOpen) onNotifToggle?.();
      }
    }

    if (isDropdownOpen || isNotifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen, isNotifOpen]);

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
      <div
        id="brand-header-logo"
        className="brand"
        onClick={onNavigateToHome}
        style={{ cursor: "pointer", color: "#1a2e1a", fontWeight: "800", fontSize: "1.5rem" }}
      >
        Trái cây tươi
      </div>
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
        {userRole !== "ADMIN" && userRole !== "SELLER" && (
          <>
            <button
              className={`tab${currentPath === "/cart" ? " active" : ""}`}
              onClick={onNavigateToCart}
            >
              Đơn hàng
            </button>
            <button
              className={`tab${currentPath === "/register-shop" ? " active" : ""}`}
              onClick={onNavigateToSellerRegistration}
            >
              Đăng ký bán hàng
            </button>
          </>
        )}
        {userRole === "SELLER" && (
          <button
            className={`tab${currentPath.startsWith("/seller") ? " active" : ""}`}
            onClick={onNavigateToSellerPortal}
          >
            Khu người bán
          </button>
        )}
      </nav>
      <div className="header-actions">
        {/* Bell notification - only for sellers */}
        {isSeller && (
          <div className="notif-container" ref={notifRef}>
            <button
              className="notif-btn"
              onClick={onNotifToggle}
              aria-label="Thông báo đơn hàng"
              title="Danh sách thông báo"
            >
              <span className="notif-btn-label">Thông báo</span>
              <span
                className="notif-count-outside"
                aria-label={`Có ${newOrderCount} thông báo mới`}
              >
                {newOrderCount > 99 ? "99+" : newOrderCount}
              </span>
              <span className="notif-caret" aria-hidden="true">▾</span>
            </button>
            {isNotifOpen && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <span className="notif-title">Danh sách thông báo</span>
                  {newOrderCount > 0 && (
                    <button className="notif-mark-read" onClick={onMarkAllRead}>
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>

                {pendingOrders.length === 0 ? (
                  <div className="notif-empty">
                    Không có thông báo mới
                  </div>
                ) : (
                  <ul className="notif-list">
                    {pendingOrders.slice(0, 10).map((order) => (
                      <li
                        key={order.orderId}
                        className="notif-item"
                        onClick={() => onNotifOrderClick?.(order.orderId)}
                      >
                        <div className="notif-item-body">
                          <p className="notif-item-title">
                            Đơn #{order.orderId} — {order.receiverName}
                          </p>
                          <p className="notif-item-sub">
                            ₫{order.totalAmount.toLocaleString("vi-VN")}
                            <span className="notif-item-time">
                              {new Date(order.createdAt).toLocaleTimeString(
                                "vi-VN",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </span>
                            <span
                              className="notif-item-dot"
                              aria-hidden="true"
                            ></span>
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        <button
          className="profile-icon-btn"
          onClick={onNavigateToWishlist}
          aria-label="Wishlist"
          title="Yêu thích"
          style={{ marginRight: '0.5rem', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            stroke="black"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="profile-icon"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

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
                  const svg = e.currentTarget.nextElementSibling as HTMLElement;
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
      </div>
    </header>
  );
}
