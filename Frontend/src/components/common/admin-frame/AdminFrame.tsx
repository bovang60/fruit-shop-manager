import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUserFromStorage } from '../../../services/authService';
import './AdminFrame.css';

export interface NavItem {
    to: string;
    label: string;
    icon: string;
    title?: string;
    color?: string;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
    { to: '/admin-dashboard', label: 'Tổng quan', icon: 'dashboard', title: 'Tổng quan hệ thống' },
    { to: '/user-management', label: 'Quản lý người dùng', icon: 'person_search', title: 'Quản lý người dùng' },
    { to: '/shop-management', label: 'Phê duyệt Shop', icon: 'verified', title: 'Quản lý cửa hàng' },
    { to: '/category-management', label: 'Quản lý danh mục', icon: 'category', title: 'Danh mục trái cây' },
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
    logoutTo = '/login',
    brandName = 'FruitShop Admin',
    brandSubtext = 'Executive Portal',
    userInitials = 'AS',
    activePath,
    isSidebarCollapsed: controlledIsCollapsed,
    onToggleSidebar: controlledToggle,
    modalContent
}) => {
    const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const user = getUserFromStorage();

    const isSidebarCollapsed = controlledIsCollapsed !== undefined ? controlledIsCollapsed : internalIsCollapsed;
    const onToggleSidebar = controlledToggle || (() => setInternalIsCollapsed(!internalIsCollapsed));

    const currentPath = activePath || location.pathname;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isProfileOpen]);

    const handleProfileClick = () => {
        setIsProfileOpen(false);
        navigate('/admin-profile');
    };

    const handleLogout = () => {
        setIsProfileOpen(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate(logoutTo);
    };

    const userName = user?.fullName || 'Admin';
    const userEmail = user?.email || '';
    const userRole = user?.role || 'ADMIN';
    const userAvatar = user?.image || '';
    const initials = userName.charAt(0).toUpperCase() || userInitials;

    return (
        <>
            <div className={`admin-frame-root ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                {/* Sidebar Navigation */}
                <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                    <div className="sidebar-inner">
                        <div>
                            <div className="admin-brand" onClick={onToggleSidebar} style={{ cursor: 'pointer' }}>
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
                                        className={`nav-item ${currentPath === item.to ? 'active' : ''}`}
                                        title={item.title || item.label}
                                    >
                                        <span className="material-symbols-outlined">{item.icon}</span>
                                        <span className="nav-label">{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div>
                            <nav className="admin-nav">
                                <Link to={logoutTo} className="nav-item" style={{ color: '#ef4444' }} title="Logout">
                                    <span className="material-symbols-outlined">logout</span>
                                    <span className="nav-label">Logout</span>
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
                                    {isSidebarCollapsed ? 'menu_open' : 'menu'}
                                </span>
                            </button>
                        </div>
                        <div className="header-actions-right">
                            {/* Profile Dropdown */}
                            <div className="af-profile-container" ref={profileRef}>
                                <button
                                    className="af-avatar-btn"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    aria-label="User menu"
                                    aria-expanded={isProfileOpen}
                                    title={userName}
                                >
                                    {userAvatar ? (
                                        <img
                                            src={userAvatar}
                                            alt={userName}
                                            className="af-avatar-img"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const fb = e.currentTarget.nextElementSibling as HTMLElement;
                                                if (fb) fb.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className="af-avatar-fallback"
                                        style={{ display: userAvatar ? 'none' : 'flex' }}
                                    >
                                        {initials}
                                    </div>
                                </button>

                                {isProfileOpen && (
                                    <div className="af-dropdown-menu">
                                        {/* User info header */}
                                        <div className="af-dropdown-header">
                                            <div className="af-dropdown-avatar-row">
                                                {userAvatar ? (
                                                    <img src={userAvatar} alt={userName} className="af-dropdown-avatar-img" />
                                                ) : (
                                                    <div className="af-dropdown-avatar-fallback">{initials}</div>
                                                )}
                                                <div className="af-dropdown-user-info">
                                                    <div className="af-dropdown-name">{userName}</div>
                                                    <div className="af-dropdown-email">{userEmail}</div>
                                                </div>
                                            </div>
                                            {userRole && (
                                                <div className="af-dropdown-role-badge">{userRole}</div>
                                            )}
                                        </div>

                                        <div className="af-dropdown-divider"></div>

                                        <button className="af-dropdown-item" onClick={handleProfileClick}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
                                            <span>Xem hồ sơ</span>
                                        </button>

                                        <div className="af-dropdown-divider"></div>

                                        <button className="af-dropdown-item af-dropdown-item-danger" onClick={handleLogout}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
                                            <span>Đăng xuất</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    <div className="admin-content-scroll">
                        {children}
                    </div>
                </main>
            </div>
            {/* Render modal directly outside the flex boundaries, floating on top */}
            {modalContent && modalContent}
        </>
    );
};

export default AdminFrame;
export { AdminFrame };

