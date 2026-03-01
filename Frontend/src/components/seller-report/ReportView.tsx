import React from 'react';
import './Report.css';

const ReportView = ({ data, isLoading }) => {
    if (isLoading || !data) return <div className="loading">Đang tính toán báo cáo...</div>;

    return (
        <div className="home-root">
            <header className="home-actions">
                <h2>Báo cáo kinh doanh</h2>
            </header>

            <div className="products-grid"> {/* Re-use grid cho các thẻ stats */}
                <article className="product-card stat-card">
                    <div className="product-name">Tổng đơn hàng</div>
                    <div className="price">{data.totalOrders}</div>
                </article>
                <article className="product-card stat-card">
                    <div className="product-name">Đơn thành công</div>
                    <div className="price success">{data.successfulOrders}</div>
                </article>
                <article className="product-card stat-card">
                    <div className="product-name">Doanh thu (VNĐ)</div>
                    <div className="price highlight">{data.totalRevenue}</div>
                </article>
                <article className="product-card stat-card">
                    <div className="product-name">Sản phẩm đã bán</div>
                    <div className="price">{data.totalFruitsSold}</div>
                </article>
            </div>
        </div>
    );
};

export default ReportView;