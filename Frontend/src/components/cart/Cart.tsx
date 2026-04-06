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
  const [selectedShopIds, setSelectedShopIds] = useState<number[]>([])

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
          showError(response.message || 'Không thể tải thông tin giỏ hàng')
        }
      } catch (error) {
        console.error('Error fetching cart:', error)
        setCart(null)
        showError('Lỗi kết nối khi tải giỏ hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [showError, userId])

  const refreshCart = async () => {
    try {
      const response = await getCart(userId)
      if (response.resultCd === 0 && response.data) {
        setCart(response.data)
        return
      }
      setCart(null)
    } catch (error) {
      console.error('Error refreshing cart:', error)
      setCart(null)
    }
  }

  const syncCartItems = async (
    nextItems: Array<{ productId: number; quantity: number }>
  ) => {
    const clearResponse = await clearCart(userId)
    if (clearResponse.resultCd !== 0) {
      throw new Error(clearResponse.message || 'Không thể xóa giỏ hàng')
    }

    if (nextItems.length === 0) {
      setCart({
        userId,
        totalItems: 0,
        totalPrice: 0,
        shopCarts: [],
      })
      return
    }

    for (const item of nextItems) {
      const addResponse = await addToCart(userId, item.productId, item.quantity)
      if (addResponse.resultCd !== 0) {
        throw new Error(addResponse.message || 'Không thể đồng bộ giỏ hàng')
      }
    }

    await refreshCart()
  }

  const handleUpdateQuantity = async (
    cartItemId: number,
    currentQuantity: number,
    change: number
  ) => {
    const cartItems = cart?.shopCarts?.flatMap(sc => sc.items) || []
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
      showError('Lỗi kết nối khi cập nhật số lượng')
    } finally {
      setUpdatingItemId(null)
    }
  }

  const handleRemoveItem = (cartItemId: number) => {
    showConfirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?', async () => {
      const cartItems = cart?.shopCarts?.flatMap(sc => sc.items) || []
      if (cartItems.length === 0 || updatingItemId !== null || loading) {
        return
      }

      setUpdatingItemId(cartItemId)
      try {
        const nextItems = cartItems
          .filter((item) => item.cartItemId !== cartItemId)
          .map((item) => ({ productId: item.productId, quantity: item.quantity }))

        await syncCartItems(nextItems)
        showNotice('Đã xóa sản phẩm khỏi giỏ hàng')
      } catch (error) {
        console.error('Error removing item:', error)
        showError('Lỗi kết nối khi xóa sản phẩm')
      } finally {
        setUpdatingItemId(null)
      }
    })
  }

  const handleClearCart = () => {
    showConfirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?', async () => {
      setLoading(true)
      try {
        const response = await clearCart(userId)
        if (response.resultCd === 0) {
          showNotice('Đã xóa giỏ hàng thành công')
          setCart(null)
        } else {
          showError(response.message || 'Không thể xóa giỏ hàng')
        }
      } catch (error) {
        console.error('Error clearing cart:', error)
        showError('Lỗi kết nối khi xóa giỏ hàng')
      } finally {
        setLoading(false)
      }
    })
  }

  const handleToggleShop = (shopId: number) => {
    setSelectedShopIds(prev => 
      prev.includes(shopId) ? prev.filter(id => id !== shopId) : [...prev, shopId]
    )
  }

  const handleCheckout = () => {
    const cartsToCheckout = selectedShopIds.length > 0 
      ? cart?.shopCarts?.filter(sc => selectedShopIds.includes(sc.shopId)) || []
      : cart?.shopCarts || []
      
    const cartItems = cartsToCheckout.flatMap(sc => sc.items)

    if (cartItems.length === 0) {
      showError('Bạn chưa chọn sản phẩm nào để thanh toán')
      return
    }

    const finalShopIds = selectedShopIds.length > 0 
      ? selectedShopIds 
      : cart?.shopCarts?.map(sc => sc.shopId) || []

    navigate('/checkout', { state: { selectedShopIds: finalShopIds } })
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
      selectedShopIds={selectedShopIds}
      onToggleShop={handleToggleShop}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      onClearCart={handleClearCart}
      onCheckout={handleCheckout}
      onContinueShopping={handleContinueShopping}
      onViewOrderHistory={handleViewOrderHistory}
    />
  )
}
