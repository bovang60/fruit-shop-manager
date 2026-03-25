import Header from '../common/header/Header';
import Footer from '../common/footer/Footer';
import type { ShippingMethodDto } from '../../services/shippingMethodService';
import type { CartDto, CartItemDto } from '../../services/cartService';
import './Checkout.css';

export interface CheckoutViewProps {
  fullName: string;
  address: string;
  phone: string;
  shippingMethods: ShippingMethodDto[];
  selectedMethodId: number | null;
  cart: CartDto | null;
  cartItems: CartItemDto[];
  loading: boolean;
  submitting: boolean;
  isFormValid: boolean;
  onFullNameChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSelectMethod: (methodId: number) => void;
  onSubmit: () => void;
}

export default function CheckoutView({
  fullName,
  address,
  phone,
  shippingMethods,
  selectedMethodId,
  cart,
  cartItems,
  loading,
  submitting,
  isFormValid,
  onFullNameChange,
  onAddressChange,
  onPhoneChange,
  onSelectMethod,
  onSubmit,
}: CheckoutViewProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const totalItems = cart?.totalItems ?? cartItems?.length ?? 0;
  const totalPrice = cart?.totalPrice ?? 0;
  const hasItems = (cartItems?.length ?? 0) > 0;

  return (
    <div className="checkout-root">
      <header className="checkout-header">
        <Header />
      </header>

      <main className="checkout-main">
        <section className="checkout-container">
          <h1 className="checkout-title">Checkout</h1>

          {loading ? (
            <div className="checkout-loading">
              <div className="checkout-spinner"></div>
              <p>Loading checkout information...</p>
            </div>
          ) : !hasItems ? (
            <div className="checkout-loading">
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div className="checkout-content">
              {/* Customer Info Form */}
              <div className="checkout-form-section">
                <h2 className="checkout-section-title">Customer Information</h2>

                <div className="checkout-form-group">
                  <label className="checkout-label" htmlFor="checkout-fullname">
                    Full Name
                  </label>
                  <input
                    id="checkout-fullname"
                    type="text"
                    className="checkout-input"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => onFullNameChange(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="checkout-form-group">
                  <label className="checkout-label" htmlFor="checkout-address">
                    Address
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    className="checkout-input"
                    placeholder="Enter your delivery address"
                    value={address}
                    onChange={(e) => onAddressChange(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="checkout-form-group">
                  <label className="checkout-label" htmlFor="checkout-phone">
                    Phone
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    className="checkout-input"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Shipping Methods */}
              <div className="checkout-shipping-section">
                <h2 className="checkout-section-title">Shipping Method</h2>

                {shippingMethods?.length === 0 ? (
                  <p className="checkout-no-shipping">No shipping methods available</p>
                ) : (
                  <div className="checkout-shipping-list">
                    {shippingMethods?.map((method) => (
                      <div
                        key={method.methodId}
                        className={`checkout-shipping-card ${
                          selectedMethodId === method.methodId
                            ? 'checkout-shipping-card--selected'
                            : ''
                        } ${!method.isAvailable ? 'checkout-shipping-card--disabled' : ''}`}
                        onClick={() => {
                          if (method.isAvailable && !submitting) {
                            onSelectMethod(method.methodId);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (
                            (e.key === 'Enter' || e.key === ' ') &&
                            method.isAvailable &&
                            !submitting
                          ) {
                            e.preventDefault();
                            onSelectMethod(method.methodId);
                          }
                        }}
                      >
                        <div className="checkout-shipping-radio">
                          <div
                            className={`checkout-radio-outer ${
                              selectedMethodId === method.methodId
                                ? 'checkout-radio-outer--active'
                                : ''
                            }`}
                          >
                            {selectedMethodId === method.methodId && (
                              <div className="checkout-radio-inner"></div>
                            )}
                          </div>
                        </div>

                        <div className="checkout-shipping-info">
                          <span className="checkout-shipping-name">{method.methodName}</span>
                          <span className="checkout-shipping-desc">{method.description}</span>
                        </div>

                        <div className="checkout-shipping-fee">
                          {formatCurrency(method.fixedFee)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="checkout-form-section">
                <h2 className="checkout-section-title">Order Items</h2>
                <p className="checkout-shipping-desc">Total items: {totalItems}</p>
                <div className="checkout-shipping-list">
                  {cartItems?.map((item) => (
                    <div
                      key={item?.cartItemId ?? `${item?.productId ?? 'item'}-${item?.quantity ?? 0}`}
                      className="checkout-shipping-card"
                    >
                      <div className="checkout-shipping-info">
                        <span className="checkout-shipping-name">
                          {item?.productName || 'Unnamed product'}
                        </span>
                        <span className="checkout-shipping-desc">
                          Product ID: {item?.productId ?? 'N/A'} | Quantity: {item?.quantity ?? 0}
                        </span>
                      </div>

                      <div className="checkout-shipping-fee">
                        {formatCurrency(item?.subtotal ?? 0)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="checkout-submit-section">
                  <p className="checkout-section-title">Cart Total: {formatCurrency(totalPrice)}</p>
                </div>
              </div>

              {/* Submit */}
              <div className="checkout-submit-section">
                <button
                  id="checkout-submit-btn"
                  type="button"
                  className="checkout-btn-submit"
                  onClick={onSubmit}
                  disabled={!isFormValid || submitting}
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="checkout-footer">
        <Footer />
      </footer>
    </div>
  );
}
