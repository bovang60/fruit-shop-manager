import Header from '../common/header/Header';
import Footer from '../common/footer/Footer';
import type { OrderDto } from '../../services/orderService';
import './SellerDashboard.css';

export interface SellerDashboardViewProps {
  orders: OrderDto[];
  loading: boolean;
  actionLoading: boolean;
  onConfirmOrder: (orderId: number) => void;
  onUpdateStatus: (orderId: number, status: string) => void;
  onOrderClick: (orderId: number) => void;
}

export default function SellerDashboardView({
  orders,
  loading,
  actionLoading,
  onConfirmOrder,
  onUpdateStatus,
  onOrderClick,
}: SellerDashboardViewProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status?.toUpperCase() || '';
    if (s === 'PENDING') return 'sd-badge--pending';
    if (s === 'CONFIRMED') return 'sd-badge--confirmed';
    if (s === 'PROCESSING') return 'sd-badge--processing';
    if (s === 'SHIPPING') return 'sd-badge--shipping';
    if (s === 'DELIVERED') return 'sd-badge--delivered';
    if (s === 'COMPLETED') return 'sd-badge--completed';
    if (s === 'CANCELLED') return 'sd-badge--cancelled';
    return '';
  };

  const renderActionButton = (order: OrderDto) => {
    const s = order.status?.toUpperCase() || '';

    if (s === 'PENDING') {
      return (
        <button
          id={`sd-btn-confirm-${order.orderId}`}
          type="button"
          className="sd-btn sd-btn-confirm"
          onClick={(e) => { e.stopPropagation(); onConfirmOrder(order.orderId); }}
          disabled={actionLoading}
        >
          {actionLoading ? 'Processing...' : 'Confirm Order'}
        </button>
      );
    }

    if (s === 'CONFIRMED' || s === 'PROCESSING') {
      return (
        <button
          id={`sd-btn-shipping-${order.orderId}`}
          type="button"
          className="sd-btn sd-btn-shipping"
          onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.orderId, 'SHIPPING'); }}
          disabled={actionLoading}
        >
          {actionLoading ? 'Processing...' : 'Mark as Shipping'}
        </button>
      );
    }

    if (s === 'SHIPPING') {
      return (
        <button
          id={`sd-btn-delivered-${order.orderId}`}
          type="button"
          className="sd-btn sd-btn-delivered"
          onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.orderId, 'DELIVERED'); }}
          disabled={actionLoading}
        >
          {actionLoading ? 'Processing...' : 'Mark as Delivered'}
        </button>
      );
    }

    return null;
  };

  return (
    <div className="sd-root">
      <header className="sd-header">
        <Header />
      </header>

      <main className="sd-main">
        <section className="sd-container">
          <h1 className="sd-title">Seller Dashboard</h1>

          {loading ? (
            <div className="sd-loading">
              <div className="sd-spinner"></div>
              <p>Loading orders...</p>
            </div>
          ) : orders?.length === 0 ? (
            <div className="sd-empty">
              <div className="sd-empty-icon">📋</div>
              <h2>No Orders Found</h2>
              <p>There are no orders to manage at this time.</p>
            </div>
          ) : (
            <div className="sd-order-list">
              {orders?.map((order) => (
                <div
                  key={order.orderId}
                  className="sd-order-card"
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
                  <div className="sd-card-header">
                    <span className="sd-card-id">Order #{order.orderId}</span>
                    <span className={`sd-badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status || 'UNKNOWN'}
                    </span>
                  </div>

                  <div className="sd-card-body">
                    <div className="sd-card-row">
                      <span className="sd-card-label">Customer</span>
                      <span className="sd-card-value">{order.fullName || 'N/A'}</span>
                    </div>
                    <div className="sd-card-row">
                      <span className="sd-card-label">Date</span>
                      <span className="sd-card-value">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="sd-card-row">
                      <span className="sd-card-label">Total</span>
                      <span className="sd-card-value sd-card-total">
                        {order.totalPrice != null ? formatCurrency(order.totalPrice) : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="sd-card-footer">
                    {renderActionButton(order)}
                    <span className="sd-card-detail-link">View Details &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="sd-footer">
        <Footer />
      </footer>
    </div>
  );
}
