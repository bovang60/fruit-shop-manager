import React from 'react';
import './OrderManager.css';
import { Link } from 'react-router-dom';
import Pagination from '../common/pagination/Pagination';
import LoadingModal from '../common/loading/LoadingModal';

export type OrderData = {
    orderId: number;
    receiverName: string;
    receiverPhone: string;
    shippingAddress?: string;
    note?: string;
    subTotal?: number;
    shippingFee?: number;
    discountValue?: number;
    paymentMethod?: string;
    paymentStatus?: string;
    totalAmount: number;
    status: string;
    createdAt: string;
};

export type Props = {
    orders: OrderData[];
    isLoading: boolean;
    currentFilter: string;
    selectedOrder: OrderData | null;
    isDetailLoading: boolean;
    onViewDetail: (id: number) => void;
    onCloseDetail: () => void;
    onUpdateStatus: (id: number, status: string) => void;
    onFilterChange: (status: string) => void;
};

const ITEMS_PER_PAGE = 10;

const ORDER_STATUS_LABELS: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    SHIPPING: 'Đang giao',
    DELIVERED: 'Đã giao',
    COMPLETED: 'Hoàn tất',
    CANCELLED: 'Đã hủy',
    REJECTED: 'Đã từ chối',

};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
    COD: 'Thanh toán khi nhận hàng',
    VNPAY: 'VNPay',
    MOMO: 'MoMo',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
    PENDING: 'Chờ thanh toán',
    SUCCESS: 'Thanh toán thành công',
    FAILED: 'Thanh toán thất bại',
    UNPAID: 'Chưa thanh toán',
    COMPLETED: 'Hoàn tất',
};

const ORDER_FILTERS: Array<{ value: string; label: string }> = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'SHIPPING', label: 'Đang giao' },
    { value: 'DELIVERED', label: 'Đã giao' },
    { value: 'COMPLETED', label: 'Hoàn tất' },
    { value: 'CANCELLED', label: 'Đã hủy' },
    { value: 'REJECTED', label: 'Đã từ chối' },

];

const getOrderStatusLabel = (status: string) => ORDER_STATUS_LABELS[status] || status;
const getPaymentMethodLabel = (method?: string) =>
    (method ? PAYMENT_METHOD_LABELS[method] : '') || method || 'N/A';
const getPaymentStatusLabel = (status?: string) =>
    (status ? PAYMENT_STATUS_LABELS[status] : '') || status || 'N/A';
const formatCurrency = (value?: number) => `${(value ?? 0).toLocaleString('vi-VN')}đ`;
const getStatusClassName = (status: string) => `seller-status-chip is-${status.toLowerCase()}`;

const OrderManagerView: React.FC<Props> = ({
    orders,
    isLoading,
    currentFilter,
    selectedOrder,
    isDetailLoading,
    onViewDetail,
    onCloseDetail,
    onUpdateStatus,
    onFilterChange,
}) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE));
    const paginatedOrders = orders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    React.useEffect(() => {
        setCurrentPage(1);
    }, [currentFilter]);

    React.useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return (
        <>
        <div className="seller-page">
            <header className="home-actions">
                <div className="page-header-content">
                    <nav className="breadcrumbs-modern">
                        <Link to="/seller/dashboard">Seller</Link>
                        <span className="material-symbols-outlined">chevron_right</span>
                        <span className="current">Đơn hàng</span>
                    </nav>
                    <h1>Quản lý đơn hàng</h1>
                    <p>Đồng bộ filter, bảng dữ liệu và khối chi tiết theo cùng hệ giao diện admin.</p>
                </div>
            </header>

            <section className="management-filter-section">
                <div className="filter-tabs-container">
                    {ORDER_FILTERS.map((filter) => (
                        <button
                            key={filter.value}
                            type="button"
                            className={`tab ${currentFilter === filter.value ? 'active' : ''}`}
                            onClick={() => onFilterChange(filter.value)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

            </section>

            {!isDetailLoading && selectedOrder && (
                <section className="data-card seller-order-detail-card">
                    <div className="seller-order-detail-header">
                        <div>
                            <h3>Chi tiết đơn #{selectedOrder.orderId}</h3>
                            <p className="seller-order-detail-subtitle">
                                Tạo lúc {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                            </p>
                        </div>
                        <button type="button" className="seller-secondary-btn" onClick={onCloseDetail}>Đóng</button>
                    </div>

                    <div className="seller-detail-grid">
                        <div className="seller-detail-item">
                            <span className="seller-detail-label">Khách hàng</span>
                            <span className="seller-detail-value">{selectedOrder.receiverName}</span>
                        </div>
                        <div className="seller-detail-item">
                            <span className="seller-detail-label">Số điện thoại</span>
                            <span className="seller-detail-value">{selectedOrder.receiverPhone}</span>
                        </div>
                        <div className="seller-detail-item seller-detail-item-wide">
                            <span className="seller-detail-label">Địa chỉ nhận</span>
                            <span className="seller-detail-value">{selectedOrder.shippingAddress || 'N/A'}</span>
                        </div>
                        <div className="seller-detail-item seller-detail-item-wide">
                            <span className="seller-detail-label">Ghi chú</span>
                            <span className="seller-detail-value">{selectedOrder.note || 'N/A'}</span>
                        </div>
                        <div className="seller-detail-item">
                            <span className="seller-detail-label">Trạng thái đơn hàng</span>
                            <span className={getStatusClassName(selectedOrder.status)}>
                                {getOrderStatusLabel(selectedOrder.status)}
                            </span>
                        </div>
                        <div className="seller-detail-item">
                            <span className="seller-detail-label">Phương thức thanh toán</span>
                            <span className="seller-detail-value">{getPaymentMethodLabel(selectedOrder.paymentMethod)}</span>
                        </div>
                        <div className="seller-detail-item">
                            <span className="seller-detail-label">Trạng thái thanh toán</span>
                            <span className="seller-detail-value">{getPaymentStatusLabel(selectedOrder.paymentStatus)}</span>
                        </div>
                        <div className="seller-detail-item">
                            <span className="seller-detail-label">Tạm tính</span>
                            <span className="seller-detail-value">{formatCurrency(selectedOrder.subTotal)}</span>
                        </div>
                        <div className="seller-detail-item">
                            <span className="seller-detail-label">Phí ship</span>
                            <span className="seller-detail-value">{formatCurrency(selectedOrder.shippingFee)}</span>
                        </div>
                        <div className="seller-detail-item">
                            <span className="seller-detail-label">Giảm giá voucher</span>
                            <span className="seller-detail-value">-{formatCurrency(selectedOrder.discountValue)}</span>
                        </div>
                        <div className="seller-detail-item">
                            <span className="seller-detail-label">Tổng tiền</span>
                            <span className="seller-detail-value">{formatCurrency(selectedOrder.totalAmount)}</span>
                        </div>
                    </div>
                </section>
            )}

            <section className="table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th style={{ textAlign: 'right' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="seller-empty-state">Đang tải danh sách đơn hàng...</td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="seller-empty-state">Không có đơn hàng nào phù hợp với bộ lọc hiện tại.</td>
                            </tr>
                        ) : (
                            paginatedOrders.map((order) => (
                                <tr key={order.orderId}>
                                    <td>#{order.orderId}</td>
                                    <td>
                                        <span className="seller-primary-text">{order.receiverName}</span>
                                        <span className="seller-secondary-text">{order.receiverPhone}</span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td>{order.totalAmount.toLocaleString('vi-VN')}đ</td>
                                    <td>
                                        <span className={getStatusClassName(order.status)}>
                                            {getOrderStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="seller-inline-actions">
                                            <button
                                                type="button"
                                                className="seller-secondary-btn"
                                                onClick={() => onViewDetail(order.orderId)}
                                            >
                                                Xem
                                            </button>
                                            {order.status === 'PENDING' && (
                                                <button
                                                    type="button"
                                                    className="btn-primary-admin seller-order-action-btn"
                                                    onClick={() => onUpdateStatus(order.orderId, 'CONFIRMED')}
                                                >
                                                    Xác nhận
                                                </button>
                                            )}
                                            {order.status === 'CONFIRMED' && (
                                                <button
                                                    type="button"
                                                    className="btn-primary-admin seller-order-action-btn"
                                                    onClick={() => onUpdateStatus(order.orderId, 'SHIPPING')}
                                                >
                                                    Giao hàng
                                                </button>
                                            )}
                                            {order.status === 'SHIPPING' && (
                                                <button
                                                    type="button"
                                                    className="btn-primary-admin seller-order-action-btn"
                                                    onClick={() => onUpdateStatus(order.orderId, 'COMPLETED')}
                                                >
                                                    Hoàn tất
                                                </button>
                                            )}
                                            {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                                                <button
                                                    type="button"
                                                    className="seller-ghost-btn seller-danger-btn"
                                                    onClick={() => onUpdateStatus(order.orderId, 'REJECTED')}
                                                >
                                                    Từ chối
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </section>
        </div >
        <LoadingModal
            isOpen={isLoading || isDetailLoading}
            message={isDetailLoading ? 'Đang tải chi tiết đơn hàng...' : 'Đang tải danh sách đơn hàng...'}
            subMessage="Vui lòng chờ trong giây lát"
            theme="green"
        />
        </>
    );
};

export default OrderManagerView;
