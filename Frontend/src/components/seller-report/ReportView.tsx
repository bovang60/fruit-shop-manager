import React from 'react';
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
        <div className="home-root">
            <header className="home-actions">
                <div>
                    <h2>Báo cáo kinh doanh theo tháng</h2>
                    <p className="report-period-label">Kỳ báo cáo hiện tại: {data.monthLabel}</p>
                </div>
            </header>

            <div className="products-grid"> {/* Re-use grid cho các thẻ stats */}
                <article className="product-card stat-card">
                    <div className="product-name">Tổng đơn tháng này</div>
                    <div className="price">{data.totalOrders}</div>
                </article>
                <article className="product-card stat-card">
                    <div className="product-name">Đơn hoàn tất tháng này</div>
                    <div className="price success">{data.successfulOrders}</div>
                </article>
                <article className="product-card stat-card">
                    <div className="product-name">Doanh thu tháng này</div>
                    <div className="price highlight">{Number(data.totalRevenue || 0).toLocaleString('vi-VN')}đ</div>
                </article>
                <article className="product-card stat-card">
                    <div className="product-name">Sản phẩm đã bán</div>
                    <div className="price">{data.totalFruitsSold}</div>
                </article>
            </div>

            <section className="report-chart-card">
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
