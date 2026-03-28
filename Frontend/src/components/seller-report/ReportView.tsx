import { Link } from 'react-router-dom';
import './Report.css';

type ReportData = {
    totalOrders: number;
    successfulOrders: number;
    totalRevenue: string;
    totalFruitsSold: number;
};

type ReportViewProps = {
    data: ReportData | null;
    isLoading: boolean;
};

const ReportView = ({ data, isLoading }: ReportViewProps) => {
    if (isLoading || !data) return <div className="loading">Đang tính toán báo cáo...</div>;

    return (
        <div className="seller-page">
            <div className="page-header-content">
                <nav className="breadcrumbs-modern">
                    <Link to="/seller/dashboard">Seller</Link>
                    <span className="material-symbols-outlined">chevron_right</span>
                    <span className="current">Báo cáo</span>
                </nav>
                <h1>Báo cáo bán hàng</h1>
                <p>Phân tích hiệu suất kinh doanh theo cùng bố cục của khu vực seller.</p>
            </div>

            <section className="seller-summary-grid">
                <article className="seller-summary-card">
                    <span className="seller-summary-card-label">Tổng đơn hàng</span>
                    <span className="seller-summary-card-value">{data.totalOrders}</span>
                </article>
                <article className="seller-summary-card">
                    <span className="seller-summary-card-label">Đơn thành công</span>
                    <span className="seller-summary-card-value">{data.successfulOrders}</span>
                </article>
                <article className="seller-summary-card">
                    <span className="seller-summary-card-label">Doanh thu (VNĐ)</span>
                    <span className="seller-summary-card-value">{data.totalRevenue}</span>
                </article>
                <article className="seller-summary-card">
                    <span className="seller-summary-card-label">Sản phẩm đã bán</span>
                    <span className="seller-summary-card-value">{data.totalFruitsSold}</span>
                </article>
            </section>
        </div>
    );
};

export default ReportView;
