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
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
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
    return '';
  };

  return (
    <div className="order-history-root">
      <header className="order-history-header">
        <Header />
      </header>

      <main className="order-history-main">
        <section className="order-history-container">
          <h1 className="order-history-title">My Orders</h1>

          {!loading && orders?.length === 0 ? (
            <div className="order-history-empty">
              <div className="order-history-empty-icon">📦</div>
              <h2>No Orders Found</h2>
              <p>You haven't placed any orders yet.</p>
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
                    <span className="order-card-id">Order #{order.orderId}</span>
                    <span className={`order-card-badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status || 'UNKNOWN'}
                    </span>
                  </div>
                  
                  <div className="order-card-body">
                    <div className="order-card-info-row">
                      <span className="order-card-label">Date:</span>
                      <span className="order-card-value">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="order-card-info-row">
                      <span className="order-card-label">Total:</span>
                      <span className="order-card-value order-card-total">
                        {order.totalPrice != null ? formatCurrency(order.totalPrice) : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="order-card-footer">
                    <span className="order-card-action">View Details &rarr;</span>
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
