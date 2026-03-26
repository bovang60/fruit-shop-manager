import React from 'react';
import './OrderManager.css';

export type OrderData = {
    orderId: number;
    receiverName: string;
    receiverPhone: string;
    shippingAddress?: string;
    note?: string;
    subTotal?: number;
    shippingFee?: number;
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

const ORDER_STATUS_LABELS: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    SHIPPING: 'Đang giao',
    COMPLETED: 'Hoàn tất',
    CANCELLED: 'Đã hủy',
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
    { value: 'COMPLETED', label: 'Hoàn tất' },

    { value: 'CANCELLED', label: 'Đã hủy' },

];

const getOrderStatusLabel = (status: string) => ORDER_STATUS_LABELS[status] || status;
const getPaymentMethodLabel = (method?: string) =>
    (method ? PAYMENT_METHOD_LABELS[method] : '') || method || 'N/A';
const getPaymentStatusLabel = (status?: string) =>
    (status ? PAYMENT_STATUS_LABELS[status] : '') || status || 'N/A';

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
    return (
        <div className="home-root">
            <header className="home-actions">
                <h2>Quản lý đơn hàng</h2>
                {/* Sử dụng Nav Tabs contract */}
                <div className="nav-tabs">
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
            </header>

            <main className="content">
                {isDetailLoading && (
                    <div className="loading">Đang tải chi tiết đơn hàng...</div>
                )}
                {!isDetailLoading && selectedOrder && (
                    <section className="login-card" style={{ marginBottom: '20px', maxWidth: '100%' }}>
                        <header className="home-actions">
                            <h3>Chi tiết đơn #{selectedOrder.orderId}</h3>
                            <button type="button" className="primary" onClick={onCloseDetail}>Đóng</button>
                        </header>
                        <div className="order-detail-grid">
                            <div>
                                <strong>Khách hàng:</strong> {selectedOrder.receiverName}
                            </div>
                            <div>
                                <strong>SĐT:</strong> {selectedOrder.receiverPhone}
                            </div>
                            <div>
                                <strong>Địa chỉ nhận:</strong> {selectedOrder.shippingAddress || 'N/A'}
                            </div>
                            <div>
                                <strong>Ghi chú:</strong> {selectedOrder.note || 'N/A'}
                            </div>
                            <div>
                                <strong>Ngày đặt:</strong>{' '}
                                {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                            </div>
                            <div>
                                <strong>Phương thức thanh toán:</strong>{' '}
                                {getPaymentMethodLabel(selectedOrder.paymentMethod)}
                            </div>
                            <div>
                                <strong>Trạng thái thanh toán:</strong>{' '}
                                {getPaymentStatusLabel(selectedOrder.paymentStatus)}
                            </div>
                            <div>
                                <strong>Tạm tính:</strong>{' '}
                                {(selectedOrder.subTotal ?? 0).toLocaleString('vi-VN')}đ
                            </div>
                            <div>
                                <strong>Phí ship:</strong>{' '}
                                {(selectedOrder.shippingFee ?? 0).toLocaleString('vi-VN')}đ
                            </div>
                            <div>
                                <strong>Tổng tiền:</strong>{' '}
                                {selectedOrder.totalAmount.toLocaleString('vi-VN')}đ
                            </div>
                            <div>
                                <strong>Trạng thái:</strong> {getOrderStatusLabel(selectedOrder.status)}
                            </div>
                        </div>
                    </section>
                )}
                {isLoading ? (
                    <div className="loading">Đang tải danh sách đơn hàng...</div>
                ) : (
                    <div className="login-card" style={{ maxWidth: '100%' }}>
                        <table className="order-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                    <th style={{ padding: '12px' }}>Mã đơn</th>
                                    <th>Khách hàng</th>
                                    <th>Ngày đặt</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.orderId} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                        <td style={{ padding: '12px' }}>#{order.orderId}</td>
                                        <td>
                                            <strong>{order.receiverName}</strong><br/>
                                            <small>{order.receiverPhone}</small>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td className="price">{order.totalAmount.toLocaleString('vi-VN')}đ</td>
                                        <td>
                                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                {getOrderStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="form-actions">
                                            <button
                                                type="button"
                                                className="link-btn"
                                                onClick={() => onViewDetail(order.orderId)}
                                            >
                                                Xem
                                            </button>
                                            {order.status === 'PENDING' && (
                                                <button
                                                    type="button"
                                                    className="primary"
                                                    onClick={() => onUpdateStatus(order.orderId, 'CONFIRMED')}
                                                >
                                                    Xác nhận
                                                </button>
                                            )}
                                            {order.status === 'CONFIRMED' && (
                                                <button
                                                    type="button"
                                                    className="primary"
                                                    onClick={() => onUpdateStatus(order.orderId, 'SHIPPING')}
                                                >
                                                    Giao hàng
                                                </button>
                                            )}
                                            {order.status === 'SHIPPING' && (
                                                <button
                                                    type="button"
                                                    className="primary"
                                                    onClick={() => onUpdateStatus(order.orderId, 'COMPLETED')}
                                                >
                                                    Hoàn tất
                                                </button>
                                            )}
                                            {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                                                <button
                                                    type="button"
                                                    className="link-btn delete-btn"
                                                    onClick={() => onUpdateStatus(order.orderId, 'CANCELLED')}
                                                >
                                                    Hủy đơn
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrderManagerView;
