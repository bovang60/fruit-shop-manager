import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './SellerLayout.css'; // Import CSS đúng quy tắc

export type Props = { children: React.ReactNode }; // Khai báo Props rõ ràng

const SellerLayoutView: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate();
    const userRaw = localStorage.getItem('user');
    let user: { fullName?: string } | null = null;
    try {
        user = userRaw ? JSON.parse(userRaw) : null;
    } catch {
        user = null;
    }
    const sellerName = user?.fullName || 'Người bán';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('shopId');
        navigate('/login');
    };

    return (
        <div className="admin-dashboard-root seller-shell">
            <aside className="admin-sidebar seller-sidebar-shell">
                <div className="sidebar-inner">
                    <div>
                        <div className="admin-brand seller-brand" onClick={() => navigate('/seller/dashboard')}>
                            <div className="brand-icon">
                                <span className="material-symbols-outlined">storefront</span>
                            </div>
                            <div className="brand-text">
                                <h1>FruitShop Seller</h1>
                                <p>Sales Portal</p>
                            </div>
                        </div>
                        <nav className="admin-nav">
                            <NavLink to="/seller/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <span className="material-symbols-outlined">dashboard</span>
                                <span className="nav-label">Tổng quan</span>
                            </NavLink>
                            <NavLink to="/seller/fruits" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <span className="material-symbols-outlined">nutrition</span>
                                <span className="nav-label">Quản lý trái cây</span>
                            </NavLink>
                            <NavLink to="/seller/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <span className="material-symbols-outlined">receipt_long</span>
                                <span className="nav-label">Quản lý đơn hàng</span>
                            </NavLink>
                            <NavLink to="/seller/vouchers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <span className="material-symbols-outlined">confirmation_number</span>
                                <span className="nav-label">Mã giảm giá</span>
                            </NavLink>
                            <NavLink to="/seller/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <span className="material-symbols-outlined">monitoring</span>
                                <span className="nav-label">Báo cáo bán hàng</span>
                            </NavLink>
                            <NavLink to="/seller/shop" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <span className="material-symbols-outlined">store</span>
                                <span className="nav-label">Quản lý cửa hàng</span>
                            </NavLink>
                        </nav>
                    </div>
                    <div>
                        <nav className="admin-nav">
                            <button
                                type="button"
                                className="nav-item seller-nav-button"
                                onClick={() => navigate('/seller/profile')}
                            >
                                <span className="material-symbols-outlined">person</span>
                                <span className="nav-label">Hồ sơ người bán</span>
                            </button>
                            <button
                                type="button"
                                className="nav-item seller-nav-button seller-logout-button"
                                onClick={handleLogout}
                            >
                                <span className="material-symbols-outlined">logout</span>
                                <span className="nav-label">Đăng xuất</span>
                            </button>
                        </nav>
                    </div>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header-rich seller-header">
                    <div className="header-left-part">
                        <div className="seller-header-copy">
                            <h1>Khu vực người bán</h1>
                            <p>Quản lý sản phẩm, đơn hàng và hiệu suất cửa hàng.</p>
                        </div>
                    </div>
                    <div className="header-actions-right">
                        <button
                            type="button"
                            className="seller-home-button"
                            onClick={() => navigate('/home')}
                        >
                            Về trang chủ
                        </button>
                        <details className="seller-profile-menu">
                            <summary className="seller-profile-trigger" aria-label="Menu hồ sơ người bán">
                                <div className="user-avatar-circle seller-avatar">
                                    {sellerName.trim().charAt(0).toUpperCase() || 'S'}
                                </div>
                            </summary>
                            <div className="seller-profile-dropdown">
                                <div className="seller-profile-name">{sellerName}</div>
                                <button
                                    type="button"
                                    className="seller-menu-item"
                                    onClick={() => navigate('/seller/profile')}
                                >
                                    Hồ sơ người bán
                                </button>
                                <button
                                    type="button"
                                    className="seller-menu-item logout"
                                    onClick={handleLogout}
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        </details>
                    </div>
                </header>

                <div className="admin-content-scroll seller-content-shell">{children}</div>
            </main>
        </div>
    );
};

export default SellerLayoutView;
