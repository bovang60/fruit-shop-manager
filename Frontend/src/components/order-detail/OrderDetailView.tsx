import { useState, useEffect } from 'react';
import Header from '../common/header/Header';
import Footer from '../common/footer/Footer';
import LoadingModal from '../common/loading/LoadingModal';
import type { OrderDto } from '../../services/orderService';
import type { FeedbackDto } from '../../services/feedbackService';
import { usePopup } from '../common/popup';
import './OrderDetail.css';

export interface OrderDetailViewProps {
  order: OrderDto | null;
  loading: boolean;
  actionLoading: boolean;
  feedbacks: Record<number, FeedbackDto>;
  onCancelOrder: () => void;
  onCompleteOrder: () => void;
  onFeedbackSubmit: (productId: number, rating: number, comment: string, existingId?: number) => void;
}

// Inline component for the Feedback form
function FeedbackSection({ 
  productId, 
  existingFeedback, 
  onSubmit 
}: { 
  productId: number; 
  existingFeedback?: FeedbackDto; 
  onSubmit: (productId: number, rating: number, comment: string, existingId?: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(existingFeedback?.rating || 0);
  const [comment, setComment] = useState(existingFeedback?.comment || '');
  const { showError } = usePopup();

  useEffect(() => {
    // Sync external feedback updates (like after submit)
    if (existingFeedback && !isEditing) {
       setRating(existingFeedback.rating);
       setComment(existingFeedback.comment);
    }
  }, [existingFeedback, isEditing]);

  const handleSubmit = () => {
    if (rating < 1 || rating > 5) {
      showError("Vui lòng chọn đánh giá từ 1 đến 5 sao", "Lỗi");
      return;
    }
    onSubmit(productId, rating, comment, existingFeedback?.feedbackId);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setRating(existingFeedback?.rating || 0);
    setComment(existingFeedback?.comment || '');
  };

  if (existingFeedback && !isEditing) {
    return (
      <div className="feedback-display-box">
        <div className="feedback-stars">
           {'★'.repeat(existingFeedback.rating || 0)}{'☆'.repeat(5 - (existingFeedback.rating || 0))}
        </div>
        <div className="feedback-comment">"{existingFeedback.comment}"</div>
        <button className="feedback-btn-edit" onClick={() => setIsEditing(true)}>Sửa đánh giá</button>
      </div>
    );
  }

  if (!existingFeedback && !isEditing) {
    return (
      <div className="feedback-display-box">
        <button className="feedback-btn-write" onClick={() => setIsEditing(true)}>⭐ Viết đánh giá</button>
      </div>
    );
  }

  return (
    <div className="feedback-form-box">
      <div className="feedback-stars-selector">
         Đánh giá: 
         {[1,2,3,4,5].map(star => (
            <span 
              key={star} 
              className={star <= rating ? "star-active" : "star-inactive"}
              onClick={() => setRating(star)}
              style={{ cursor: 'pointer', fontSize: '1.5rem', marginLeft: '0.2rem' }}
            >
              {star <= rating ? '★' : '☆'}
            </span>
         ))}
      </div>
      <textarea 
        className="feedback-textarea" 
        placeholder="Nhận xét của bạn..." 
        value={comment} 
        onChange={e => setComment(e.target.value)}
      />
      <div className="feedback-form-actions">
         <button className="feedback-btn-submit" onClick={handleSubmit}>Gửi đánh giá</button>
         <button className="feedback-btn-cancel" onClick={handleCancel}>Hủy</button>
      </div>
    </div>
  );
}

export default function OrderDetailView({
  order,
  loading,
  actionLoading,
  feedbacks,
  onCancelOrder,
  onCompleteOrder,
  onFeedbackSubmit,
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
    // DELIVERED indicates it has arrived, user can mark it as COMPLETED to confirm closure.
    // Or we consider DELIVERED as already completed state. Wait, the original code had:
    const s = status?.toUpperCase() || '';
    return s === 'SHIPPING' || s === 'DELIVERED';
  };

  const isDelivered = order?.status?.toUpperCase() === 'DELIVERED' || order?.status?.toUpperCase() === 'COMPLETED';

  return (
    <div className="od-root">
      <header className="od-header">
        <Header />
      </header>

      <main className="od-main">
        <section className="od-container">
          {!loading && !order ? (
            <div className="od-not-found">
              <div className="od-not-found-icon">🔍</div>
              <h2>Order Not Found</h2>
              <p>The order you are looking for does not exist or has been removed.</p>
            </div>
          ) : order && (
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
                      <div key={item.orderItemId} className="od-item-container">
                        <div className="od-item-row">
                          <span className="od-col-product">{item.productName}</span>
                          <span className="od-col-qty">{item.quantity}</span>
                          <span className="od-col-price">{formatCurrency(item.price)}</span>
                          <span className="od-col-subtotal">{formatCurrency(item.subtotal)}</span>
                        </div>
                        
                        {isDelivered && (
                          <div className="od-item-feedback-wrapper">
                            <FeedbackSection 
                               productId={item.productId}
                               existingFeedback={feedbacks[item.productId]}
                               onSubmit={onFeedbackSubmit}
                            />
                          </div>
                        )}
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

      {/* Loading Modal */}
      <LoadingModal
        isOpen={loading || actionLoading}
        message={actionLoading ? 'Đang xử lý...' : 'Đang tải đơn hàng...'}
        subMessage="Vui lòng chờ trong giây lát"
        theme="blue"
      />
    </div>
  );
}
