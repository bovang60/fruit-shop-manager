import React from 'react';
import { Link } from 'react-router-dom';
import './SellerDashboard.css';
import LoadingModal from '../common/loading/LoadingModal';
import type { SellerOrderDto } from '../../services/sellerOrderService';

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
    selectedOrder: SellerOrderDto | null;
    isDetailLoading: boolean;
    onViewDetail: (orderId: number) => void;
    onCloseDetail: () => void;
};

const ORDER_STATUS_LABELS: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    SHIPPING: 'Đang giao',
    DELIVERED: 'Đã giao',
    COMPLETED: 'Hoàn tất',
    CANCELLED: 'Đã hủy',
    REJECTED: 'Từ chối',
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
    PAID: 'Đã thanh toán',
};

const getOrderStatusLabel = (status: string) => ORDER_STATUS_LABELS[status] || status;
const getPaymentMethodLabel = (method?: string) =>
    (method ? PAYMENT_METHOD_LABELS[method] : '') || method || 'N/A';
const getPaymentStatusLabel = (status?: string) =>
    (status ? PAYMENT_STATUS_LABELS[status] : '') || status || 'N/A';
const formatCurrency = (value?: number) => `${(value ?? 0).toLocaleString('vi-VN')}đ`;
const getStatusClassName = (status: string) => `seller-status-chip is-${status.toLowerCase()}`;

const SellerDashboardView: React.FC<Props> = ({
    stats,
    recentOrders,
    isLoading,
    selectedOrder,
    isDetailLoading,
    onViewDetail,
    onCloseDetail,
}) => {
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
                                <th style={{ textAlign: 'right' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="seller-empty-state">Chưa có đơn hàng nào.</td>
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
                                        <td>
                                            <div className="seller-inline-actions" style={{ justifyContent: 'flex-end' }}>
                                                <button
                                                    type="button"
                                                    className="seller-secondary-btn"
                                                    onClick={() => onViewDetail(order.orderId)}
                                                >
                                                    Xem chi tiết
                                                </button>
                                            </div>
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
            {isDetailLoading && (
                <LoadingModal
                    isOpen={isDetailLoading}
                    message="Đang tải chi tiết đơn hàng..."
                    subMessage="Vui lòng chờ trong giây lát"
                    theme="green"
                />
            )}
            {selectedOrder && !isDetailLoading && (
                <div className="seller-dashboard-modal-overlay" onClick={onCloseDetail}>
                    <div className="seller-dashboard-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="seller-dashboard-modal-header">
                            <div>
                                <h3>Chi tiết đơn #{selectedOrder.orderId}</h3>
                                <p>
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
                    </div>
                </div>
            )}
        </>
    );
};

export default SellerDashboardView;
