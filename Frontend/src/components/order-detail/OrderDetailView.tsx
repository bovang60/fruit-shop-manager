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
    return `₫${amount.toLocaleString('vi-VN')}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
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
    if (s === 'REJECTED') return 'od-badge--cancelled';
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
    <div className="od-root">
      <header className="od-header">
        <Header />
      </header>

      <main className="od-main">
        <section className="od-container">
          {!loading && !order ? (
            <div className="od-not-found">
              <div className="od-not-found-icon">🔍</div>
              <h2>Không tìm thấy đơn hàng</h2>
              <p>Đơn hàng bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            </div>
          ) : order && (
            <div className="od-content">
              {/* Order Header */}
              <div className="od-title-row">
                <h1 className="od-title">Đơn hàng #{order.orderId}</h1>
                <span className={`od-badge ${getStatusBadgeClass(order.status)}`}>
                  {translateStatus(order.status)}
                </span>
              </div>

              {/* Order Info */}
              <div className="od-info-card">
                <h2 className="od-section-title">Thông tin đơn hàng</h2>
                <div className="od-info-grid">
                  <div className="od-info-item">
                    <span className="od-info-label">Ngày đặt hàng</span>
                    <span className="od-info-value">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="od-info-item">
                    <span className="od-info-label">Khách hàng</span>
                    <span className="od-info-value">{order.fullName || 'N/A'}</span>
                  </div>
                  <div className="od-info-item">
                    <span className="od-info-label">Cửa hàng</span>
                    <span className="od-info-value">
                      {order.shopName || 'Quản trị viên'}
                      {order.shopId && (
                        <button 
                          className="od-btn-small" 
                          style={{ marginLeft: '10px', fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: 'var(--brand-green)', color: 'white', border: 'none', cursor: 'pointer' }}
                          onClick={() => {
                            window.location.href = `/home?shopId=${order.shopId}`;
                          }}
                        >
                          Xem Shop
                        </button>
                      )}
                    </span>
                  </div>
                  <div className="od-info-item">
                    <span className="od-info-label">Địa chỉ</span>
                    <span className="od-info-value">{order.address || 'N/A'}</span>
                  </div>
                  <div className="od-info-item">
                    <span className="od-info-label">Số điện thoại</span>
                    <span className="od-info-value">{order.phone || 'N/A'}</span>
                  </div>
                  {order.paymentMethod && (
                    <div className="od-info-item">
                      <span className="od-info-label">Thanh toán</span>
                      <span className="od-info-value">{order.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="od-items-card">
                <h2 className="od-section-title">Sản phẩm đơn hàng</h2>
                {order.items?.length === 0 || !order.items ? (
                  <p className="od-no-items">Không có sản phẩm trong đơn hàng này</p>
                ) : (
                  <div className="od-items-list">
                    <div className="od-items-table-header">
                      <span className="od-col-product">Sản phẩm</span>
                      <span className="od-col-qty">SL</span>
                      <span className="od-col-price">Đơn giá</span>
                      <span className="od-col-subtotal">Thành tiền</span>
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
                    <span className="od-summary-label">Phí vận chuyển</span>
                    <span className="od-summary-value">{formatCurrency(order.shippingFee)}</span>
                  </div>
                )}
                {order.discountValue != null && order.discountValue > 0 && (
                  <div className="od-summary-row">
                    <span className="od-summary-label">Giảm giá Voucher</span>
                    <span className="od-summary-value" style={{ color: '#e53935' }}>
                      -{formatCurrency(order.discountValue)}
                    </span>
                  </div>
                )}
                <div className="od-summary-row od-summary-total">
                  <span className="od-summary-label">Tổng cộng</span>
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
                      {actionLoading ? 'Đang xử lý...' : 'Hủy đơn hàng'}
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
                      {actionLoading ? 'Đang xử lý...' : 'Xác nhận hoàn thành'}
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
