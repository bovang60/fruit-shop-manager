import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePopup } from '../common/popup'
import CartView from './CartView'
import { getUserFromStorage } from '../../services/authService'
import {
  addToCart,
  clearCart,
  getCart,
  type CartDto,
} from '../../services/cartService'

export default function Cart() {
  const navigate = useNavigate()
  const { showNotice, showError, showConfirm } = usePopup()
  const [cart, setCart] = useState<CartDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null)

  const user = getUserFromStorage()
  const userId = user?.userId || 0

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) {
        setLoading(false)
        return // handled gracefully, or we could redirect
      }
      setLoading(true)
      try {
        const response = await getCart(userId)
        if (response.resultCd === 0 && response.data) {
          setCart(response.data)
        } else {
          setCart(null)
          showError(response.message || 'Could not load cart information')
        }
      } catch (error) {
        console.error('Error fetching cart:', error)
        setCart(null)
        showError('Connection error while loading cart')
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [showError, userId])

  const refreshCart = async () => {
    const response = await getCart(userId)
    if (response.resultCd === 0 && response.data) {
      setCart(response.data)
      return
    }

    setCart(null)
  }

  const syncCartItems = async (
    nextItems: Array<{ productId: number; quantity: number }>
  ) => {
    const clearResponse = await clearCart(userId)
    if (clearResponse.resultCd !== 0) {
      throw new Error(clearResponse.message || 'Could not reset cart')
    }

    if (nextItems.length === 0) {
      setCart({
        cartId: cart?.cartId ?? 0,
        userId,
        totalItems: 0,
        totalPrice: 0,
        items: [],
      })
      return
    }

    for (const item of nextItems) {
      const addResponse = await addToCart(userId, item.productId, item.quantity)
      if (addResponse.resultCd !== 0) {
        throw new Error(addResponse.message || 'Could not sync cart')
      }
    }

    await refreshCart()
  }

  const handleUpdateQuantity = async (
    cartItemId: number,
    currentQuantity: number,
    change: number
  ) => {
    const cartItems = cart?.items || []
    const newQuantity = currentQuantity + change
    if (newQuantity < 1 || updatingItemId !== null || loading || cartItems.length === 0) {
      return
    }

    const nextItems = cartItems.map((item) =>
      item.cartItemId === cartItemId ? { productId: item.productId, quantity: newQuantity } : { productId: item.productId, quantity: item.quantity }
    )

    setUpdatingItemId(cartItemId)
    try {
      await syncCartItems(nextItems)
    } catch (error) {
      console.error('Error updating quantity:', error)
      showError('Connection error while updating quantity')
    } finally {
      setUpdatingItemId(null)
    }
  }

  const handleRemoveItem = (cartItemId: number) => {
    showConfirm('Are you sure you want to remove this product from the cart?', async () => {
      const cartItems = cart?.items || []
      if (cartItems.length === 0 || updatingItemId !== null || loading) {
        return
      }

      setUpdatingItemId(cartItemId)
      try {
        const nextItems = cartItems
          .filter((item) => item.cartItemId !== cartItemId)
          .map((item) => ({ productId: item.productId, quantity: item.quantity }))

        await syncCartItems(nextItems)
        showNotice('Product removed from cart')
      } catch (error) {
        console.error('Error removing item:', error)
        showError('Connection error while removing product')
      } finally {
        setUpdatingItemId(null)
      }
    })
  }

  const handleClearCart = () => {
    showConfirm('Are you sure you want to clear the entire cart?', async () => {
      setLoading(true)
      try {
        const response = await clearCart(userId)
        if (response.resultCd === 0) {
          showNotice('Cart cleared successfully')
          setCart(null)
        } else {
          showError(response.message || 'Could not clear cart')
        }
      } catch (error) {
        console.error('Error clearing cart:', error)
        showError('Connection error while clearing cart')
      } finally {
        setLoading(false)
      }
    })
  }

  const handleCheckout = () => {
    if (!cart?.items || cart.items.length === 0) {
      showError('Your cart is empty')
      return
    }

    navigate('/checkout')
  }

  const handleContinueShopping = () => {
    navigate('/home')
  }

  const handleViewOrderHistory = () => {
    navigate('/order-history')
  }

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
      onViewOrderHistory={handleViewOrderHistory}
    />
  )
}
