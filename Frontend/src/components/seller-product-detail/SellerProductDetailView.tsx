import type { FeedbackDto } from "../../services/feedbackService";
import type { ProductDetailDto } from "../../services/productService";
import LoadingModal from "../common/loading/LoadingModal";
import "./SellerProductDetail.css";

type SellerProductDetailViewProps = {
  product: ProductDetailDto | null;
  feedbacks: FeedbackDto[];
  loading: boolean;
  error: string;
  onBack: () => void;
};

const formatPrice = (price?: number | null): string => {
  if (price === undefined || price === null) return "Liên hệ";
  return `₫${price.toLocaleString("vi-VN")}`;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

export default function SellerProductDetailView({
  product,
  feedbacks,
  loading,
  error,
  onBack,
}: SellerProductDetailViewProps) {
  return (
    <>
      <div className="seller-page seller-product-detail-page">
        <div className="page-header-content">
          <div className="seller-product-detail-header">
            <div>
              <h1>Chi tiết sản phẩm</h1>
              <p>Xem thông tin chi tiết sản phẩm trong gian hàng của bạn.</p>
            </div>
            <button type="button" className="seller-secondary-btn" onClick={onBack}>
              Quay lại danh sách
            </button>
          </div>
        </div>

        {error ? (
          <section className="data-card seller-product-detail-card">
            <p className="seller-product-detail-error">{error}</p>
          </section>
        ) : product ? (
          <>
            <section className="data-card seller-product-detail-card seller-product-main">
              <div className="seller-product-image-wrap">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name ?? "Sản phẩm"} />
                ) : (
                  <div className="seller-product-image-placeholder">🍊</div>
                )}
              </div>

              <div className="seller-product-info">
                <h2>{product.name ?? "Sản phẩm không có tên"}</h2>
                <div className="seller-product-meta">
                  <span>#{product.productId}</span>
                  <span>Danh mục: {product.categoryName || "Chưa phân loại"}</span>
                  <span>Cửa hàng: {product.shopName || "N/A"}</span>
                </div>
                <div className="seller-product-price">{formatPrice(product.price)}</div>
                <p className="seller-product-description">
                  {product.description || "Chưa có mô tả cho sản phẩm này."}
                </p>
                <div className="seller-product-stats">
                  <span>Tồn kho: {product.stock ?? 0}</span>
                  <span>Đã bán: {product.soldCount ?? 0}</span>
                  <span>Đánh giá: {(product.rating ?? 0).toFixed(1)} / 5</span>
                  <span>Lượt đánh giá: {product.reviewCount ?? 0}</span>
                </div>
              </div>
            </section>

            <section className="data-card seller-product-detail-card">
              <h3>Đánh giá khách hàng ({feedbacks.length})</h3>
              {feedbacks.length === 0 ? (
                <p className="seller-empty-state">Chưa có đánh giá nào cho sản phẩm này.</p>
              ) : (
                <div className="seller-feedback-list">
                  {feedbacks.map((fb) => (
                    <div key={fb.feedbackId} className="seller-feedback-item">
                      <div className="seller-feedback-head">
                        <span className="seller-feedback-user">{fb.userName}</span>
                        <span className="seller-feedback-stars">
                          {"★".repeat(fb.rating || 0)}
                          {"☆".repeat(5 - (fb.rating || 0))}
                        </span>
                        <span className="seller-feedback-date">{formatDate(fb.createdAt)}</span>
                      </div>
                      <div className="seller-feedback-comment">"{fb.comment}"</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>

      <LoadingModal
        isOpen={loading}
        message="Đang tải chi tiết sản phẩm..."
        subMessage="Vui lòng chờ trong giây lát"
        theme="green"
      />
    </>
  );
}
