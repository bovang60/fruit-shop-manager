import React from 'react';
import { Link } from 'react-router-dom';
import './ShopManagement.css';

export interface Shop {
    id: number;
    shopName: string;
    ownerName: string;
    regDate: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    description?: string;
    ownerPhone?: string;
    ownerEmail?: string;
    businessAddress?: string;
    documentUrls?: string[];
    productCount?: number;
    yearsInBusiness?: number;
    locationType?: string;
    staffCount?: number;
    rejectReason?: string;
}

interface ShopManagementViewProps {
    isSidebarCollapsed: boolean;
    onToggleSidebar: () => void;
    searchQuery: string;
    onSearchChange: (v: string) => void;
    activeTab: string;
    onTabChange: (tab: string) => void;
    shops: Shop[];
    viewMode: 'LIST' | 'DETAIL';
    selectedShop: Shop | null;
    setViewMode: (mode: 'LIST' | 'DETAIL') => void;
    onApprove: (id: number) => void;
    onSuspend: (id: number) => void;
    setSelectedShop: (shop: Shop) => void;
}

const ShopManagementView: React.FC<ShopManagementViewProps> = ({
    isSidebarCollapsed,
    onToggleSidebar,
    searchQuery,
    onSearchChange,
    activeTab,
    onTabChange,
    shops,
    viewMode,
    selectedShop,
    setViewMode,
    onApprove,
    onSuspend,
    setSelectedShop
}) => {
    const renderListView = () => (
        <>
            <div className="page-header-content">
                <nav className="breadcrumbs-modern">
                    <Link to="/admin-dashboard">Dashboard</Link>
                    <span className="material-symbols-outlined">chevron_right</span>
                    <span className="current">Shop Management</span>
                </nav>
                <h1>Seller Approvals</h1>
                <p>Review and manage merchant applications and storefront approvals.</p>
            </div>

            <div className="management-filter-section">
                <div className="filter-tabs-container">
                    <button
                        className={`filter-tab-item ${activeTab === 'PENDING' ? 'active' : ''}`}
                        onClick={() => onTabChange('PENDING')}
                    >
                        Pending
                    </button>
                    <button
                        className={`filter-tab-item ${activeTab === 'APPROVED' ? 'active' : ''}`}
                        onClick={() => onTabChange('APPROVED')}
                    >
                        Approval
                    </button>
                    <button
                        className={`filter-tab-item ${activeTab === 'REJECTED' ? 'active' : ''}`}
                        onClick={() => onTabChange('REJECTED')}
                    >
                        Rejected
                    </button>
                </div>

                <div className="filter-search-actions">
                    <div className="modern-search-input-wrap">
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            placeholder="Search by shop or owner name..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Shop Name</th>
                            <th>Owner</th>
                            <th>Reg Date</th>
                            <th>Status</th>
                            {activeTab === 'REJECTED' && <th>Reason</th>}
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shops.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No shops found.</td>
                            </tr>
                        ) : (
                            shops.map((s) => (
                                <tr key={s.id}>
                                    <td><span style={{ fontWeight: 700 }}>{s.shopName}</span></td>
                                    <td>{s.ownerName}</td>
                                    <td style={{ color: '#637381' }}>{s.regDate}</td>
                                    <td>
                                        <span className={`status-chip status-${s.status.toLowerCase()}`}>
                                            {s.status === 'APPROVED' ? 'Approval' : s.status}
                                        </span>
                                    </td>
                                    {activeTab === 'REJECTED' && <td>{s.rejectReason}</td>}
                                    <td>
                                        <div className="status-actions-group">
                                            <button
                                                className="icon-btn-action"
                                                title="View details"
                                                onClick={() => { setSelectedShop(s); setViewMode('DETAIL'); }}
                                            >
                                                <span className="material-symbols-outlined">visibility</span>
                                            </button>
                                            <div className="action-divider-vertical"></div>
                                            {activeTab === 'APPROVED' && (
                                                <button
                                                    className={`action-status-btn ${s.status === 'SUSPENDED' ? 'activate' : 'deactivate'}`}
                                                    onClick={() => onSuspend(s.id)}
                                                >
                                                    {s.status === 'SUSPENDED' ? 'Re-activate' : 'Suspend'}
                                                </button>
                                            )}
                                            {activeTab === 'PENDING' && (
                                                <button
                                                    className="action-status-btn activate"
                                                    onClick={() => onApprove(s.id)}
                                                >
                                                    Approve
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );

    const renderDetailView = (shop: Shop) => (
        <div className="user-detail-container">
            <div className="detail-top-bar" style={{ marginBottom: '1.5rem' }}>
                <button className="btn-back-circle" onClick={() => setViewMode('LIST')} title="Back to List">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
            </div>

            <div className="user-identity-card" style={{ gap: '1.5rem', padding: '1.5rem' }}>
                <div className="brand-icon" style={{ width: '64px', height: '64px', borderRadius: '12px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>storefront</span>
                </div>
                <div className="user-identity-info">
                    <div className="identity-title-row">
                        <h2 className="user-name-title">{shop.shopName}</h2>
                        <span className={`status-chip status-${shop.status.toLowerCase()}`}>
                            {shop.status}
                        </span>
                    </div>
                    <div className="user-role-meta">
                        <span className="material-symbols-outlined">person</span>
                        <span>{shop.ownerName}</span>
                    </div>
                </div>
            </div>

            <div className="detail-section-card">
                <h3 className="section-title-label" style={{ marginBottom: '1.25rem', fontSize: '0.875rem', color: '#637381', borderBottom: '1px solid #f4f6f8', paddingBottom: '0.75rem' }}>Shop & Owner Information</h3>
                <div className="section-content-body grid-info">
                    <div className="info-group">
                        <label>Owner Name</label>
                        <p>{shop.ownerName}</p>
                    </div>
                    <div className="info-group">
                        <label>Phone Number</label>
                        <p>{shop.ownerPhone || 'N/A'}</p>
                    </div>
                    <div className="info-group">
                        <label>Email Address</label>
                        <p>{shop.ownerEmail || 'N/A'}</p>
                    </div>
                    <div className="info-group">
                        <label>Registration Date</label>
                        <p>{shop.regDate}</p>
                    </div>
                    <div className="info-group" style={{ gridColumn: 'span 2' }}>
                        <label>Business Address</label>
                        <p>{shop.businessAddress || 'N/A'}</p>
                    </div>
                </div>
            </div>

            {shop.description && (
                <div className="detail-section-card">
                    <h3 className="section-title-label" style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#637381' }}>Business Description</h3>
                    <p style={{ fontSize: '0.875rem', color: '#212b36', lineHeight: 1.6 }}>{shop.description}</p>
                </div>
            )}

            <div className="detail-action-footer">
                <button className="btn-cancel-action" onClick={() => setViewMode('LIST')}>Close</button>
                {shop.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn-status-toggle is-deactivate">Reject Shop</button>
                        <button className="btn-status-toggle is-activate" onClick={() => onApprove(shop.id)}>Approve Shop</button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className={`user-management-root ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`} aria-label="Main Sidebar">
                <div className="sidebar-inner">
                    <div>
                        <div className="admin-brand" onClick={onToggleSidebar} style={{ cursor: 'pointer' }}>
                            <div className="brand-icon">
                                <span className="material-symbols-outlined">storefront</span>
                            </div>
                            <div className="brand-text">
                                <h1>FruitShop Admin</h1>
                                <p>Executive Portal</p>
                            </div>
                            <button className="toggle-btn">
                                <span className="material-symbols-outlined">
                                    {isSidebarCollapsed ? 'menu_open' : 'menu'}
                                </span>
                            </button>
                        </div>
                        <nav className="admin-nav">
                            <Link to="/admin-dashboard" className="nav-item" title="Global Overview">
                                <span className="material-symbols-outlined">dashboard</span>
                                <span className="nav-label">Global Overview</span>
                            </Link>
                            <Link to="/user-management" className="nav-item" title="User Management">
                                <span className="material-symbols-outlined">person_search</span>
                                <span className="nav-label">User Management</span>
                            </Link>
                            <Link to="/shop-management" className="nav-item active" title="Shop Management">
                                <span className="material-symbols-outlined">verified</span>
                                <span className="nav-label">Shop Management</span>
                            </Link>
                            <Link to="/category-management" className="nav-item" title="Category Management">
                                <span className="material-symbols-outlined">category</span>
                                <span className="nav-label">Category Management</span>
                            </Link>
                        </nav>
                    </div>
                    <div>
                        <nav className="admin-nav">
                            <Link to="#" className="nav-item" title="Help Center">
                                <span className="material-symbols-outlined">help_outline</span>
                                <span className="nav-label">Help Center</span>
                            </Link>
                            <Link to="/login" className="nav-item" style={{ color: '#ef4444' }} title="Logout">
                                <span className="material-symbols-outlined">logout</span>
                                <span className="nav-label">Logout</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header-rich">
                    <div className="header-left-part">
                        <div className="modern-search-bar">
                            <span className="material-symbols-outlined">search</span>
                            <input
                                type="text"
                                placeholder="Search anything..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                            <span className="search-shortcut">⌘K</span>
                        </div>
                    </div>
                    <div className="header-actions-right">
                        <div className="user-avatar-circle">AS</div>
                    </div>
                </header>

                <div className="admin-content-scroll">
                    {viewMode === 'DETAIL' && selectedShop
                        ? renderDetailView(selectedShop)
                        : renderListView()
                    }
                </div>
            </main>
        </div>
    );
};

export default ShopManagementView;
