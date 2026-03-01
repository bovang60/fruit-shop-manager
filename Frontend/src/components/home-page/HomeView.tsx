import React from 'react'
import Header from '../common/header/Header'
import Footer from '../common/footer/Footer'
import Pagination from '../common/pagination/Pagination'
import './Home.css'

type Product = { id: number; name: string; price: string; img?: string; desc?: string; tag?: string }

export type Props = {
  query: string
  onQueryChange: (v: string) => void
  products: Product[]
  displayed: Product[]
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}

export default function HomeView({ query, onQueryChange, displayed, page, totalPages, onPageChange }: Props) {
  return (
    <div className="home-root">
      {/* Sticky Header */}
      <div className="home-header-sticky">
        <div className="home-header-container">
          <Header />
        </div>
      </div>

      {/* Main Layout */}
      <main className="home-main-layout">
        {/* Sidebar Filters */}
        <aside className="home-sidebar-filters">
          <div className="filters-sticky">
            {/* Category Filter */}
            <div className="filter-section">
              <h3 className="filter-title">Category</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input type="checkbox" defaultChecked />
                  <span>All Fruits</span>
                </label>
                <label className="filter-option">
                  <input type="checkbox" />
                  <span>Berries</span>
                </label>
                <label className="filter-option">
                  <input type="checkbox" />
                  <span>Citrus</span>
                </label>
                <label className="filter-option">
                  <input type="checkbox" />
                  <span>Tropical</span>
                </label>
                <label className="filter-option">
                  <input type="checkbox" />
                  <span>Seasonal</span>
                </label>
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-section">
              <h3 className="filter-title">Price Range</h3>
              <div className="price-range-wrap">
                <input type="range" min="0" max="50" defaultValue="25" className="price-slider" />
                <div className="price-labels">
                  <span>$0</span>
                  <span>$50</span>
                </div>
              </div>
            </div>

            {/* Origin */}
            <div className="filter-section">
              <h3 className="filter-title">Origin</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input type="radio" name="origin" defaultChecked />
                  <span>Any</span>
                </label>
                <label className="filter-option">
                  <input type="radio" name="origin" />
                  <span>Local Farms</span>
                </label>
                <label className="filter-option">
                  <input type="radio" name="origin" />
                  <span>Imported</span>
                </label>
              </div>
            </div>

            {/* Organic Status */}
            <div className="filter-section">
              <h3 className="filter-title">Organic Status</h3>
              <label className="filter-option-organic">
                <input type="checkbox" defaultChecked />
                <span>Certified Organic</span>
              </label>
            </div>

            <button className="apply-filters-btn">Apply Filters</button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="home-content">
          {/* Title and Sort */}
          <div className="content-header">
            <div>
              <h1 className="content-title">Fresh Produce</h1>
              <p className="content-subtitle">Showing {displayed.length} results for "All Fruits"</p>
            </div>
            <div className="content-actions">
              <input 
                className="search-input" 
                placeholder="Search fruits..." 
                value={query} 
                onChange={(e) => onQueryChange(e.target.value)} 
              />
              <select className="sort-select">
                <option>Sort by: Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="modern-products-grid">
            {displayed.map((p) => (
              <div key={p.id} className="modern-product-card">
                <div className="product-image-wrap">
                  {p.img ? (
                    <div className="product-image" style={{ backgroundImage: `url('${p.img}')` }} />
                  ) : (
                    <div className="product-image-placeholder">🍊</div>
                  )}
                  {p.tag && <div className="product-tag">{p.tag}</div>}
                  <div className="product-favorite">❤</div>
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
                    onClick={() => alert('Đã thêm vào giỏ (mock)')}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination-wrap">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
          </div>

          {/* Additional Sections */}
          <div className="extra-sections">
            {/* Newest Arrivals */}
            <section className="section-arrivals">
              <div className="section-header">
                <h2 className="section-title">Newest Arrivals</h2>
                <div className="section-nav">
                  <button className="nav-btn">←</button>
                  <button className="nav-btn">→</button>
                </div>
              </div>
              <div className="horizontal-scroll">
                {[1,2,3,4].map(i => (
                  <div key={i} className="mini-card">
                    <div className="mini-card-img" style={{backgroundImage: `url('https://source.unsplash.com/200x200/?fruit,${i}')`}}></div>
                    <p className="mini-card-name">Fruit {i}</p>
                    <p className="mini-card-price">${(i*3.5+2).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Trending Now */}
            <section className="section-trending">
              <div className="section-header">
                <div className="trending-header-left">
                  <h2 className="section-title">Trending Now</h2>
                  <span className="trending-badge">🔥 Hot Picks</span>
                </div>
                <div className="section-nav">
                  <button className="nav-btn">←</button>
                  <button className="nav-btn">→</button>
                </div>
              </div>
              <div className="horizontal-scroll">
                {[5,6,7].map(i => (
                  <div key={i} className="mini-card">
                    <div className="mini-card-img" style={{backgroundImage: `url('https://source.unsplash.com/200x200/?fruit,${i}')`}}></div>
                    <p className="mini-card-name">Fruit {i}</p>
                    <p className="mini-card-price">${(i*3.5+2).toFixed(2)}</p>
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
    </div>
  )
}
