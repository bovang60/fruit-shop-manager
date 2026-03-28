import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminFrame.css";
import Header from "../header/Header";
export interface NavItem {
  to: string;
  label: string;
  icon: string;
  title?: string;
  color?: string;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    to: "/admin-dashboard",
    label: "Tổng quan",
    icon: "dashboard",
    title: "Tổng quan hệ thống",
  },
  {
    to: "/user-management",
    label: "Quản lý người dùng",
    icon: "person_search",
    title: "Quản lý người dùng",
  },
  {
    to: "/shop-management",
    label: "Phê duyệt Shop",
    icon: "verified",
    title: "Quản lý cửa hàng",
  },
  {
    to: "/category-management",
    label: "Quản lý danh mục",
    icon: "category",
    title: "Danh mục trái cây",
  },
];

interface AdminFrameProps {
  children: React.ReactNode;
  sidebarItems: NavItem[];
  logoutTo?: string;
  brandName?: string;
  brandSubtext?: string;
  userInitials?: string;
  activePath?: string;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  modalContent?: React.ReactNode;
}

const AdminFrame: React.FC<AdminFrameProps> = ({
  children,
  sidebarItems,
  logoutTo = "/login",
  brandName = "FruitShop Admin",
  brandSubtext = "Cổng Điều Hành",
  activePath,
  isSidebarCollapsed: controlledIsCollapsed,
  onToggleSidebar: controlledToggle,
  modalContent,
}) => {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isSidebarCollapsed =
    controlledIsCollapsed !== undefined
      ? controlledIsCollapsed
      : internalIsCollapsed;
  const onToggleSidebar =
    controlledToggle || (() => setInternalIsCollapsed(!internalIsCollapsed));

  const currentPath = activePath || location.pathname;

  const handleLogout = (_e: React.MouseEvent) => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate(logoutTo);
  };

  return (
    <>
      <div
        className={`admin-frame-root ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        {/* Sidebar Navigation */}
        <aside
          className={`admin-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}
        >
          <div className="sidebar-inner">
            <div>
              <div
                className="admin-brand"
                onClick={onToggleSidebar}
                style={{ cursor: "pointer" }}
              >
                <div className="brand-icon">
                  <span className="material-symbols-outlined">storefront</span>
                </div>
                <div className="brand-text">
                  <h1>{brandName}</h1>
                  <p>{brandSubtext}</p>
                </div>
              </div>
              <nav className="admin-nav">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`nav-item ${currentPath === item.to ? "active" : ""}`}
                    title={item.title || item.label}
                  >
                    <span className="material-symbols-outlined">
                      {item.icon}
                    </span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <nav className="admin-nav">
                <Link
                  to={logoutTo}
                  className="nav-item"
                  style={{ color: "#ef4444" }}
                  onClick={handleLogout}
                  title="Logout"
                >
                  <span className="material-symbols-outlined">logout</span>
                  <span className="nav-label">Đăng xuất</span>
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main">
          <header className="admin-header-rich">
            <div className="header-left-part">
              <button className="toggle-btn" onClick={onToggleSidebar}>
                <span className="material-symbols-outlined">
                  {isSidebarCollapsed ? "menu_open" : "menu"}
                </span>
              </button>
            </div>
            <div className="login-header">
              <Header hideProfile={false} />
            </div>
          </header>

          <div className="admin-content-scroll">{children}</div>
        </main>
      </div>
      {/* Render modal directly outside the flex boundaries, floating on top */}
      {modalContent && modalContent}
    </>
  );
};

export default AdminFrame;
export { AdminFrame };
