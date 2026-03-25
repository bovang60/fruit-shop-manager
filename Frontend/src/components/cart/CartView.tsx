import Header from '../common/header/Header'
import Footer from '../common/footer/Footer'
import type { CartDto } from '../../services/cartService'
import './Cart.css'

export interface CartViewProps {
  cart: CartDto | null
  loading: boolean
  updatingItemId: number | null
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
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onContinueShopping,
  onViewOrderHistory,
}: CartViewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const hasItems = (cart?.items?.length ?? 0) > 0

  return (
    <div className="cart-root">
      <header className="cart-header">
        <Header />
      </header>

      <main className="cart-main">
        <section className="cart-container">
          <h1 className="cart-title">Your Cart</h1>

          {loading && !cart ? (
            <div className="cart-loading">Loading cart...</div>
          ) : !hasItems ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">CART</div>
              <p className="cart-empty-message">Your cart is currently empty</p>
              <button
                type="button"
                className="cart-btn-primary cart-btn-continue"
                onClick={onContinueShopping}
              >
                Continue Shopping
              </button>
              <button
                type="button"
                className="cart-btn-secondary cart-btn-order-history"
                onClick={onViewOrderHistory}
              >
                View Order History
              </button>
            </div>
          ) : (
            <div className="cart-content-wrapper">
              <div className="cart-items-section">
                <div className="cart-items-header">
                  <span className="cart-items-count">
                    You have {cart?.totalItems || 0} item(s) in your cart
                  </span>
                  <button
                    type="button"
                    className="cart-btn-text cart-btn-clear"
                    onClick={onClearCart}
                  >
                    Clear All
                  </button>
                </div>

                <div className="cart-items-list">
                  {cart?.items?.map((item) => (
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
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="cart-qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity, 1)}
                          disabled={updatingItemId === item.cartItemId}
                          aria-label="Increase quantity"
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
                        aria-label={`Remove ${item.productName} from cart`}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cart-summary-section">
                <div className="cart-summary-card">
                  <h2 className="cart-summary-title">Order Summary</h2>

                  <div className="cart-summary-row">
                    <span className="cart-summary-label">Subtotal ({cart?.totalItems} items)</span>
                    <span className="cart-summary-value">
                      {formatCurrency(cart?.totalPrice || 0)}
                    </span>
                  </div>

                  <div className="cart-summary-divider"></div>

                  <div className="cart-summary-row cart-summary-total">
                    <span className="cart-summary-label">Total</span>
                    <span className="cart-summary-value-total">
                      {formatCurrency(cart?.totalPrice || 0)}
                    </span>
                  </div>

                  <p className="cart-summary-note">
                    VAT included if applicable. Shipping fees will be calculated at checkout.
                  </p>

                  <button
                    type="button"
                    className="cart-btn-primary cart-btn-checkout"
                    onClick={onCheckout}
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    type="button"
                    className="cart-btn-secondary cart-btn-continue"
                    onClick={onContinueShopping}
                  >
                    Continue Shopping
                  </button>

                  <button
                    type="button"
                    className="cart-btn-secondary cart-btn-order-history"
                    onClick={onViewOrderHistory}
                  >
                    View Order History
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
    </div>
  )
}
