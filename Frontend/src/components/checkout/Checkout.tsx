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
      showError('Please login to checkout');
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
          showError(shippingResponse.message || 'Could not load shipping methods');
        }

        if (cartResponse.resultCd === 0 && cartResponse.data) {
          setCart(cartResponse.data);
        } else {
          setCart(null);
          showError(cartResponse.message || 'Could not load cart information');
        }
      } catch (error) {
        console.error('Error loading checkout data:', error);
        showError('Connection error while loading checkout information');
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [showError, userId]);

  const handleNameBlur = () => {
    if (!fullName.trim()) {
      setNameError('Please enter your full name');
    } else if (!/^[\p{L}\s]+$/u.test(fullName.trim())) {
      setNameError('Full name cannot contain numbers or special characters');
    } else {
      setNameError('');
    }
  };

  const handleAddressBlur = () => {
    if (!address.trim()) {
      setAddressError('Please enter your address');
    } else {
      setAddressError('');
    }
  };

  const handlePhoneBlur = () => {
    if (!phone.trim()) {
      setPhoneError('Please enter your phone number');
    } else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(phone.trim())) {
      setPhoneError('Invalid phone number. Must be 10 digits starting with 0');
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
      showError('Please enter your full name');
      return;
    }
    
    // Allow unicode letters and spaces, reject numbers and special characters
    const nameRegex = /^[\p{L}\s]+$/u;
    if (!nameRegex.test(fullName.trim())) {
      showError('Full name cannot contain numbers or special characters');
      return;
    }

    if (!address.trim()) {
      showError('Please enter your address');
      return;
    }

    if (!phone.trim()) {
      showError('Please enter your phone number');
      return;
    }

    // Valid Vietnamese phone number format (03, 05, 07, 08, 09) + 8 digits
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(phone.trim())) {
      showError('Invalid phone number. Must be 10 digits starting with 0');
      return;
    }
    if (!selectedMethodId) {
      showError('Please select a shipping method');
      return;
    }
    if (cartItems.length === 0) {
      showError('Cart is empty');
      return;
    }
    if (!userId) {
      showError('Please login to checkout');
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
        showNotice('Order placed successfully');
        navigate('/order-history');
      } else {
        showError(response.message || 'Could not place order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      showError('Connection error while placing order');
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
