import React from 'react'
import Header from '../common/header/Header'
import Footer from '../common/footer/Footer'
import Pagination from '../common/pagination/Pagination'
import './Home.css'

type Product = { id: number; name: string; price: string; img?: string }

type Props = {
  query: string
  onQueryChange: (v: string) => void
  products: Product[]
  displayed: Product[]
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}

export default function HomeView({ query, onQueryChange, products, displayed, page, totalPages, onPageChange }: Props) {
  return (
    <main className="home-root">
      <div className="home-container">
        <Header />

        <div className="topbar">
          <div className="search-wrap">
            <input className="search" placeholder="Tìm kiếm sản phẩm..." value={query} onChange={(e) => onQueryChange(e.target.value)} />
          </div>
          <div className="cart-wrap">
            <button className="cart-btn">🧺 Giỏ hàng</button>
          </div>
        </div>

        <section className="home-actions">
          <div className="home-main">
            <div className="card">
              <h2>Sản phẩm</h2>
              <div className="products-grid">
                {displayed.map((p) => (
                  <article className="product-card" key={p.id}>
                    <div className="product-media">🍊</div>
                    <h3 className="product-name">{p.name}</h3>
                    <div className="product-meta">
                      <span className="price">{p.price}</span>
                      <button className="add" onClick={() => alert('Đã thêm vào giỏ (mock)')}>Thêm</button>
                    </div>
                  </article>
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
          </div>

          <aside className="sidebar">
            <div className="card">
              <h3>Thông tin nhanh</h3>
              <p>Đơn chờ: 2</p>
              <p>Doanh thu hôm nay: ₫1,250,000</p>
            </div>
          </aside>
        </section>

        <Footer />
      </div>
    </main>
  )
}
