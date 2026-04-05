import { useNavigate } from "react-router-dom";
import Header from "../common/header/Header";
import Footer from "../common/footer/Footer";
import Pagination from "../common/pagination/Pagination";
import LoadingModal from "../common/loading/LoadingModal";
import type { HomeCategory } from "./Home.types";
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
  origin,
  organic,
  sortBy,
  sortOrder,
  // Filter handlers
  onCategoryChange,
  onPriceChange,
  onOriginChange,
  onOrganicChange,
  onSortChange,
  onSearchSubmit,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="home-root">
      {/* Sticky Header */}
      <div className="home-header-sticky">
        {/* <div className="home-header-container"> */}
        <Header />
        {/* </div> */}
      </div>

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
