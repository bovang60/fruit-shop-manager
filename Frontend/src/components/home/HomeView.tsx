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

          {/* Modern Hero Slider Section */}
          {sliders && sliders.length > 0 ? (
            <section className="hero-slider-section" style={{ position: 'relative', overflow: 'hidden', height: '450px', borderRadius: '1.25rem', marginBottom: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div className="slider-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
                <div
                  className="slider-track"
                  style={{
                    display: 'flex',
                    height: '100%',
                    transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                    transform: `translateX(-${currentSlide * 100}%)`,
                  }}
                >
                  {sliders.map((s) => (
                    <div key={s.sliderId} className="slide-item" style={{ flex: '0 0 100%', width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div
                        className="slide-image"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundImage: `url('${s.imageUrl}')`,
                          zIndex: 0
                        }}
                      />
                      {/* Subtle overlay */}
                      <div className="slide-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.25)', zIndex: 1 }}></div>

                      <div className="slide-content" style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', maxWidth: '90%', minWidth: '350px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#33f20d', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', display: 'inline-block' }}>
                          {s.description || 'Sản phẩm hữu cơ 100%'}
                        </span>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, color: '#121811', margin: '0 0 1.5rem 0', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                          {s.title}
                        </h2>
                        <button
                          className="slider-shop-btn"
                          style={{ background: '#33f20d', color: 'white', border: 'none', padding: '1rem 3rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 15px rgba(51, 242, 13, 0.3)', transition: 'transform 0.2s, background 0.2s', textTransform: 'uppercase' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#2dd60c'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#33f20d'; e.currentTarget.style.transform = 'scale(1)'; }}
                          onClick={onNavigateToProducts}
                        >
                          Shop Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {sliders.length > 1 && (
                  <>
                    <button className="slider-btn prev-btn" onClick={goToPrev} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255, 255, 255, 0.9)', border: 'none', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '50%', zIndex: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', color: '#121811', transition: 'all 0.2s', padding: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>chevron_left</span>
                    </button>
                    <button className="slider-btn next-btn" onClick={goToNext} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255, 255, 255, 0.9)', border: 'none', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '50%', zIndex: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', color: '#121811', transition: 'all 0.2s', padding: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>chevron_right</span>
                    </button>
                    <div className="slider-dots" style={{ position: 'absolute', bottom: '25px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
                      {sliders.map((_, idx) => (
                        <button
                          key={idx}
                          className={`slider-dot ${idx === currentSlide ? "active" : ""}`}
                          onClick={() => setCurrentSlide(idx)}
                          style={{
                            width: idx === currentSlide ? '32px' : '10px',
                            height: '10px',
                            borderRadius: '5px',
                            border: 'none',
                            background: idx === currentSlide ? '#33f20d' : 'rgba(255, 255, 255, 0.7)',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>
          ) : (
            <section className="hero-section" style={{ height: '400px', borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem' }}>
              <div className="hero-card" style={{ height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div
                  className="hero-media"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCFCm8K1-HBJRkiSZngFZ3YUb-HZ_amf6XG129H3zSmLTiErFvU9OnPfx_ZF2bS1rDAQeqGUITTO16Gx403xgZCakx-ifQ2h113IX5EYPZ65sX61UHotDPjtbZeEXdK0iymWZARd-c6HAhWl6UjLiXL4CxkYfqHCoruFs7niJrgdp_5Uq81Gc2uBHSCCb0FRuYUs6E74BbOhBEvlKOnSQgv3bo6WgGRmX-6X9DZR2_1078e1__gH_OIrTG2aahw1wkutLw3gSxCfIs")', position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center' }}
                ></div>
                <div className="hero-content" style={{ position: 'relative', zIndex: 2, background: 'rgba(255,255,255,0.9)', padding: '2.5rem', borderRadius: '1rem', textAlign: 'center' }}>
                  <h1 style={{ margin: '0 0 1rem 0' }}>Tropical Fruits Market</h1>
                  <p style={{ margin: '0 0 1.5rem 0' }}>Fresh from carefully curated local gardens</p>
                  <button
                    className="primary-btn"
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.8rem 2rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                    onClick={onNavigateToProducts}
                  >
                    Shop Now
                  </button>
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
                        <div className="product-shop-name" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>storefront</span>
                          {p.shopName || "Cửa hàng trái cây"}
                        </div>
                        {/* <p className="product-desc">Giao Trong Ngày</p> */}
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
                        <div className="product-shop-name" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>storefront</span>
                          {p.shopName || "Cửa hàng trái cây"}
                        </div>
                        {/* <p className="product-desc">Ăn liền · 2 trái</p> */}
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
          {/* <section className="newsletter-section">
             <div className="newsletter-content">
                <h3>Get 10% Off Your First Order</h3>
                <p>Subscribe to our newsletter for fresh arrival updates and exclusive seasonal offers.</p>
             </div>
             <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" className="newsletter-input" />
                <button className="newsletter-btn">Subscribe</button>
             </div>
          </section> */}

        </div>
      </main>

      <Footer />
    </div>
  );
}
