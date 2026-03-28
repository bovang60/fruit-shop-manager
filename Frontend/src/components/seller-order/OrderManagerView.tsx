import React from 'react';
import { Link } from 'react-router-dom';
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

const getOrderStatusClass = (status?: string) => `seller-status-chip is-${(status || 'pending').toLowerCase()}`;
const getOrderStatusLabel = (status?: string) => {
    switch (status) {
        case 'PENDING': return 'Chờ xác nhận';
        case 'CONFIRMED': return 'Đã xác nhận';
        case 'SHIPPING': return 'Đang giao';
        case 'COMPLETED': return 'Hoàn tất';
        case 'CANCELLED': return 'Đã hủy';
        default: return status || 'PENDING';
    }
};

const OrderManagerView: React.FC<Props> = ({ orders, isLoading, currentFilter, onUpdateStatus, onFilterChange }) => {
    const filters = [
        { value: 'ALL', label: 'Tất cả' },
        { value: 'PENDING', label: 'Chờ xác nhận' },
        { value: 'CONFIRMED', label: 'Đã xác nhận' },
        { value: 'SHIPPING', label: 'Đang giao' },
        { value: 'COMPLETED', label: 'Hoàn tất' },
    ];

    return (
        <div className="seller-page">
            <div className="page-header-content">
                <nav className="breadcrumbs-modern">
                    <Link to="/seller/dashboard">Seller</Link>
                    <span className="material-symbols-outlined">chevron_right</span>
                    <span className="current">Đơn hàng</span>
                </nav>
                <h1>Quản lý đơn hàng</h1>
                <p>Đồng bộ filter và bảng dữ liệu theo khu vực seller.</p>
            </div>

            <section className="management-filter-section">
                <div className="filter-tabs-container">
                    {filters.map(filter => (
                        <button
                            key={filter.value}
                            type="button"
                            className={`filter-tab-item ${currentFilter === filter.value ? 'active' : ''}`}
                            onClick={() => onFilterChange(filter.value)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </section>

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
                                    orders.map(order => (
                                    <tr key={order.orderId}>
                                        <td>#{order.orderId}</td>
                                        <td>
                                            <span className="seller-primary-text">{order.receiverName}</span>
                                            <span className="seller-secondary-text">{order.receiverPhone}</span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td>{order.totalAmount.toLocaleString('vi-VN')}đ</td>
                                        <td>
                                            <span className={getOrderStatusClass(order.status)}>
                                                {getOrderStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="seller-inline-actions">
                                            {order.status === 'PENDING' && (
                                                <button
                                                    type="button"
                                                    className="btn-primary-admin"
                                                    onClick={() => onUpdateStatus(order.orderId, 'CONFIRMED')}
                                                >
                                                    Xác nhận
                                                </button>
                                            )}
                                            {order.status === 'CONFIRMED' && (
                                                <button
                                                    type="button"
                                                    className="btn-primary-admin"
                                                    onClick={() => onUpdateStatus(order.orderId, 'SHIPPING')}
                                                >
                                                    Giao hàng
                                                </button>
                                            )}
                                            </div>
                                        </td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
            </section>
        </div>
    );
};

export default OrderManagerView;
