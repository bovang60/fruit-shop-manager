import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePopup } from '../common/popup';
import { getShippingMethods, type ShippingMethodDto } from '../../services/shippingMethodService';
import { createOrder } from '../../services/orderService';
import { getCart, type CartDto } from '../../services/cartService';
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

  // Match userId pattern from Cart.tsx
  const userId = 3;

  useEffect(() => {
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

  const cartItems = cart?.items || [];
  const orderItems = cartItems
    .filter((item) => (item?.productId ?? 0) > 0 && (item?.quantity ?? 0) > 0)
    .map((item) => ({
      productId: item?.productId as number,
      quantity: item?.quantity as number,
    }));

  const isFormValid =
    fullName.trim() !== '' &&
    address.trim() !== '' &&
    phone.trim() !== '' &&
    selectedMethodId !== null &&
    orderItems.length > 0;

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    // Validation
    if (!fullName.trim()) {
      showError('Please enter your full name');
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
    if (!selectedMethodId) {
      showError('Please select a shipping method');
      return;
    }
    if (orderItems.length === 0) {
      showError('Cart is empty');
      return;
    }

    setSubmitting(true);
    try {
      const response = await createOrder({
        userId,
        fullName: fullName.trim(),
        address: address.trim(),
        phone: phone.trim(),
        shippingMethodId: selectedMethodId,
        items: orderItems,
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
      onFullNameChange={setFullName}
      onAddressChange={setAddress}
      onPhoneChange={setPhone}
      onSelectMethod={setSelectedMethodId}
      onSubmit={handleSubmit}
    />
  );
}
