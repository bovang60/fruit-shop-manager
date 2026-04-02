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
        {/* <button
          className={`tab${currentPath === "/products" ? " active" : ""}`}
          onClick={onNavigateToProducts}
        >
          Sản phẩm
        </button> */}
        <button
          className={`tab${currentPath === "/cart" ? " active" : ""}`}
          onClick={onNavigateToCart}
        >
          Đơn hàng
        </button>
        {userRole !== "ADMIN" && (
          <button
            className={`tab${currentPath === "/register-shop" ? " active" : ""}`}
            onClick={onNavigateToSellerRegistration}
          >
            Đăng ký bán hàng
          </button>
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
              title="Thông báo đơn hàng mới"
            >
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="notif-icon"
              >
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg> */}
              {newOrderCount > 0 && (
                <span className="notif-badge">
                  {newOrderCount > 99 ? "99+" : newOrderCount}
                </span>
              )}

              <span
                className="notif-count-outside"
                aria-label={`Co ${newOrderCount} thong bao moi`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="notif-count-outside-icon"
                >
                  <path d="M12 2C8.69 2 6 4.69 6 8v3.59L4.29 13.3c-.63.63-.18 1.7.71 1.7H19c.89 0 1.34-1.07.71-1.7L18 11.59V8c0-3.31-2.69-6-6-6zM9.5 18a2.5 2.5 0 0 0 5 0h-5z" />
                </svg>
                <span className="notif-count-outside-text">
                  {newOrderCount > 99 ? "99+" : newOrderCount}
                </span>
              </span>
            </button>
            {isNotifOpen && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <span className="notif-title-wrap">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="notif-title-icon"
                    >
                      <path d="M12 2C8.69 2 6 4.69 6 8v3.59L4.29 13.3c-.63.63-.18 1.7.71 1.7H19c.89 0 1.34-1.07.71-1.7L18 11.59V8c0-3.31-2.69-6-6-6zM9.5 18a2.5 2.5 0 0 0 5 0h-5z" />
                    </svg>
                    <span className="notif-title">Đơn hàng mới</span>
                  </span>
                  {newOrderCount > 0 && (
                    <button className="notif-mark-read" onClick={onMarkAllRead}>
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>

                {pendingOrders.length === 0 ? (
                  <div className="notif-empty">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="notif-empty-icon"
                    >
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                    </svg>
                    <p>Không có đơn hàng mới</p>
                  </div>
                ) : (
                  <ul className="notif-list">
                    {pendingOrders.slice(0, 10).map((order) => (
                      <li
                        key={order.orderId}
                        className="notif-item"
                        onClick={() => onNotifOrderClick?.(order.orderId)}
                      >
                        <div className="notif-item-icon" aria-hidden="true">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="notif-item-icon-svg"
                          >
                            <path d="M7 4h-2l-1 2v2h1l2.6 5.59-1.35 2.44A1 1 0 0 0 7.1 18H19v-2H8.42l.93-1.68h7.47a1 1 0 0 0 .9-.55L21 7H8.53l-.94-2H7zm2 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                          </svg>
                        </div>
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
