import Header from '../common/header/Header';
import Footer from '../common/footer/Footer';
import LoadingModal from '../common/loading/LoadingModal';
import type { ShippingMethodDto } from '../../services/shippingMethodService';
import type { CartDto, CartItemDto } from '../../services/cartService';
import type { SellerVoucherDto } from '../../services/sellerVoucherService';
import './Checkout.css';

export interface CheckoutViewProps {
  fullName: string;
  address: string;
  phone: string;
  shippingMethods: ShippingMethodDto[];
  selectedMethods: Record<number, number>;
  vouchersByShop: Record<number, SellerVoucherDto[]>;
  selectedVouchers: Record<number, number | undefined>;
  cart: CartDto | null;
  cartItems: CartItemDto[];
  loading: boolean;
  submitting: boolean;
  isFormValid: boolean;
  onFullNameChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSelectMethod: (shopId: number, methodId: number) => void;
  onSelectVoucher: (shopId: number, voucherId?: number) => void;
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
  selectedMethods,
  vouchersByShop,
  selectedVouchers,
  cart,
  cartItems,
  loading,
  submitting,
  isFormValid,
  onFullNameChange,
  onAddressChange,
  onPhoneChange,
  onSelectMethod,
  onSelectVoucher,
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

  const shippingFee = cart?.shopCarts?.reduce((total, sc) => {
    const selectedMethodId = selectedMethods[sc.shopId];
    const method = shippingMethods?.find(m => m.methodId === selectedMethodId);
    return total + (method?.fixedFee ?? 0);
  }, 0) ?? 0;

  const totalDiscount = cart?.shopCarts?.reduce((total, sc) => {
    const selectedVoucherId = selectedVouchers[sc.shopId];
    if (!selectedVoucherId) return total;
    const voucher = vouchersByShop[sc.shopId]?.find(v => v.voucherId === selectedVoucherId);
    if (!voucher) return total;

    // Simulate backend discount calculation logic
    let discount = 0;
    if (sc.shopSubtotal >= voucher.minOrderValue) {
      discount = voucher.discountValue; // Note: We only have FIXED discountType in schema mapped by model, so assume FIXED value or if they add PERCENT, need type. Here we just use the raw value as FIXED.
    }
    return total + Math.min(discount, sc.shopSubtotal);
  }, 0) ?? 0;

  const finalTotal = totalPrice - totalDiscount + shippingFee;

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

              {/* Shipping Methods removed from global space */}

              <div className="checkout-form-section">
                <h2 className="checkout-section-title">Sản phẩm đặt hàng</h2>
                <p className="checkout-shipping-desc">Tổng số sản phẩm: {totalItems}</p>
                <div className="checkout-shipping-list">
                  {cart?.shopCarts?.map(shopCart => (
                    <div key={`checkout-shop-${shopCart.shopId}`} className="checkout-shop-group" style={{ marginBottom: '20px' }}>
                      <div style={{ fontWeight: '600', marginBottom: '12px', color: '#333' }}>🏪 {shopCart.shopName}</div>
                      {shopCart.items.map((item) => (
                        <div
                          key={item?.cartItemId ?? `${item?.productId ?? 'item'}-${item?.quantity ?? 0}`}
                          className="checkout-shipping-card"
                          style={{ marginBottom: '8px' }}
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
                      
                      {/* Thêm chọn vận chuyển cho Shop này */}
                      <div className="checkout-shop-shipping" style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                        <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '12px', color: '#555' }}>Đơn vị giao hàng:</div>
                        <div className="checkout-shipping-list">
                          {shippingMethods?.map((method) => {
                            const methodSelectedId = selectedMethods[shopCart.shopId];
                            return (
                              <div
                                key={`sc-${shopCart.shopId}-method-${method.methodId}`}
                                className={`checkout-shipping-card ${
                                  methodSelectedId === method.methodId
                                    ? 'checkout-shipping-card--selected'
                                    : ''
                                } ${!method.isAvailable ? 'checkout-shipping-card--disabled' : ''}`}
                                onClick={() => {
                                  if (method.isAvailable && !submitting) {
                                    onSelectMethod(shopCart.shopId, method.methodId);
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                              >
                                <div className="checkout-shipping-radio">
                                  <div
                                    className={`checkout-radio-outer ${
                                      methodSelectedId === method.methodId
                                        ? 'checkout-radio-outer--active'
                                        : ''
                                    }`}
                                  >
                                    {methodSelectedId === method.methodId && (
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
                            );
                          })}
                        </div>
                      </div>

                      {/* Thêm chọn Voucher cho Shop này */}
                      <div className="checkout-shop-shipping" style={{ marginTop: '16px', padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: '600', fontSize: '1rem', color: '#555' }}>Mã giảm giá của gian hàng:</div>
                        <div className="checkout-voucher-select">
                          <select 
                             className="checkout-input" 
                             style={{ minWidth: '200px', cursor: 'pointer', borderColor: '#4CAF50', padding: '8px', borderRadius: '4px' }}
                             value={selectedVouchers[shopCart.shopId] || ''}
                             onChange={(e) => {
                               const val = e.target.value;
                               onSelectVoucher(shopCart.shopId, val ? parseInt(val, 10) : undefined);
                             }}
                             disabled={submitting}
                          >
                             <option value="">-- Không áp dụng --</option>
                             {vouchersByShop[shopCart.shopId]?.map(v => {
                               const isEligible = shopCart.shopSubtotal >= v.minOrderValue;
                               return (
                                 <option key={v.voucherId} value={v.voucherId} disabled={!isEligible}>
                                   {v.code} - Giảm {formatCurrency(v.discountValue)} {isEligible ? '' : `(Đơn tối thiểu ${formatCurrency(v.minOrderValue)})`}
                                 </option>
                               );
                             })}
                          </select>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
                <div className="checkout-submit-section" style={{ textAlign: 'right' }}>
                  <p className="checkout-shipping-desc" style={{ marginBottom: '4px' }}>Tạm tính: {formatCurrency(totalPrice)}</p>
                  <p className="checkout-shipping-desc" style={{ marginBottom: '4px', color: '#e53935' }}>Giảm giá Voucher: -{formatCurrency(totalDiscount)}</p>
                  <p className="checkout-shipping-desc" style={{ marginBottom: '12px' }}>Phí vận chuyển: {formatCurrency(shippingFee)}</p>
                  <p className="checkout-section-title">Tổng cộng: {formatCurrency(finalTotal >= 0 ? finalTotal : 0)}</p>
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
