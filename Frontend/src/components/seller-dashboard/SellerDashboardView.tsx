import React from 'react';
import { Link } from 'react-router-dom';
import './SellerDashboard.css';
import LoadingModal from '../common/loading/LoadingModal';

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
    return (
        <>
            <div className="home-root">
                <header className="home-actions">
                    <h2>Bảng điều khiển Người bán</h2>
                </header>

                <section className="seller-summary-grid">
                    <article className="seller-summary-card">
                        <span className="seller-summary-card-label">Tổng doanh thu</span>
                        <span className="seller-summary-card-value">{(stats.totalRevenue).toLocaleString('vi-VN')}đ</span>
                        <span className="seller-summary-card-note">Doanh thu tích lũy của cửa hàng</span>
                    </article>
                    <article className="seller-summary-card">
                        <span className="seller-summary-card-label">Tổng đơn hàng</span>
                        <span className="seller-summary-card-value">{stats.totalOrders}</span>
                        <span className="seller-summary-card-note">Số đơn đã phát sinh</span>
                    </article>
                    <article className="seller-summary-card">
                        <span className="seller-summary-card-label">Đơn chờ xác nhận</span>
                        <span className="seller-summary-card-value">{stats.pendingOrders}</span>
                        <span className="seller-summary-card-note">Cần xử lý sớm</span>
                    </article>
                    <article className="seller-summary-card">
                        <span className="seller-summary-card-label">Sản phẩm sắp hết hàng</span>
                        <span className="seller-summary-card-value">{stats.lowStockItems}</span>
                        <span className="seller-summary-card-note">Nên bổ sung tồn kho</span>
                    </article>
                </section>

                <section className="table-card">
                    <div className="seller-form-card-header seller-form-card">
                        <div>
                            <h3>Đơn hàng gần đây</h3>
                            <p>Danh sách các đơn mới nhất để theo dõi tiến độ xử lý.</p>
                        </div>
                        <Link to="/seller/orders" className="seller-secondary-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                            Xem tất cả đơn hàng
                        </Link>
                    </div>
                    <table className="admin-table seller-dashboard-table">
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="seller-empty-state">Chưa có đơn hàng nào.</td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order.orderId}>
                                        <td>#{order.orderId}</td>
                                        <td>{order.receiverName}</td>
                                        <td>{order.subTotal.toLocaleString('vi-VN')}đ</td>
                                        <td>
                                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </section>
            </div>
            <LoadingModal
                isOpen={isLoading}
                message="Đang tải bảng điều khiển..."
                subMessage="Vui lòng chờ trong giây lát"
                theme="green"
            />
        </>
    );
};

export default SellerDashboardView;
