import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Header from "../common/header/Header";
import Footer from "../common/footer/Footer";
import Pagination from "../common/pagination/Pagination";
import LoadingModal from "../common/loading/LoadingModal";
import type { HomeCategory } from "./Home.types";
import type { SliderDto } from "../../services/sliderService";
import "./Home.css";

type Product = {
  id: number;
  name: string;
  price: string;
  img?: string;
  desc?: string;
  tag?: string;
  isFavorite?: boolean;
};

export type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  products: Product[];
  displayed: Product[];
  newArrivals: Product[];
  trending: Product[];
  categories: HomeCategory[];
  sliders: SliderDto[];
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onAddToCart: (productId: number) => void;
  onToggleWishlist: (productId: number, isFavorite: boolean) => void;
  addingToCartId?: number | null;
  loading: boolean;
  error: string;
  // Filter values
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  origin?: string;
  organic?: boolean;
  sortBy: string;
  sortOrder: string;
  // Filter handlers
  onCategoryChange: (category: string) => void;
  onPriceChange: (minPrice: number, maxPrice: number) => void;
  onOriginChange: (origin: string | undefined) => void;
  onOrganicChange: (organic: boolean | undefined) => void;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  onSearchSubmit: () => void;
};

export default function HomeView({
  query,
  onQueryChange,
  displayed,
  newArrivals,
  trending,
  categories,
  sliders,
  page,
  totalPages,
  onPageChange,
  onAddToCart,
  onToggleWishlist,
  addingToCartId,
  loading,
  error,
  // Filter values
  category,
  minPrice = 0,
  maxPrice = 500000,
  sortBy,
  sortOrder,
  // Filter handlers
  onCategoryChange,
  onPriceChange,
  onSortChange,
  onSearchSubmit,
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

  // Auto-play every 4 seconds
  useEffect(() => {
    if (sliders.length <= 1) return;
    const timer = setInterval(goToNext, 4000);
    return () => clearInterval(timer);
  }, [sliders.length, goToNext]);

  return (
    <div className="home-root">
      {/* Sticky Header */}
      <div className="home-header-sticky">
        <Header />
      </div>

      {/* Hero Slider */}
      {sliders && sliders.length > 0 && (
        <section className="hero-slider-section" style={{ position: 'relative', overflow: 'hidden', height: '450px', margin: '1rem 2.5rem', borderRadius: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
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
                  {/* Subtle overlay to ensure text is always readable against varied slider images */}
                  <div className="slide-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.3)', zIndex: 1 }}></div>

                  <div className="slide-content" style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', maxWidth: '90%', minWidth: '350px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#33f20d', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', display: 'inline-block' }}>
                      {s.description || 'SALE SẬP SÀN CÙNG TRÁI CÂY TƯƠI MỚI'}
                    </span>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#121811', margin: '0 0 1.5rem 0', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                      {s.title || 'Giảm giá giữa tháng 4'}
                    </h2>
                    <button
                      className="slider-shop-btn"
                      style={{ background: '#33f20d', color: 'white', border: 'none', padding: '1rem 3rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 15px rgba(51, 242, 13, 0.3)', transition: 'transform 0.2s, background 0.2s', textTransform: 'uppercase' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#2dd60c'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#33f20d'; e.currentTarget.style.transform = 'scale(1)'; }}
                      onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {sliders.length > 1 && (
              <>
                <button className="slider-btn prev-btn" onClick={goToPrev} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255, 255, 255, 0.9)', border: 'none', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '50%', zIndex: 2, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', color: '#121811', transition: 'all 0.2s', padding: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>chevron_left</span>
                </button>
                <button className="slider-btn next-btn" onClick={goToNext} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255, 255, 255, 0.9)', border: 'none', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '50%', zIndex: 2, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', color: '#121811', transition: 'all 0.2s', padding: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>chevron_right</span>
                </button>
                <div className="slider-dots" style={{ position: 'absolute', bottom: '25px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 2 }}>
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
      )}

      {/* Main Layout */}
      <main className="home-main-layout">
        {/* Sidebar Filters */}
        <aside className="home-sidebar-filters">
          <div className="filters-sticky">
            {/* Category Filter */}
            <div className="filter-section">
              <h3 className="filter-title">Danh mục</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={!category}
                    onChange={() => onCategoryChange("")}
                  />
                  <span>Tất cả</span>
                </label>
                {categories.map((item) => (
                  <label key={item.id} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={category === item.id}
                      onChange={() => onCategoryChange(item.id)}
                    />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-section">
              <h3 className="filter-title">Khoảng giá</h3>
              <div className="price-range-wrap">
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={maxPrice}
                  onChange={(e) =>
                    onPriceChange(minPrice, Number(e.target.value))
                  }
                  className="price-slider"
                />
                <div className="price-labels">
                  <span>₫{minPrice.toLocaleString("vi-VN")}</span>
                  <span>₫{maxPrice.toLocaleString("vi-VN")}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="home-content">
          {/* Title and Sort */}
          <div className="content-header">
            <div>
              <h1 className="content-title">Trái cây tươi</h1>
              <p className="content-subtitle">
                Hiển thị {displayed.length} sản phẩm
              </p>
            </div>
            <div className="content-actions">
              <div className="search-wrap">
                <input
                  className="search-input"
                  placeholder="Tìm kiếm trái cây..."
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
                />
                <button
                  className="search-btn"
                  onClick={onSearchSubmit}
                  aria-label="Search"
                >
                  🔍
                </button>
              </div>
              <select
                className="sort-select"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split("-");
                  onSortChange(newSortBy, newSortOrder);
                }}
              >
                <option value="popularity-desc">Sắp xếp: Phổ biến nhất</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
                <option value="createdAt-desc">Mới nhất</option>
              </select>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="error-state">
              <p style={{ color: "red" }}>{error}</p>
            </div>
          )}

          {/* Products Grid */}
          {!error && (
            <div className="modern-products-grid">
              {displayed.map((p) => (
                <div
                  key={p.id}
                  className="modern-product-card"
                  onClick={() => {
                    navigate(`/product/${p.id}`);
                    window.scrollTo(0, 0);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="product-image-wrap">
                    {p.img ? (
                      <div
                        className="product-image"
                        style={{ backgroundImage: `url('${p.img}')` }}
                      />
                    ) : (
                      <div className="product-image-placeholder">🍊</div>
                    )}
                    {p.tag && <div className="product-tag">{p.tag}</div>}
                    <button 
                       className={`product-favorite ${p.isFavorite ? 'active' : ''}`}
                       onClick={(e) => { e.stopPropagation(); onToggleWishlist(p.id, !!p.isFavorite); }}
                       aria-label={p.isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                    >
                       <span className="material-symbols-outlined" style={{ fontVariationSettings: p.isFavorite ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                    </button>
                  </div>
                  <div className="product-info">
                    <div className="product-details">
                      <div>
                        <p className="product-name-modern">{p.name}</p>
                        {p.desc && <p className="product-desc">{p.desc}</p>}
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
          )}

          {/* Pagination */}
          <div className="pagination-wrap">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>

          {/* Additional Sections */}
          <div className="extra-sections">
            {/* Newest Arrivals */}
            <section className="section-arrivals">
              <div className="section-header">
                <h2 className="section-title">Hàng mới về</h2>
                <div className="section-nav">
                  <button className="nav-btn">←</button>
                  <button className="nav-btn">→</button>
                </div>
              </div>
              <div className="horizontal-scroll">
                {newArrivals.map((p) => (
                  <div
                    key={p.id}
                    className="mini-card"
                    onClick={() => {
                      navigate(`/product/${p.id}`);
                      window.scrollTo(0, 0);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="mini-card-img"
                      style={{
                        backgroundImage: p.img ? `url('${p.img}')` : "none",
                      }}
                    ></div>
                    <p className="mini-card-name">{p.name}</p>
                    <p className="mini-card-price">{p.price}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Trending Now */}
            <section className="section-trending">
              <div className="section-header">
                <div className="trending-header-left">
                  <h2 className="section-title">Đang thịnh hành</h2>
                  <span className="trending-badge">🔥 Nổi bật</span>
                </div>
                <div className="section-nav">
                  <button className="nav-btn">←</button>
                  <button className="nav-btn">→</button>
                </div>
              </div>
              <div className="horizontal-scroll">
                {trending.map((p) => (
                  <div
                    key={p.id}
                    className="mini-card"
                    onClick={() => {
                      navigate(`/product/${p.id}`);
                      window.scrollTo(0, 0);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="mini-card-img"
                      style={{
                        backgroundImage: p.img ? `url('${p.img}')` : "none",
                      }}
                    ></div>
                    <p className="mini-card-name">{p.name}</p>
                    <p className="mini-card-price">{p.price}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-container">
          <Footer />
        </div>
      </footer>

      {/* Loading Modal */}
      <LoadingModal
        isOpen={loading}
        message="Đang tải sản phẩm..."
        subMessage="Vui lòng chờ trong giây lát"
        theme="green"
      />
    </div>
  );
}
