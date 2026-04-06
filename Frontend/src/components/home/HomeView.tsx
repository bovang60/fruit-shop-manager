import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Product, HomeCategory } from "./Home.types.ts";
import type { SliderDto } from "../../services/sliderService.ts";
import Header from "../common/header/Header";
import Footer from "../common/footer/Footer";
import "./Home.css";

export interface Props {
  sliders: SliderDto[];
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
  onNavigateToProducts,
  sliders
}: Props) {
  const navigate = useNavigate();

  // Hero slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNext = useCallback(() => {
    if (sliders.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }
  }, [sliders.length]);

  const goToPrev = () => {
    if (sliders.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
    }
  };

  useEffect(() => {
    if (sliders.length <= 1) return;
    const timer = setInterval(goToNext, 4000);
    return () => clearInterval(timer);
  }, [sliders.length, goToNext]);

  return (
    <div className="home-root">
      <Header />

      <main className="home-page-wrapper">
        <div className="freshfruit-container">
          
          {/* Hero Section */}
          {/* Hero Section */}
          {sliders && sliders.length > 0 ? (
            <section className="hero-section hero-slider-section" style={{ position: 'relative', overflow: 'hidden', borderRadius: '1rem', marginBottom: '2rem', height: '400px' }}>
              <div className="slider-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
                <div
                  className="slider-track"
                  style={{
                    display: 'flex',
                    height: '100%',
                    transition: 'transform 0.5s ease-in-out',
                    transform: `translateX(-${currentSlide * 100}%)`,
                  }}
                >
                  {sliders.map((s) => (
                    <div key={s.sliderId} className="hero-card" style={{ minWidth: '100%', height: '100%', position: 'relative', display: 'flex', padding: '0', background: 'none' }}>
                       <div 
                         className="hero-media" 
                         style={{ backgroundImage: `url('${s.imageUrl}')`, width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
                       ></div>
                       <div className="hero-content" style={{ zIndex: 1, position: 'relative', padding: '3rem', width: '100%' }}>
                         <div>
                             {s.description && (
                               <span className="premium-label">{s.description}</span>
                             )}
                             {!s.description && (
                               <span className="premium-label">Premium Selection</span>
                             )}
                             <h1>
                              {s.title}
                             </h1>
                         </div>
                         <div className="hero-actions">
                           <button className="primary-btn" onClick={onNavigateToProducts}>Shop Now</button>
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
                {sliders.length > 1 && (
                  <>
                    <button className="nav-btn" onClick={goToPrev} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: 'rgba(255, 255, 255, 0.8)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button className="nav-btn" onClick={goToNext} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: 'rgba(255, 255, 255, 0.8)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                    <div className="slider-dots" style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 2 }}>
                      {sliders.map((_, idx) => (
                        <button
                          key={idx}
                          className={idx === currentSlide ? "active" : ""}
                          onClick={() => setCurrentSlide(idx)}
                          style={{ 
                            width: idx === currentSlide ? '24px' : '8px', 
                            height: '8px', 
                            borderRadius: '4px', 
                            border: 'none', 
                            background: idx === currentSlide ? '#10b981' : 'rgba(255, 255, 255, 0.6)', 
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>
          ) : (
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
          )}

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
