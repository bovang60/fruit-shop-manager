import React from 'react';
import './SellerDashboard.css';

export type RecentOrder = {
    orderId: number;
    receiverName: string;
    subTotal: number;
    status: string;
};

export type DashboardStats = {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    lowStockItems: number;
};

export type Props = {
    stats: DashboardStats;
    recentOrders: RecentOrder[];
    isLoading: boolean;
};

const SellerDashboardView: React.FC<Props> = ({ stats, recentOrders, isLoading }) => {
    if (isLoading) return <div className="loading">Đang tải bảng điều khiển...</div>;

    return (
        <div className="home-root">
            <header className="home-actions">
                <h2>Bảng điều khiển Người bán</h2>
            </header>

            <section className="products-grid">
                <article className="product-card">
                    <div className="product-name">Doanh thu</div>
                    <div className="price">{stats.totalRevenue.toLocaleString()}đ</div>
                </article>

                <article className="product-card">
                    <div className="product-name">Chờ xác nhận</div>
                    <div className="price">{stats.pendingOrders}</div>
                </article>

                <article className="product-card">
                    <div className="product-name">Sắp hết hàng</div>
                    <div className="price" style={{ color: '#dc3545' }}>{stats.lowStockItems}</div>
                </article>
            </section>

            <main className="content" style={{ marginTop: '20px' }}>
                <div className="login-card" style={{ maxWidth: '100%' }}>
                    <h3>Đơn hàng gần đây</h3>
                    <table className="order-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '10px' }}>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order.orderId} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                    <td style={{ padding: '10px' }}>#{order.orderId}</td>
                                    <td>{order.receiverName}</td>
                                    <td className="price">{order.subTotal.toLocaleString()}đ</td>
                                    <td>
                                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default SellerDashboardView;