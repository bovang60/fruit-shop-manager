import Header from '../common/header/Header';
import Footer from '../common/footer/Footer';
import LoadingModal from '../common/loading/LoadingModal';
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
  nameError?: string;
  addressError?: string;
  phoneError?: string;
  onNameBlur?: () => void;
  onAddressBlur?: () => void;
  onPhoneBlur?: () => void;
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
  nameError,
  addressError,
  phoneError,
  onNameBlur,
  onAddressBlur,
  onPhoneBlur,
}: CheckoutViewProps) {

  const formatCurrency = (amount: number) => {
    return `₫${amount.toLocaleString('vi-VN')}`;
  };

  const totalItems = cart?.totalItems ?? cartItems?.length ?? 0;
  const totalPrice = cart?.totalPrice ?? 0;
  const hasItems = (cartItems?.length ?? 0) > 0;

  const selectedMethod = shippingMethods?.find(m => m.methodId === selectedMethodId);
  const shippingFee = selectedMethod?.fixedFee ?? 0;
  const finalTotal = totalPrice + shippingFee;

  return (
    <div className="checkout-root">
      <header className="checkout-header">
        <Header />
      </header>

      <main className="checkout-main">
        <section className="checkout-container">
          <h1 className="checkout-title">Thanh toán</h1>

          {!hasItems && !loading ? (
            <div className="checkout-loading">
              <p>Giỏ hàng của bạn đang trống.</p>
            </div>
          ) : !loading && (
            <div className="checkout-content">
              {/* Customer Info Form */}
              <div className="checkout-form-section">
                <h2 className="checkout-section-title">Thông tin khách hàng</h2>

                <div className="checkout-form-group">
                  <label className="checkout-label" htmlFor="checkout-fullname">
                    Họ và tên
                  </label>
                  <input
                    id="checkout-fullname"
                    type="text"
                    className={`checkout-input ${nameError ? 'checkout-input--error' : ''}`}
                    placeholder="Nhập họ và tên"
                    value={fullName}
                    onChange={(e) => onFullNameChange(e.target.value)}
                    onBlur={onNameBlur}
                    disabled={submitting}
                  />
                  {nameError && <span className="checkout-error-text">{nameError}</span>}
                </div>

                <div className="checkout-form-group">
                  <label className="checkout-label" htmlFor="checkout-address">
                    Địa chỉ
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    className={`checkout-input ${addressError ? 'checkout-input--error' : ''}`}
                    placeholder="Nhập địa chỉ giao hàng"
                    value={address}
                    onChange={(e) => onAddressChange(e.target.value)}
                    onBlur={onAddressBlur}
                    disabled={submitting}
                  />
                  {addressError && <span className="checkout-error-text">{addressError}</span>}
                </div>

                <div className="checkout-form-group">
                  <label className="checkout-label" htmlFor="checkout-phone">
                    Số điện thoại
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    className={`checkout-input ${phoneError ? 'checkout-input--error' : ''}`}
                    placeholder="Nhập số điện thoại"
                    value={phone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    onBlur={onPhoneBlur}
                    disabled={submitting}
                  />
                  {phoneError && <span className="checkout-error-text">{phoneError}</span>}
                </div>
              </div>

              {/* Shipping Methods */}
              <div className="checkout-shipping-section">
                <h2 className="checkout-section-title">Phương thức vận chuyển</h2>

                {shippingMethods?.length === 0 ? (
                  <p className="checkout-no-shipping">Không có phương thức vận chuyển nào</p>
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
                <h2 className="checkout-section-title">Sản phẩm đặt hàng</h2>
                <p className="checkout-shipping-desc">Tổng số sản phẩm: {totalItems}</p>
                <div className="checkout-shipping-list">
                  {cartItems?.map((item) => (
                    <div
                      key={item?.cartItemId ?? `${item?.productId ?? 'item'}-${item?.quantity ?? 0}`}
                      className="checkout-shipping-card"
                    >
                      <div className="checkout-shipping-info">
                        <span className="checkout-shipping-name">
                          {item?.productName || 'Sản phẩm chưa đặt tên'}
                        </span>
                        <span className="checkout-shipping-desc">
                          Mã SP: {item?.productId ?? 'N/A'} | Số lượng: {item?.quantity ?? 0}
                        </span>
                      </div>

                      <div className="checkout-shipping-fee">
                        {formatCurrency(item?.subtotal ?? 0)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="checkout-submit-section" style={{ textAlign: 'right' }}>
                  <p className="checkout-shipping-desc" style={{ marginBottom: '4px' }}>Tạm tính: {formatCurrency(totalPrice)}</p>
                  <p className="checkout-shipping-desc" style={{ marginBottom: '12px' }}>Phí vận chuyển: {formatCurrency(shippingFee)}</p>
                  <p className="checkout-section-title">Tổng cộng: {formatCurrency(finalTotal)}</p>
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
                  {submitting ? 'Đang đặt hàng...' : 'Đặt hàng'}
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="checkout-footer">
        <Footer />
      </footer>

      {/* Loading Modal - hiển thị khi đang tải dữ liệu hoặc đặt hàng */}
      <LoadingModal
        isOpen={loading || submitting}
        message={submitting ? 'Đang đặt hàng...' : 'Đang tải thông tin...'}
        subMessage={submitting ? 'Vui lòng không đóng trang' : 'Vui lòng chờ trong giây lát'}
        theme="green"
      />
    </div>
  );
}
