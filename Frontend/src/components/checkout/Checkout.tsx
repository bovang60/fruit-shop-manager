import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePopup } from '../common/popup';
import { getShippingMethods, type ShippingMethodDto } from '../../services/shippingMethodService';
import { createOrder } from '../../services/orderService';
import { getCart, type CartDto } from '../../services/cartService';
import { getSellerVouchersByShop, type SellerVoucherDto } from '../../services/sellerVoucherService';
import { getUserFromStorage } from '../../services/authService';
import CheckoutView from './CheckoutView';

export default function Checkout() {
  const navigate = useNavigate();
  const { showNotice, showError } = usePopup();

  // Customer info
  const [fullName, setFullName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // Shipping
  const [shippingMethods, setShippingMethods] = useState<ShippingMethodDto[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<Record<number, number>>({});
  const [cart, setCart] = useState<CartDto | null>(null);

  // Vouchers
  const [vouchersByShop, setVouchersByShop] = useState<Record<number, SellerVoucherDto[]>>({});
  const [selectedVouchers, setSelectedVouchers] = useState<Record<number, number | undefined>>({});

  // UI state
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Error States inline
  const [nameError, setNameError] = useState<string>('');
  const [addressError, setAddressError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');

  const user = getUserFromStorage();
  const userId = user?.userId;

  const location = useLocation();
  const locationSelectedShopIds = (location.state as any)?.selectedShopIds as number[] || [];

  useEffect(() => {
    if (!userId) {
      showError('Vui lòng đăng nhập để thanh toán');
      navigate('/login');
      return;
    }

    const loadCheckoutData = async () => {
      setLoading(true);
      try {
        const [shippingResponse, cartResponse] = await Promise.all([
          getShippingMethods(),
          getCart(userId),
        ]);

        if (shippingResponse.resultCd === 0 && shippingResponse.data) {
          const availableMethods = shippingResponse.data ?? [];
          setShippingMethods(availableMethods);
        } else {
          setShippingMethods([]);
          showError(shippingResponse.message || 'Không thể tải phương thức vận chuyển');
        }

        if (cartResponse.resultCd === 0 && cartResponse.data) {
          let data = cartResponse.data;
          if (locationSelectedShopIds.length > 0) {
            data.shopCarts = data.shopCarts.filter(sc => locationSelectedShopIds.includes(sc.shopId));
            data.totalPrice = data.shopCarts.reduce((sum, sc) => sum + sc.shopSubtotal, 0);
            data.totalItems = data.shopCarts.reduce((sum, sc) => sum + sc.items.reduce((s,i) => s+i.quantity,0), 0);
          }
          setCart(data);

          // Initialize shipping methods mapping
          const defaultMethodId = (shippingResponse.data ?? []).find((m: ShippingMethodDto) => m.isAvailable)?.methodId ?? 0;
          if (defaultMethodId !== 0) {
             const initialMethods: Record<number, number> = {};
             data.shopCarts.forEach((sc: any) => {
               initialMethods[sc.shopId] = defaultMethodId;
             });
             setSelectedMethods(initialMethods);
          }

          // Fetch vouchers
          const voucherMap: Record<number, SellerVoucherDto[]> = {};
          const vPromises = data.shopCarts.map(async (sc: any) => {
            const vRes = await getSellerVouchersByShop(sc.shopId);
            if (vRes.resultCd === 0 && vRes.data) {
              voucherMap[sc.shopId] = vRes.data;
            } else {
              voucherMap[sc.shopId] = [];
            }
          });
          await Promise.all(vPromises);
          setVouchersByShop(voucherMap);

        } else {
          setCart(null);
          showError(cartResponse.message || 'Không thể tải thông tin giỏ hàng');
        }
      } catch (error) {
        console.error('Error loading checkout data:', error);
        showError('Lỗi kết nối khi tải thông tin thanh toán');
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [showError, userId]);

  const handleNameBlur = () => {
    if (!fullName.trim()) {
      setNameError('Vui lòng nhập họ và tên');
    } else if (!/^[\p{L}\s]+$/u.test(fullName.trim())) {
      setNameError('Họ và tên không được chứa số hoặc ký tự đặc biệt');
    } else {
      setNameError('');
    }
  };

  const handleAddressBlur = () => {
    if (!address.trim()) {
      setAddressError('Vui lòng nhập địa chỉ');
    } else {
      setAddressError('');
    }
  };

  const handlePhoneBlur = () => {
    if (!phone.trim()) {
      setPhoneError('Vui lòng nhập số điện thoại');
    } else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(phone.trim())) {
      setPhoneError('Số điện thoại không hợp lệ. Phải có 10 chữ số và bắt đầu bằng 0');
    } else {
      setPhoneError('');
    }
  };

  const onFullNameChange = (val: string) => {
    setFullName(val);
    if (nameError) setNameError('');
  };

  const onAddressChange = (val: string) => {
    setAddress(val);
    if (addressError) setAddressError('');
  };

  const onPhoneChange = (val: string) => {
    setPhone(val);
    if (phoneError) setPhoneError('');
  };

  const handleSelectMethod = (shopId: number, methodId: number) => {
    setSelectedMethods(prev => ({ ...prev, [shopId]: methodId }));
  };

  const handleSelectVoucher = (shopId: number, voucherId?: number) => {
    setSelectedVouchers(prev => ({ ...prev, [shopId]: voucherId }));
  };

  const cartItems = cart?.shopCarts?.flatMap(sc => sc.items) || [];
  const allShopsHaveShipping = cart?.shopCarts?.every(sc => selectedMethods[sc.shopId] !== undefined) ?? false;

  const isFormValid =
    fullName.trim() !== '' &&
    address.trim() !== '' &&
    phone.trim() !== '' &&
    allShopsHaveShipping &&
    cartItems.length > 0;

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    // Validation
    if (!fullName.trim()) {
      showError('Vui lòng nhập họ và tên');
      return;
    }
    
    // Allow unicode letters and spaces, reject numbers and special characters
    const nameRegex = /^[\p{L}\s]+$/u;
    if (!nameRegex.test(fullName.trim())) {
      showError('Họ và tên không được chứa số hoặc ký tự đặc biệt');
      return;
    }

    if (!address.trim()) {
      showError('Vui lòng nhập địa chỉ');
      return;
    }

    if (!phone.trim()) {
      showError('Vui lòng nhập số điện thoại');
      return;
    }

    // Valid Vietnamese phone number format (03, 05, 07, 08, 09) + 8 digits
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(phone.trim())) {
      showError('Số điện thoại không hợp lệ. Phải có 10 chữ số và bắt đầu bằng 0');
      return;
    }
    if (!allShopsHaveShipping) {
      showError('Vui lòng chọn đầy đủ phương thức vận chuyển cho từng Shop');
      return;
    }
    if (cartItems.length === 0) {
      showError('Giỏ hàng trống');
      return;
    }
    if (!userId) {
      showError('Vui lòng đăng nhập để thanh toán');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const response = await createOrder(userId, {
        receiverName: fullName.trim(),
        shippingAddress: address.trim(),
        receiverPhone: phone.trim(),
        paymentMethod: 'COD',
        shops: Object.entries(selectedMethods).map(([shopIdStr, methodId]) => ({
            shopId: parseInt(shopIdStr, 10),
            shippingMethodId: methodId,
            voucherId: selectedVouchers[parseInt(shopIdStr, 10)],
            note: ''
        }))
      });

      if (response.resultCd === 0) {
        showNotice('Đặt hàng thành công');
        navigate('/order-history');
      } else {
        showError(response.message || 'Không thể đặt hàng');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      showError('Lỗi kết nối khi đặt hàng');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CheckoutView
      fullName={fullName}
      address={address}
      phone={phone}
      shippingMethods={shippingMethods}
      selectedMethods={selectedMethods}
      cart={cart}
      cartItems={cartItems}
      vouchersByShop={vouchersByShop}
      selectedVouchers={selectedVouchers}
      loading={loading}
      submitting={submitting}
      isFormValid={isFormValid}
      onFullNameChange={onFullNameChange}
      onAddressChange={onAddressChange}
      onPhoneChange={onPhoneChange}
      onSelectMethod={handleSelectMethod}
      onSelectVoucher={handleSelectVoucher}
      onSubmit={handleSubmit}
      nameError={nameError}
      addressError={addressError}
      phoneError={phoneError}
      onNameBlur={handleNameBlur}
      onAddressBlur={handleAddressBlur}
      onPhoneBlur={handlePhoneBlur}
    />
  );
}
