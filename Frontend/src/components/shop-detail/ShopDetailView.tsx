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
};

export default function ShopDetailView({ shop, products, loading, error }: ShopDetailViewProps) {
  const navigate = useNavigate();

  // Avatar letter fallback
  const avatarLetter = shop?.shopName ? shop.shopName.charAt(0).toUpperCase() : 'S';

  const formatCurrency = (price?: number) => {
    if (price === undefined || price === null) return 'Liên hệ';
    return `₫${price.toLocaleString('vi-VN')}`;
  };

  return (
    <div className="shop-detail-root">
      <Header />
      
      <main className="shop-detail-main">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Đang tải thông tin cá nhân...</div>
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
                <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                  {products.map((product) => (
                    <div 
                      key={product.productId} 
                      className="product-card" 
                      onClick={() => navigate(`/product/${product.productId}`)}
                      style={{ background: 'white', borderRadius: '8px', padding: '1rem', cursor: 'pointer', border: '1px solid #efefef', transition: 'box-shadow 0.2s', display: 'flex', flexDirection: 'column' }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }} 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/180x180?text=No+Image'; // Fallback
                        }}
                      />
                      <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0', fontWeight: 600, flex: 1 }}>{product.name}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--brand-green)', fontWeight: 700, fontSize: '1.1rem' }}>
                          {formatCurrency(product.price)}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#888' }}>
                          Đã bán {product.soldCount ?? 0}
                        </span>
                      </div>
                    </div>
                  ))}
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
