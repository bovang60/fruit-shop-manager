import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePopup } from '../common/popup';

// Types (typically these would be imported from a central types file)
interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl: string;
}

interface CartData {
  cartId: number;
  userId: number;
  totalItems: number;
  totalPrice: number;
  items: CartItem[];
}

import CartView from './CartView';
// Assume these exist in your services
import { getCart, updateCartItem, removeCartItem, clearCart } from '../../services/cartService';

export default function Cart() {
  const navigate = useNavigate();
  const { showNotice, showError, showConfirm } = usePopup();

  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  // Mocking userId for now. typically this would come from an auth context or store
  const userId = 3; 

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await getCart(userId);
      if (response.resultCd === 0 && response.data) {
        setCart(response.data);
      } else {
        showError(response.message || 'Could not load cart information');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      showError('Connection error while loading cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const handleUpdateQuantity = async (cartItemId: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    setUpdatingItemId(cartItemId);
    try {
      const response = await updateCartItem(userId, cartItemId, newQuantity);
      if (response.resultCd === 0 && response.data) {
        setCart(response.data);
      } else {
        showError(response.message || 'Could not update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showError('Connection error while updating quantity');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = (cartItemId: number) => {
    showConfirm('Are you sure you want to remove this product from the cart?', async () => {
      setUpdatingItemId(cartItemId);
      try {
        const response = await removeCartItem(userId, cartItemId);
        if (response.resultCd === 0) {
          showNotice('Product removed from cart');
          fetchCart(); // Refresh cart to get the latest state
        } else {
          showError(response.message || 'Could not remove product');
        }
      } catch (error) {
        console.error('Error removing item:', error);
        showError('Connection error while removing product');
      } finally {
        setUpdatingItemId(null);
      }
    });
  };

  const handleClearCart = () => {
    showConfirm('Are you sure you want to clear the entire cart?', async () => {
      setLoading(true);
      try {
        const response = await clearCart(userId);
        if (response.resultCd === 0) {
          showNotice('Cart cleared successfully');
          setCart(null);
        } else {
          showError(response.message || 'Could not clear cart');
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
        showError('Connection error while clearing cart');
      } finally {
        setLoading(false);
      }
    });
  };

  const handleCheckout = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      showError('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  return (
    <CartView
      cart={cart}
      loading={loading}
      updatingItemId={updatingItemId}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      onClearCart={handleClearCart}
      onCheckout={handleCheckout}
      onContinueShopping={handleContinueShopping}
    />
  );
}
