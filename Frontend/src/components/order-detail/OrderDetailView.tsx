import Header from '../common/header/Header';
import Footer from '../common/footer/Footer';
import type { OrderDto } from '../../services/orderService';
import './OrderDetail.css';

export interface OrderDetailViewProps {
  order: OrderDto | null;
  loading: boolean;
  actionLoading: boolean;
  onCancelOrder: () => void;
  onCompleteOrder: () => void;
}

export default function OrderDetailView({
  order,
  loading,
  actionLoading,
  onCancelOrder,
  onCompleteOrder,
}: OrderDetailViewProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status?.toUpperCase() || '';
    if (s === 'PENDING') return 'od-badge--pending';
    if (s === 'PROCESSING') return 'od-badge--processing';
    if (s === 'SHIPPING' || s === 'DELIVERED') return 'od-badge--shipping';
    if (s === 'COMPLETED') return 'od-badge--completed';
    if (s === 'CANCELLED') return 'od-badge--cancelled';
    return '';
  };

  const canCancel = (status: string) => {
    const s = status?.toUpperCase() || '';
    return s === 'PENDING' || s === 'PROCESSING';
  };

  const canComplete = (status: string) => {
    const s = status?.toUpperCase() || '';
    return s === 'SHIPPING' || s === 'DELIVERED';
  };

  return (
    <div className="od-root">
      <header className="od-header">
        <Header />
      </header>

      <main className="od-main">
        <section className="od-container">
          {loading ? (
            <div className="od-loading">
              <div className="od-spinner"></div>
              <p>Loading order details...</p>
            </div>
          ) : !order ? (
            <div className="od-not-found">
              <div className="od-not-found-icon">🔍</div>
              <h2>Order Not Found</h2>
              <p>The order you are looking for does not exist or has been removed.</p>
            </div>
          ) : (
            <div className="od-content">
              {/* Order Header */}
              <div className="od-title-row">
                <h1 className="od-title">Order #{order.orderId}</h1>
                <span className={`od-badge ${getStatusBadgeClass(order.status)}`}>
                  {order.status || 'UNKNOWN'}
                </span>
              </div>

              {/* Order Info */}
              <div className="od-info-card">
                <h2 className="od-section-title">Order Information</h2>
                <div className="od-info-grid">
                  <div className="od-info-item">
                    <span className="od-info-label">Order Date</span>
                    <span className="od-info-value">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="od-info-item">
                    <span className="od-info-label">Customer</span>
                    <span className="od-info-value">{order.fullName || 'N/A'}</span>
                  </div>
                  <div className="od-info-item">
                    <span className="od-info-label">Address</span>
                    <span className="od-info-value">{order.address || 'N/A'}</span>
                  </div>
                  <div className="od-info-item">
                    <span className="od-info-label">Phone</span>
                    <span className="od-info-value">{order.phone || 'N/A'}</span>
                  </div>
                  {order.paymentMethod && (
                    <div className="od-info-item">
                      <span className="od-info-label">Payment</span>
                      <span className="od-info-value">{order.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="od-items-card">
                <h2 className="od-section-title">Order Items</h2>
                {order.items?.length === 0 || !order.items ? (
                  <p className="od-no-items">No items in this order</p>
                ) : (
                  <div className="od-items-list">
                    <div className="od-items-table-header">
                      <span className="od-col-product">Product</span>
                      <span className="od-col-qty">Qty</span>
                      <span className="od-col-price">Price</span>
                      <span className="od-col-subtotal">Subtotal</span>
                    </div>
                    {order.items?.map((item) => (
                      <div key={item.orderItemId} className="od-item-row">
                        <span className="od-col-product">{item.productName}</span>
                        <span className="od-col-qty">{item.quantity}</span>
                        <span className="od-col-price">{formatCurrency(item.price)}</span>
                        <span className="od-col-subtotal">{formatCurrency(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="od-summary-card">
                {order.shippingFee != null && (
                  <div className="od-summary-row">
                    <span className="od-summary-label">Shipping Fee</span>
                    <span className="od-summary-value">{formatCurrency(order.shippingFee)}</span>
                  </div>
                )}
                <div className="od-summary-row od-summary-total">
                  <span className="od-summary-label">Total</span>
                  <span className="od-summary-value">
                    {order.totalPrice != null ? formatCurrency(order.totalPrice) : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {(canCancel(order.status) || canComplete(order.status)) && (
                <div className="od-actions">
                  {canCancel(order.status) && (
                    <button
                      id="od-btn-cancel"
                      type="button"
                      className="od-btn od-btn-cancel"
                      onClick={onCancelOrder}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Processing...' : 'Cancel Order'}
                    </button>
                  )}
                  {canComplete(order.status) && (
                    <button
                      id="od-btn-complete"
                      type="button"
                      className="od-btn od-btn-complete"
                      onClick={onCompleteOrder}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Processing...' : 'Mark as Completed'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="od-footer">
        <Footer />
      </footer>
    </div>
  );
}
