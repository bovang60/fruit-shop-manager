import React from 'react';
import './OrderManager.css';

export type OrderData = {
    orderId: number;
    receiverName: string;
    receiverPhone: string;
    totalAmount: number;
    status: string;
    createdAt: string;
};

export type Props = {
    orders: OrderData[];
    isLoading: boolean;
    currentFilter: string;
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

const ORDER_FILTERS: Array<{ value: string; label: string }> = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'SHIPPING', label: 'Đang giao' },
    { value: 'COMPLETED', label: 'Hoàn tất' },
];

const getOrderStatusLabel = (status: string) => ORDER_STATUS_LABELS[status] || status;

const OrderManagerView: React.FC<Props> = ({ orders, isLoading, currentFilter, onUpdateStatus, onFilterChange }) => {
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
