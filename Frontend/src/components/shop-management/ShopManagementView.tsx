import { Link } from 'react-router-dom';
import { AdminFrame, ADMIN_NAV_ITEMS } from '../common/admin-frame';
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
    orderCount?: number;
    cancelRate?: string;
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
    onReject: (id: number) => void;
    onSuspend: (id: number) => void;
    setSelectedShop: (shop: Shop) => void;

    page: number;
    totalPages: number;
    totalElements: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
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
    onReject,
    onSuspend,
    setSelectedShop,

    page,
    totalPages,
    totalElements,
    onPageChange,
    loading = false
}) => {
    const renderListView = () => (
        <>
            <div className="page-header-content">
                <nav className="breadcrumbs-modern">
                    <Link to="/admin-dashboard">Bảng điều khiển</Link>
                    <span className="material-symbols-outlined">chevron_right</span>
                    <span className="current">Quản lý cửa hàng</span>
                </nav>
                <h1>Quản lý cửa hàng</h1>
                <p>Xem xét và quản lý các đơn đăng ký người bán và phê duyệt cửa hàng.</p>
            </div>

            <div className="management-filter-section">
                <div className="filter-search-actions">
                    <div className="modern-search-input-wrap">
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên shop hoặc chủ shop..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>

                    <div className="custom-dropdown-filters">
                        <div className="filter-select-wrap">
                            <select
                                value={activeTab}
                                onChange={(e) => onTabChange(e.target.value)}
                                className="modern-filter-select"
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="PENDING">Trạng thái: Chờ duyệt</option>
                                <option value="APPROVED">Trạng thái: Đã duyệt</option>
                                <option value="REJECTED">Trạng thái: Từ chối</option>
                            </select>
                            <span className="material-symbols-outlined select-arrow">expand_more</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-card">
                <table className={`admin-table ${loading ? 'table-loading' : ''}`}>
                    <thead>
                        <tr>
                            <th>Tên cửa hàng</th>
                            <th>Chủ sở hữu</th>
                            <th>Ngày đăng ký</th>
                            <th>Trạng thái</th>
                            {activeTab === 'REJECTED' && <th>Lý do</th>}
                            <th style={{ textAlign: 'center', width: '200px' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Đang tải cửa hàng...</td>
                            </tr>
                        ) : shops.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Không tìm thấy cửa hàng nào.</td>
                            </tr>
                        ) : (
                            shops.map((s) => (
                                <tr key={s.id}>
                                    <td><span style={{ fontWeight: 700 }}>{s.shopName}</span></td>
                                    <td>{s.ownerName}</td>
                                    <td style={{ color: '#637381' }}>{s.regDate}</td>
                                    <td>
                                        <span className={`status-chip status-${s.status.toLowerCase()}`}>
                                            {s.status === 'APPROVED' ? 'Đã duyệt' : s.status === 'PENDING' ? 'Chờ duyệt' : s.status === 'REJECTED' ? 'Từ chối' : 'Đình chỉ'}
                                        </span>
                                    </td>
                                    {activeTab === 'REJECTED' && <td>{s.rejectReason}</td>}
                                    <td>
                                        <div className="status-actions-group">
                                            <button
                                                className="icon-btn-action"
                                                title="Xem chi tiết"
                                                onClick={() => { setSelectedShop(s); setViewMode('DETAIL'); }}
                                            >
                                                <span className="material-symbols-outlined">visibility</span>
                                            </button>
                                            {s.status !== 'REJECTED' && (
                                                <>
                                                    <div className="action-divider-vertical"></div>
                                                    {(s.status === 'APPROVED' || s.status === 'SUSPENDED') && (
                                                        <button
                                                            className={`action-status-btn ${s.status === 'SUSPENDED' ? 'activate' : 'deactivate'}`}
                                                            onClick={() => onSuspend(s.id)}
                                                        >
                                                            {s.status === 'SUSPENDED' ? 'Kích hoạt lại' : 'Đình chỉ'}
                                                        </button>
                                                    )}
                                                    {s.status === 'PENDING' && (
                                                        <button
                                                            className="action-status-btn activate"
                                                            onClick={() => onApprove(s.id)}
                                                        >
                                                            Phê duyệt
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="table-footer">
                    <p className="footer-stats">
                        Hiển thị {shops.length} trên {totalElements} cửa hàng
                    </p>
                    <div className="pagination-group">
                        <button
                            className="page-btn"
                            disabled={page === 0 || loading}
                            onClick={() => onPageChange(page - 1)}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i).map(p => (
                            <button
                                key={p}
                                className={`page-btn ${page === p ? 'active' : ''}`}
                                onClick={() => onPageChange(p)}
                                disabled={loading}
                            >
                                {p + 1}
                            </button>
                        ))}

                        <button
                            className="page-btn"
                            disabled={page >= totalPages - 1 || loading}
                            onClick={() => onPageChange(page + 1)}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

    const renderDetailView = (shop: Shop) => (
        <div className="admin-modal-overlay" onClick={() => setViewMode('LIST')}>
            <div className="admin-modal-content large" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h2>Chi tiết cửa hàng</h2>
                    <button className="admin-modal-close-btn" onClick={() => setViewMode('LIST')} title="Đóng">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="user-identity-card" style={{ gap: '1.5rem', padding: '1rem', marginBottom: 0, boxShadow: 'none' }}>
                        <div className="brand-icon" style={{ width: '64px', height: '64px', borderRadius: '12px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>storefront</span>
                        </div>
                        <div className="user-identity-info">
                            <div className="identity-title-row">
                                <h2 className="user-name-title">{shop.shopName}</h2>
                                <span className={`status-chip status-${shop.status.toLowerCase()}`}>
                                    {shop.status === 'APPROVED' ? 'Đã duyệt' : shop.status === 'PENDING' ? 'Chờ duyệt' : shop.status === 'REJECTED' ? 'Từ chối' : 'Đình chỉ'}
                                </span>
                            </div>
                            <div className="user-role-meta">
                                <span className="material-symbols-outlined">person</span>
                                <span>{shop.ownerName}</span>
                            </div>
                        </div>
                    </div>

                    {shop.status === 'APPROVED' && (
                        <div className="modern-stats-grid" style={{ padding: '0 1rem', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                            <div className="modern-stat-card" style={{ marginBottom: 0, padding: '1.25rem' }}>
                                <div className="stat-card-info" style={{ flex: 1 }}>
                                    <p className="stat-card-label" style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#637381' }}>Số đơn hàng</p>
                                    <h3 className="stat-card-value" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#212b36' }}>{shop.orderCount || '1,245'}</h3>
                                </div>
                                <div className="stat-card-icon" style={{ color: '#00a76f', backgroundColor: '#00a76f14' }}>
                                    <span className="material-symbols-outlined">shopping_bag</span>
                                </div>
                            </div>
                            <div className="modern-stat-card" style={{ marginBottom: 0, padding: '1.25rem' }}>
                                <div className="stat-card-info" style={{ flex: 1 }}>
                                    <p className="stat-card-label" style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#637381' }}>Tỷ lệ hủy đơn</p>
                                    <h3 className="stat-card-value" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#212b36' }}>{shop.cancelRate || '2.4%'}</h3>
                                </div>
                                <div className="stat-card-icon" style={{ color: '#ff5630', backgroundColor: '#ff563014' }}>
                                    <span className="material-symbols-outlined">cancel</span>
                                </div>
                            </div>
                            <div className="modern-stat-card" style={{ marginBottom: 0, padding: '1.25rem' }}>
                                <div className="stat-card-info" style={{ flex: 1 }}>
                                    <p className="stat-card-label" style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#637381' }}>Số sản phẩm</p>
                                    <h3 className="stat-card-value" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#212b36' }}>{shop.productCount || '156'}</h3>
                                </div>
                                <div className="stat-card-icon" style={{ color: '#00b8d9', backgroundColor: '#00b8d914' }}>
                                    <span className="material-symbols-outlined">inventory_2</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="detail-section-card" style={{ marginBottom: 0, padding: '1rem', boxShadow: 'none' }}>
                        <h3 className="section-title-label" style={{ marginBottom: '1.25rem', fontSize: '0.875rem', color: '#637381', borderBottom: '1px solid #f4f6f8', paddingBottom: '0.75rem' }}>Thông tin Cửa hàng & Chủ sở hữu</h3>
                        <div className="section-content-body grid-info">
                            <div className="info-group">
                                <label>Tên chủ sở hữu</label>
                                <p>{shop.ownerName}</p>
                            </div>
                            <div className="info-group">
                                <label>Số điện thoại</label>
                                <p>{shop.ownerPhone || 'N/A'}</p>
                            </div>
                            <div className="info-group">
                                <label>Địa chỉ Email</label>
                                <p>{shop.ownerEmail || 'N/A'}</p>
                            </div>
                            <div className="info-group">
                                <label>Ngày đăng ký</label>
                                <p>{shop.regDate}</p>
                            </div>
                            <div className="info-group" style={{ gridColumn: 'span 2' }}>
                                <label>Địa chỉ kinh doanh</label>
                                <p>{shop.businessAddress || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {shop.description && (
                        <div className="detail-section-card" style={{ marginBottom: 0, padding: '1rem', boxShadow: 'none' }}>
                            <h3 className="section-title-label" style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#637381' }}>Mô tả kinh doanh</h3>
                            <p style={{ fontSize: '0.875rem', color: '#212b36', lineHeight: 1.6 }}>{shop.description}</p>
                        </div>
                    )}
                </div>

                <div className="admin-modal-footer">
                    <button className="btn-cancel-action" onClick={() => setViewMode('LIST')}>Đóng</button>
                    {shop.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="btn-status-toggle is-deactivate" onClick={() => onReject(shop.id)}>Từ chối Shop</button>
                            <button className="btn-status-toggle is-activate" onClick={() => onApprove(shop.id)}>Phê duyệt Shop</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <AdminFrame
            sidebarItems={ADMIN_NAV_ITEMS}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={onToggleSidebar}
            modalContent={viewMode === 'DETAIL' && selectedShop ? renderDetailView(selectedShop) : null}
        >
            {renderListView()}
        </AdminFrame>
    );
};

export default ShopManagementView;
