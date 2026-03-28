import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePopup } from '../common/popup';
import { getShippingMethods, type ShippingMethodDto } from '../../services/shippingMethodService';
import { createOrder } from '../../services/orderService';
import { getCart, type CartDto } from '../../services/cartService';
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
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartDto | null>(null);

  // UI state
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Error States inline
  const [nameError, setNameError] = useState<string>('');
  const [addressError, setAddressError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');

  const user = getUserFromStorage();
  const userId = user?.userId;

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

          setSelectedMethodId((currentValue) => {
            if (
              currentValue &&
              availableMethods.some(
                (method) => method?.methodId === currentValue && method?.isAvailable
              )
            ) {
              return currentValue;
            }

            return availableMethods.find((method) => method?.isAvailable)?.methodId ?? null;
          });
        } else {
          setShippingMethods([]);
          showError(shippingResponse.message || 'Không thể tải phương thức vận chuyển');
        }

        if (cartResponse.resultCd === 0 && cartResponse.data) {
          setCart(cartResponse.data);
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

  const cartItems = cart?.items || [];
  const isFormValid =
    fullName.trim() !== '' &&
    address.trim() !== '' &&
    phone.trim() !== '' &&
    selectedMethodId !== null &&
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
    if (!selectedMethodId) {
      showError('Vui lòng chọn phương thức vận chuyển');
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
        customerName: fullName.trim(),
        address: address.trim(),
        phone: phone.trim(),
        note: '',
        paymentMethod: 'COD',
        shippingMethodId: selectedMethodId,
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
      selectedMethodId={selectedMethodId}
      cart={cart}
      cartItems={cartItems}
      loading={loading}
      submitting={submitting}
      isFormValid={isFormValid}
      onFullNameChange={onFullNameChange}
      onAddressChange={onAddressChange}
      onPhoneChange={onPhoneChange}
      onSelectMethod={setSelectedMethodId}
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
