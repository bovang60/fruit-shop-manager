import React from 'react';
import { Link } from 'react-router-dom';
import './Report.css';
import type { MonthlyReportPoint, ReportSummary } from './Report';

type Props = {
    data: ReportSummary | null;
    monthlyData: MonthlyReportPoint[];
    isLoading: boolean;
};

const ReportView: React.FC<Props> = ({ data, monthlyData, isLoading }) => {
    if (isLoading || !data) return <div className="loading">Đang tính toán báo cáo...</div>;

    const maxOrders = Math.max(...monthlyData.map((item) => item.orders), 1);
    const maxRevenue = Math.max(...monthlyData.map((item) => item.revenue), 1);

    return (
        <div className="seller-page">
            <div className="page-header-content">
                <nav className="breadcrumbs-modern">
                    <Link to="/seller/dashboard">Seller</Link>
                    <span className="material-symbols-outlined">chevron_right</span>
                    <span className="current">Báo cáo</span>
                </nav>
                <h1>Báo cáo bán hàng</h1>
                <p>Phân tích hiệu suất kinh doanh theo tháng trên cùng hệ bố cục với admin.</p>
                <p className="report-period-label">Kỳ báo cáo hiện tại: {data.monthLabel}</p>
            </div>

            <section className="seller-summary-grid">
                <article className="seller-summary-card">
                    <span className="seller-summary-card-label">Tổng đơn tháng này</span>
                    <span className="seller-summary-card-value">{data.totalOrders}</span>
                </article>
                <article className="seller-summary-card">
                    <span className="seller-summary-card-label">Đơn hoàn tất</span>
                    <span className="seller-summary-card-value">{data.successfulOrders}</span>
                </article>
                <article className="seller-summary-card">
                    <span className="seller-summary-card-label">Doanh thu tháng này</span>
                    <span className="seller-summary-card-value">{Number(data.totalRevenue || 0).toLocaleString('vi-VN')}đ</span>
                </article>
                <article className="seller-summary-card">
                    <span className="seller-summary-card-label">Sản phẩm đã bán</span>
                    <span className="seller-summary-card-value">{data.totalFruitsSold}</span>
                </article>
            </section>

            <section className="table-card report-chart-card">
                <div className="report-chart-header">
                    <div>
                        <h3>Đơn hàng và doanh thu theo tháng</h3>
                        <p>Thống kê 12 tháng gần nhất từ dữ liệu đơn hàng của cửa hàng.</p>
                    </div>
                    <div className="report-legend">
                        <span className="legend-item">
                            <span className="legend-dot orders"></span>
                            Số đơn
                        </span>
                        <span className="legend-item">
                            <span className="legend-dot revenue"></span>
                            Doanh thu
                        </span>
                    </div>
                </div>

                <div className="report-chart-grid">
                    {monthlyData.map((item) => (
                        <div key={item.label} className="report-chart-column">
                            <div className="report-bar-wrap">
                                <div
                                    className="report-bar orders"
                                    style={{ height: `${(item.orders / maxOrders) * 100}%` }}
                                    title={`Số đơn: ${item.orders}`}
                                />
                                <div
                                    className="report-bar revenue"
                                    style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                                    title={`Doanh thu: ${item.revenue.toLocaleString('vi-VN')}đ`}
                                />
                            </div>
                            <div className="report-month-label">{item.label}</div>
                            <div className="report-month-meta">
                                <span>{item.orders} đơn</span>
                                <span>{item.revenue.toLocaleString('vi-VN')}đ</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ReportView;
