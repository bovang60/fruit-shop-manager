import { useNavigate } from "react-router-dom";
import type { Product, HomeCategory } from "./Home.types.ts";
import Header from "../common/header/Header";
import Footer from "../common/footer/Footer";
import "./Home.css";

export interface Props {
  products: Product[];
  trending: Product[];
  newArrivals: Product[];
  newArrivalsIndex: number;
  onNewArrivalsNext: () => void;
  onNewArrivalsPrev: () => void;
  trendingIndex: number;
  onTrendingNext: () => void;
  onTrendingPrev: () => void;
  categories: HomeCategory[];
  error: string;
  onAddToCart: (productId: number) => void;
  onToggleWishlist: (productId: number, isFavorite: boolean) => void;
  addingToCartId?: number | null;
  onNavigateToProducts: () => void;
  onNavigateToHome: () => void;
}

export default function HomeView({
  trending,
  newArrivals,
  newArrivalsIndex,
  onNewArrivalsNext,
  onNewArrivalsPrev,
  trendingIndex,
  onTrendingNext,
  onTrendingPrev,
  onAddToCart,
  onToggleWishlist,
  addingToCartId,
  onNavigateToProducts
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="home-root">
      <Header />

      <main className="home-page-wrapper">
        <div className="freshfruit-container">
          
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-card">
              <div 
                  className="hero-media" 
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCFCm8K1-HBJRkiSZngFZ3YUb-HZ_amf6XG129H3zSmLTiErFvU9OnPfx_ZF2bS1rDAQeqGUITTO16Gx403xgZCakx-ifQ2h113IX5EYPZ65sX61UHotDPjtbZeEXdK0iymWZARd-c6HAhWl6UjLiXL4CxkYfqHCoruFs7niJrgdp_5Uq81Gc2uBHSCCb0FRuYUs6E74BbOhBEvlKOnSQgv3bo6WgGRmX-6X9DZR2_1078e1__gH_OIrTG2aahw1wkutLw3gSxCfIs")' }}
              ></div>
              <div className="hero-content">
                <div>
                    <span className="premium-label">Premium Selection</span>
                    <h1>
                    Nature’s Finest, Delivered <span className="text-primary-inline">Fresh</span> to Your Door.
                    </h1>
                    <p>
                    Hand-picked premium fruits sourced directly from local organic farms. Join our network of growers or shop the finest harvest.
                    </p>
                </div>
                <div className="hero-actions">
                  <button className="primary-btn" onClick={onNavigateToProducts}>Shop Now</button>
                  <button className="outline-btn">Registration to Seller</button>
                </div>
                <div className="hero-features">
                  <div className="feature-item">
                    <span className="material-symbols-outlined text-primary-inline" style={{ fontSize: '1.25rem' }}>local_shipping</span>
                    <span className="feature-text">Same Day</span>
                  </div>
                  <div className="feature-item">
                    <span className="material-symbols-outlined text-primary-inline" style={{ fontSize: '1.25rem' }}>eco</span>
                    <span className="feature-text">100% Organic</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* New Arrivals */}
          <section className="new-arrivals-section" style={{ marginBottom: '3rem' }}>
            <div className="section-header">
              <div className="title-group">
                <h2 className="section-title">Sản Phẩm Mới</h2>
                <span className="badge-hot" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '0.75rem' }}>fiber_new</span>
                  Mới Nhất
                </span>
              </div>
              <div className="nav-buttons">
                <button 
                  className="nav-btn" 
                  onClick={onNewArrivalsPrev} 
                  disabled={newArrivalsIndex === 0}
                  style={newArrivalsIndex === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button 
                  className="nav-btn" 
                  onClick={onNewArrivalsNext} 
                  disabled={newArrivalsIndex + 5 >= Math.max(newArrivals.length, 5)}
                  style={newArrivalsIndex + 5 >= Math.max(newArrivals.length, 5) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
            
            <div className="products-grid trending-grid">
              {newArrivals.slice(newArrivalsIndex, newArrivalsIndex + 5).map(p => (
                <div 
                  key={`new-${p.id}`} 
                  className="modern-product-card"
                  onClick={() => navigate(`/product/${p.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="product-image-wrap">
                    <div className="product-image" style={{ backgroundImage: `url(${p.img})` }}></div>
                    <button 
                       className={`product-favorite ${p.isFavorite ? 'active' : ''}`}
                       onClick={(e) => { e.stopPropagation(); onToggleWishlist(p.id, !!p.isFavorite); }}
                       aria-label={p.isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                    >
                       <span className="material-symbols-outlined" style={{ fontVariationSettings: p.isFavorite ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                    </button>
                    {p.tag && <div className={p.tag === 'SALE' ? "product-tag tag-sale" : "product-tag"}>{p.tag}</div>}
                  </div>
                  <div className="product-info">
                    <div className="product-details">
                      <div>
                        <p className="product-name-modern">{p.name}</p>
                        <p className="product-desc">Giao Trong Ngày</p>
                      </div>
                      <p className="product-price-modern">{p.price}</p>
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(p.id);
                      }}
                      disabled={addingToCartId === p.id}
                    >
                      {addingToCartId === p.id
                        ? "✉️ Đang thêm..."
                        : "🛒 Thêm vào giỏ"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trending Now */}
          <section className="trending-section">
            <div className="section-header">
              <div className="title-group">
                <h2 className="section-title">Đang Thịnh Hành</h2>
                <span className="badge-hot">
                  <span className="material-symbols-outlined" style={{ fontSize: '0.75rem' }}>trending_up</span>
                  Bán Chạy
                </span>
              </div>
              <div className="nav-buttons">
                <button 
                  className="nav-btn" 
                  onClick={onTrendingPrev} 
                  disabled={trendingIndex === 0}
                  style={trendingIndex === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button 
                  className="nav-btn" 
                  onClick={onTrendingNext} 
                  disabled={trendingIndex + 5 >= Math.max(trending.length, 5)}
                  style={trendingIndex + 5 >= Math.max(trending.length, 5) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
            
            <div className="products-grid trending-grid">
              {trending.slice(trendingIndex, trendingIndex + 5).map(p => (
                <div 
                  key={`trend-${p.id}`} 
                  className="modern-product-card"
                  onClick={() => navigate(`/product/${p.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="product-image-wrap">
                    <div className="product-image" style={{ backgroundImage: `url(${p.img})` }}></div>
                    <button 
                       className={`product-favorite ${p.isFavorite ? 'active' : ''}`}
                       onClick={(e) => { e.stopPropagation(); onToggleWishlist(p.id, !!p.isFavorite); }}
                       aria-label={p.isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                    >
                       <span className="material-symbols-outlined" style={{ fontVariationSettings: p.isFavorite ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                    </button>
                    <div className="product-tag">
                      <span className="material-symbols-outlined" style={{ fontSize: '0.7rem' }}>local_fire_department</span>
                      Đang Hot
                    </div>
                  </div>
                  <div className="product-info">
                    <div className="product-details">
                      <div>
                        <p className="product-name-modern">{p.name}</p>
                        <p className="product-desc">Ăn liền · 2 trái</p>
                      </div>
                      <p className="product-price-modern">{p.price}</p>
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(p.id);
                      }}
                      disabled={addingToCartId === p.id}
                    >
                      {addingToCartId === p.id
                        ? "✉️ Đang thêm..."
                        : "🛒 Thêm vào giỏ"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Newsletter Section */}
          <section className="newsletter-section">
             <div className="newsletter-content">
                <h3>Get 10% Off Your First Order</h3>
                <p>Subscribe to our newsletter for fresh arrival updates and exclusive seasonal offers.</p>
             </div>
             <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" className="newsletter-input" />
                <button className="newsletter-btn">Subscribe</button>
             </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
