import Header from '../common/header/Header'
import Footer from '../common/footer/Footer'
import LoadingModal from '../common/loading/LoadingModal'
import type { CartDto } from '../../services/cartService'
import './Cart.css'

export interface CartViewProps {
  cart: CartDto | null
  loading: boolean
  updatingItemId: number | null
  selectedShopIds: number[]
  onToggleShop: (shopId: number) => void
  onUpdateQuantity: (cartItemId: number, currentQuantity: number, change: number) => void
  onRemoveItem: (cartItemId: number) => void
  onClearCart: () => void
  onCheckout: () => void
  onContinueShopping: () => void
  onViewOrderHistory: () => void
}

export default function CartView({
  cart,
  loading,
  updatingItemId,
  selectedShopIds,
  onToggleShop,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onContinueShopping,
  onViewOrderHistory,
}: CartViewProps) {
  const formatCurrency = (amount: number) => {
    return `₫${amount.toLocaleString('vi-VN')}`
  }

  const hasItems = (cart?.shopCarts?.flatMap(sc => sc.items)?.length ?? 0) > 0

  const selectedCarts = cart?.shopCarts?.filter(sc => selectedShopIds.includes(sc.shopId)) || []
  const displayTotalItems = selectedCarts.reduce((sum, sc) => sum + sc.items.reduce((s,i) => s + i.quantity, 0), 0)
  const displayTotalPrice = selectedCarts.reduce((sum, sc) => sum + sc.shopSubtotal, 0)

  return (
    <div className="cart-root">
      <header className="cart-header">
        <Header />
      </header>

      <main className="cart-main">
        <section className="cart-container">
          <h1 className="cart-title">Giỏ hàng</h1>

          {!hasItems ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">GIỎ HÀNG</div>
              <p className="cart-empty-message">Giỏ hàng của bạn đang trống</p>
              <button
                type="button"
                className="cart-btn-primary cart-btn-continue"
                onClick={onContinueShopping}
              >
                Tiếp tục mua sắm
              </button>
              <button
                type="button"
                className="cart-btn-secondary cart-btn-order-history"
                onClick={onViewOrderHistory}
              >
                Xem lịch sử đơn hàng
              </button>
            </div>
          ) : (
            <div className="cart-content-wrapper">
              <div className="cart-items-section">
                <div className="cart-items-header">
                  <span className="cart-items-count">
                    Bạn có {cart?.totalItems || 0} sản phẩm trong giỏ hàng
                  </span>
                  <button
                    type="button"
                    className="cart-btn-text cart-btn-clear"
                    onClick={onClearCart}
                  >
                    Xóa tất cả
                  </button>
                </div>

                <div className="cart-items-list">
                  {cart?.shopCarts?.map((shopCart) => (
                    <div key={`shop-${shopCart.shopId}`} className="cart-shop-group" style={{ marginBottom: '24px' }}>
                      <div className="cart-shop-header" style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eaeaea' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input 
                            type="checkbox" 
                            checked={selectedShopIds.includes(shopCart.shopId)} 
                            onChange={() => onToggleShop(shopCart.shopId)} 
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                          <span role="img" aria-label="shop">🏪</span> 
                          <span 
                            style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-green)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#2c3e50'}
                            onClick={() => window.location.href = `/shop/${shopCart.shopId}`}
                          >
                            {shopCart.shopName}
                          </span>
                        </h3>
                      </div>
                      {shopCart.items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className={`cart-item-card ${updatingItemId === item.cartItemId ? 'cart-item-updating' : ''}`}
                    >
                      <div className="cart-item-image-wrap">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="cart-item-image"
                          onError={(e) => {
                            ; (e.target as HTMLImageElement).src = ''
                          }}
                        />
                      </div>

                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.productName}</h3>
                        <p className="cart-item-price">{formatCurrency(item.price)}</p>
                      </div>

                      <div className="cart-item-quantity-wrapper">
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity, -1)}
                          disabled={item.quantity <= 1 || updatingItemId === item.cartItemId}
                          aria-label="Giảm số lượng"
                        >
                          -
                        </button>
                        <span className="cart-qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity, 1)}
                          disabled={updatingItemId === item.cartItemId}
                          aria-label="Tăng số lượng"
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-item-subtotal">
                        {formatCurrency(item.subtotal)}
                      </div>

                      <button
                        type="button"
                        className="cart-btn-remove"
                        onClick={() => onRemoveItem(item.cartItemId)}
                        disabled={updatingItemId === item.cartItemId}
                        aria-label={`Xóa ${item.productName} khỏi giỏ hàng`}
                      >
                        x
                      </button>
                    </div>
                  ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="cart-summary-section">
                <div className="cart-summary-card">
                  <h2 className="cart-summary-title">Tóm tắt đơn hàng</h2>

                  <div className="cart-summary-row">
                    <span className="cart-summary-label">Tạm tính ({displayTotalItems} sản phẩm)</span>
                    <span className="cart-summary-value">
                      {formatCurrency(displayTotalPrice)}
                    </span>
                  </div>

                  <div className="cart-summary-divider"></div>

                  <div className="cart-summary-row cart-summary-total">
                    <span className="cart-summary-label">Tổng cộng</span>
                    <span className="cart-summary-value-total">
                      {formatCurrency(displayTotalPrice)}
                    </span>
                  </div>

                  <p className="cart-summary-note">
                    Đã bao gồm VAT (nếu có). Phí vận chuyển sẽ được tính khi thanh toán.
                  </p>

                  <button
                    type="button"
                    className="cart-btn-primary cart-btn-checkout"
                    onClick={onCheckout}
                  >
                    Tiến hành thanh toán
                  </button>

                  <button
                    type="button"
                    className="cart-btn-secondary cart-btn-continue"
                    onClick={onContinueShopping}
                  >
                    Tiếp tục mua sắm
                  </button>

                  <button
                    type="button"
                    className="cart-btn-secondary cart-btn-order-history"
                    onClick={onViewOrderHistory}
                  >
                    Xem lịch sử đơn hàng
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="cart-footer">
        <Footer />
      </footer>

      {/* Loading Modal - hiển thị khi đang tải giỏ hàng hoặc xóa giỏ hàng */}
      <LoadingModal
        isOpen={loading}
        message="Đang tải giỏ hàng..."
        subMessage="Vui lòng chờ trong giây lát"
        theme="green"
      />
    </div>
  )
}
