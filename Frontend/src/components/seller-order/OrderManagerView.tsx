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

const OrderManagerView: React.FC<Props> = ({ orders, isLoading, currentFilter, onUpdateStatus, onFilterChange }) => {
    return (
        <div className="home-root">
            <header className="home-actions">
                <h2>Quản lý đơn hàng</h2>
                {/* Sử dụng Nav Tabs contract */}
                <div className="nav-tabs">
                    {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED'].map(status => (
                        <button
                            key={status}
                            type="button"
                            className={`tab ${currentFilter === status ? 'active' : ''}`}
                            onClick={() => onFilterChange(status)}
                        >
                            {status === 'ALL' ? 'Tất cả' : status}
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
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="price">{order.totalAmount.toLocaleString()}đ</td>
                                        <td>
                                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                {order.status}
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