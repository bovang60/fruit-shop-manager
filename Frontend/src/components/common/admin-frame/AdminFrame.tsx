import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminFrame.css';

export interface NavItem {
    to: string;
    label: string;
    icon: string;
    title?: string;
    color?: string;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
    { to: '/admin-dashboard', label: 'Global Overview', icon: 'dashboard', title: 'Global Overview' },
    { to: '/user-management', label: 'User Management', icon: 'person_search', title: 'User Management' },
    { to: '/shop-management', label: 'Shop Management', icon: 'verified', title: 'Shop Management' },
    { to: '/category-management', label: 'Category Management', icon: 'category', title: 'Category Management' },
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
    onToggleSidebar: controlledToggle
}) => {
    const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
    const location = useLocation();
    
    const isSidebarCollapsed = controlledIsCollapsed !== undefined ? controlledIsCollapsed : internalIsCollapsed;
    const onToggleSidebar = controlledToggle || (() => setInternalIsCollapsed(!internalIsCollapsed));

    // Determine active path: either from props or from current location
    const currentPath = activePath || location.pathname;

    return (
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
                        <div className="user-avatar-circle">{userInitials}</div>
                    </div>
                </header>

                <div className="admin-content-scroll">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminFrame;
export { AdminFrame };
