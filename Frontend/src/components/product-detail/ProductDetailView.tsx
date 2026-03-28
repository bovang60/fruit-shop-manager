import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/header/Header';
import Footer from '../common/footer/Footer';
import LoadingModal from '../common/loading/LoadingModal';
import type { ProductDetailDto, ProductSummaryDto } from '../../services/productService';
import type { FeedbackDto } from '../../services/feedbackService';
import './ProductDetail.css';

export type ProductDetailViewProps = {
  product: ProductDetailDto | null;
  relatedProducts: ProductSummaryDto[];
  feedbacks: FeedbackDto[];
  loading: boolean;
  error: string;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  addingToCart: boolean;
};

export default function ProductDetailView({
  product,
  relatedProducts,
  feedbacks,
  loading,
  error,
  quantity,
  onQuantityChange,
  onAddToCart,
  addingToCart
}: ProductDetailViewProps) {
  const navigate = useNavigate();

  // Helper function to format price
  const formatPrice = (price?: number | null) => {
    if (price === undefined || price === null) return 'Liên hệ';
    return `₫${price.toLocaleString('vi-VN')}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const currentStock = product?.stock ?? 0;

  const handleIncrease = () => {
    if (product && quantity < currentStock) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleManualQtyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      if (val < 1) onQuantityChange(1);
      else if (product && val > currentStock) onQuantityChange(currentStock);
      else onQuantityChange(val);
    } else {
      onQuantityChange(1); // fallback
    }
  };

  return (
    <div className="product-detail-root">
      <Header />
      
      <main className="product-detail-main">
        {error ? (
          <div className="error-state" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2>{error}</h2>
            <button 
              className="add-to-cart-btn-large" 
              style={{ padding: '0 2rem', marginTop: '1rem', width: 'auto', display: 'inline-block' }}
              onClick={() => navigate('/home')}
            >
              Về trang chủ
            </button>
          </div>
        ) : product ? (
          <>
            <div className="product-detail-content">
              {/* Left Column: Image */}
              <div className="product-detail-left">
                <div className="product-detail-image-wrap">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name ?? "Product Image"} />
                  ) : (
                     <div className="product-detail-image-placeholder">🍊</div>
                  )}
                </div>
              </div>

              {/* Right Column: Info */}
              <div className="product-detail-right">
                <h1 className="product-detail-name">{product.name ?? "Sản phẩm không có tên"}</h1>
                
                <div className="product-detail-meta">
                  {(product.rating !== null && product.rating !== undefined) && (
                    <span className="product-detail-rating">
                      ★ {(product.rating ?? 0).toFixed(1)}
                    </span>
                  )}
                  {product.reviewCount !== null && product.reviewCount !== undefined && (
                    <span className="product-detail-reviews">| {product.reviewCount ?? 0} đánh giá</span>
                  )}
                  <span className="product-detail-shop">Cửa hàng: {product.shopName || "Quản trị viên"}</span>
                  <span className="product-detail-category">Danh mục: {product.categoryName || "Chưa phân loại"}</span>
                </div>

                <div className="product-detail-price">
                  {formatPrice(product.price)}
                </div>

                <div className="product-detail-desc">
                  {product.description || "Chưa có mô tả cho sản phẩm này."}
                </div>

                <div className="product-detail-actions-wrap">
                  <div className="product-detail-stock">
                    Còn {currentStock} sản phẩm
                  </div>
                  
                  <div className="product-detail-actions">
                    <div className="quantity-selector">
                      <button 
                        className="qty-btn" 
                        onClick={handleDecrease}
                        disabled={quantity <= 1 || addingToCart}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        value={quantity.toString()}
                        onChange={handleManualQtyChange}
                        className="qty-input"
                        min="1"
                        max={currentStock}
                        disabled={addingToCart}
                      />
                      <button 
                        className="qty-btn" 
                        onClick={handleIncrease}
                        disabled={quantity >= currentStock || addingToCart}
                      >
                        +
                      </button>
                    </div>

                    <button 
                      className="add-to-cart-btn-large"
                      onClick={onAddToCart}
                      disabled={addingToCart || currentStock === 0}
                    >
                      {addingToCart ? "Đang thêm..." : "🛒 Thêm vào giỏ hàng"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="product-detail-feedback-section">
              <h2 className="feedback-section-title">Đánh giá sản phẩm ({feedbacks.length} đánh giá)</h2>
              {feedbacks.length === 0 ? (
                <p className="no-feedback-text">Chưa có đánh giá nào cho sản phẩm này.</p>
              ) : (
                <div className="feedback-list">
                  {feedbacks.map(fb => (
                    <div key={fb.feedbackId} className="feedback-item">
                      <div className="feedback-item-header">
                        <span className="feedback-stars">
                          {'★'.repeat(fb.rating || 0)}{'☆'.repeat(5 - (fb.rating || 0))}
                        </span>
                        <span className="feedback-user">{fb.userName}</span>
                        <span className="feedback-date">{formatDate(fb.createdAt)}</span>
                      </div>
                      <div className="feedback-comment">"{fb.comment}"</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Related Products Section */}
            {relatedProducts && relatedProducts.length > 0 && (
              <div className="product-detail-related">
                <h2 className="related-title">Sản phẩm tương tự</h2>
                <div className="related-scroll-wrap">
                  {relatedProducts.map(rp => (
                    <div 
                      key={rp.productId} 
                      className="related-card"
                      onClick={() => {
                        navigate(`/product/${rp.productId}`);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <div 
                        className="related-image" 
                        style={{ backgroundImage: rp.imageUrl ? `url('${rp.imageUrl}')` : 'none' }}
                      />
                      <div className="related-info">
                        <p className="related-name" title={rp.name ?? "Sản phẩm"}>{rp.name ?? "Tên sản phẩm"}</p>
                        <p className="related-price">{formatPrice(rp.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : !loading ? (
          <div className="error-state" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2>Không tìm thấy sản phẩm</h2>
            <button 
              className="add-to-cart-btn-large" 
              style={{ padding: '0 2rem', marginTop: '1rem', width: 'auto', display: 'inline-block' }}
              onClick={() => navigate('/home')}
            >
              Về trang chủ
            </button>
          </div>
        ) : null}
      </main>

      <Footer />

      <LoadingModal
        isOpen={loading && !product} // Show modal primarily for initial load
        message="Đang tải dữ liệu..."
        subMessage="Vui lòng chờ trong giây lát"
        theme="green"
      />
    </div>
  );
}
