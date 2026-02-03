import React from 'react'
import './Header.css'

export default function HeaderView() {
  return (
    <header className="site-header">
      <div className="brand">Fruit Shop Manager</div>
      <nav className="nav-tabs">
        <button className="tab active">Trang chủ</button>
        <button className="tab">Sản phẩm</button>
        <button className="tab">Đơn hàng</button>
        <button className="tab">Khách hàng</button>
      </nav>
    </header>
  )
}
