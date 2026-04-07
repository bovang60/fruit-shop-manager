import { useNavigate } from 'react-router-dom';
import Header from '../common/header/Header';
import Footer from '../common/footer/Footer';
import type { ShopDto } from '../../services/shopService';
import type { ProductSummaryDto } from '../../services/productService';
import './ShopDetail.css';

export type ShopDetailViewProps = {
  shop: ShopDto | null;
  products: ProductSummaryDto[];
  loading: boolean;
  error: string;
  wishlistIds: number[];
  addingToCartId: number | null;
  onAddToCart: (productId: number) => void;
  onToggleWishlist: (productId: number, isFavorite: boolean) => void;
};

export default function ShopDetailView({ 
  shop, 
  products, 
  loading, 
  error,
  wishlistIds,
  addingToCartId,
  onAddToCart,
  onToggleWishlist
}: ShopDetailViewProps) {
  const navigate = useNavigate();

  const avatarLetter = shop?.shopName ? shop.shopName.charAt(0).toUpperCase() : 'S';

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '₫0';
    return `₫${value.toLocaleString('vi-VN')}`;
  };

  return (
    <div className="shop-detail-root">
      <Header />

      <main className="shop-detail-main">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Đang tải thông tin cửa hàng...</div>
        ) : error ? (
          <div className="shop-empty-state">
            <h2>{error}</h2>
            <button
              className="add-to-cart-btn-large"
              style={{ padding: '0 2rem', marginTop: '1rem', width: 'auto', display: 'inline-block' }}
              onClick={() => navigate('/home')}
            >
              Về trang chủ
            </button>
          </div>
        ) : shop ? (
          <>
            {/* Shop Profile Banner */}
            <div className="shop-banner-card">
              <div className="shop-banner-bg" />
              <div className="shop-banner-content">
                <div className="shop-avatar-wrapper">
                  <div className="shop-avatar">{avatarLetter}</div>
                </div>

                <div className="shop-info-main">
                  <div className="shop-name-row">
                    <h1 className="shop-name">{shop.shopName}</h1>
                    <span className="shop-badge">✓ Cửa hàng uy tín</span>
                  </div>
                  <p className="shop-description">{shop.description || 'Cửa hàng này chưa cập nhật mô tả.'}</p>
                </div>

                <div className="shop-stats">
                  <div className="stat-item">
                    <span className="stat-value">{shop.totalProducts ?? products.length}</span>
                    <span className="stat-label">Sản phẩm</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{shop.totalOrders ?? '0'}</span>
                    <span className="stat-label">Lượt bán</span>
                  </div>
                </div>
              </div>

              <div className="shop-address-bar">
                <i>📍</i> Địa chỉ xuất phát: {shop.pickupAddress || shop.address || 'Đang cập nhật'}
              </div>
            </div>

            {/* Shop's Products */}
            <div className="shop-products-section">
              <h2 className="shop-section-title">Sản phẩm của cửa hàng</h2>

              {products.length === 0 ? (
                <div className="shop-empty-state">
                  <h3>Cửa hàng chưa có sản phẩm nào</h3>
                  <p>Hãy quay lại sau nhé!</p>
                </div>
              ) : (
                <div className="modern-products-grid-5">
                  {products.map((product) => {
                    const isFavorite = wishlistIds.includes(product.productId);
                    return (
                      <div
                        key={product.productId}
                        className="modern-product-card"
                        onClick={() => navigate(`/product/${product.productId}`)}
                      >
                        <div className="product-image-wrap">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="product-image"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/180x180?text=No+Image';
                            }}
                          />
                          <button 
                             className={`product-favorite ${isFavorite ? 'active' : ''}`}
                             onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.productId, !!isFavorite); }}
                          >
                             <span className="material-symbols-outlined" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                          </button>
                        </div>
                        <div className="product-info-simple">
                           <h3 className="product-name-simple">{product.name}</h3>
                           <div className="product-price-row">
                              <span className="product-price-simple">
                                 {formatCurrency(product.price)}
                              </span>
                              <span className="product-sold-simple">
                                 Đã bán {product.soldCount ?? 0}
                              </span>
                           </div>
                           <button
                             className="add-to-cart-btn-simple"
                             onClick={(e) => {
                               e.stopPropagation();
                               onAddToCart(product.productId);
                             }}
                             disabled={addingToCartId === product.productId}
                           >
                             {addingToCartId === product.productId ? "..." : "Thêm vào giỏ"}
                           </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
