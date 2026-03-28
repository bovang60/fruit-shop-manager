import Header from '../common/header/Header';
import Footer from '../common/footer/Footer';
import LoadingModal from '../common/loading/LoadingModal';
import type { OrderDto } from '../../services/orderService';
import './OrderHistory.css';

export interface OrderHistoryViewProps {
  orders: OrderDto[];
  loading: boolean;
  onOrderClick: (orderId: number) => void;
}

export default function OrderHistoryView({
  orders,
  loading,
  onOrderClick,
}: OrderHistoryViewProps) {

  const formatCurrency = (amount: number) => {
    return `₫${amount.toLocaleString('vi-VN')}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status?.toUpperCase() || '';
    if (s === 'PENDING') return 'order-badge--pending';
    if (s === 'SHIPPING' || s === 'PROCESSING') return 'order-badge--processing';
    if (s === 'COMPLETED' || s === 'DELIVERED') return 'order-badge--completed';
    if (s === 'CANCELLED') return 'order-badge--cancelled';
    if (s === 'REJECTED') return 'order-badge--cancelled';
    return '';
  };

  const translateStatus = (status: string) => {
    const s = status?.toUpperCase() || '';
    switch (s) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'PROCESSING': return 'Đang xử lý';
      case 'SHIPPING': return 'Đang giao';
      case 'DELIVERED': return 'Đã giao';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      case 'REJECTED': return 'Từ chối';
      default: return status || 'KHÔNG RÕ';
    }
  };

  return (
    <div className="order-history-root">
      <header className="order-history-header">
        <Header />
      </header>

      <main className="order-history-main">
        <section className="order-history-container">
          <h1 className="order-history-title">Đơn hàng của tôi</h1>

          {!loading && orders?.length === 0 ? (
            <div className="order-history-empty">
              <div className="order-history-empty-icon">📦</div>
              <h2>Không tìm thấy đơn hàng</h2>
              <p>Bạn chưa có đơn hàng nào.</p>
            </div>
          ) : (
            <div className="order-history-list">
              {orders?.map((order) => (
                <div
                  key={order.orderId}
                  className="order-history-card"
                  onClick={() => onOrderClick(order.orderId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onOrderClick(order.orderId);
                    }
                  }}
                >
                  <div className="order-card-header">
                    <span className="order-card-id">Đơn hàng #{order.orderId}</span>
                    <span className={`order-card-badge ${getStatusBadgeClass(order.status)}`}>
                      {translateStatus(order.status)}
                    </span>
                  </div>
                  
                  <div className="order-card-body">
                    <div className="order-card-info-row">
                      <span className="order-card-label">Ngày đặt:</span>
                      <span className="order-card-value">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="order-card-info-row">
                      <span className="order-card-label">Tổng tiền:</span>
                      <span className="order-card-value order-card-total">
                        {order.totalPrice != null ? formatCurrency(order.totalPrice) : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="order-card-footer">
                    <span className="order-card-action">Xem chi tiết &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="order-history-footer">
        <Footer />
      </footer>

      {/* Loading Modal */}
      <LoadingModal
        isOpen={loading}
        message="Đang tải đơn hàng..."
        subMessage="Vui lòng chờ trong giây lát"
        theme="blue"
      />
    </div>
  );
}
