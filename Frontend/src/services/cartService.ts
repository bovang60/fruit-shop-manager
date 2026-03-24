import { callApiWithMethod, type ApiResponse } from '../utils/apiClient';

// Types to match CartData and CartItem in Cart.tsx
export interface CartItemDto {
  cartItemId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl: string;
}

export interface CartDto {
  cartId: number;
  userId: number;
  totalItems: number;
  totalPrice: number;
  items: CartItemDto[];
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

/**
 * Add a product to the user's cart
 * 
 * Endpoint: POST /api/cart/{userId}/add
 */
export async function addToCart(
  userId: number,
  productId: number,
  quantity: number
): Promise<ApiResponse<CartDto>> {
  try {
    return await callApiWithMethod<AddToCartRequest, ApiResponse<CartDto>>(
      'POST',
      `/api/cart/${userId}/add`,
      { productId, quantity }
    );
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      resultCd: 1,
      message: 'Failed to add item to cart. Please try again.',
      data: null
    };
  }
}

/**
 * Get the current user's cart
 * 
 * Endpoint: GET /api/cart/{userId}
 */
export async function getCart(userId: number): Promise<ApiResponse<CartDto>> {
  try {
    return await callApiWithMethod<never, ApiResponse<CartDto>>(
      'GET',
      `/api/cart/${userId}`
    );
  } catch (error) {
    console.error('Error fetching cart:', error);
    return {
      resultCd: 1,
      message: 'Failed to fetch cart. Please try again.',
      data: null
    };
  }
}

/**
 * Update the quantity of a cart item
 * 
 * Endpoint: PUT /api/cart/{userId}/items/{cartItemId}?quantity={quantity}
 */
export async function updateCartItem(
  userId: number,
  cartItemId: number,
  quantity: number
): Promise<ApiResponse<CartDto>> {
  try {
    return await callApiWithMethod<never, ApiResponse<CartDto>>(
      'PUT',
      `/api/cart/${userId}/items/${cartItemId}?quantity=${quantity}`
    );
  } catch (error) {
    console.error('Error updating cart item:', error);
    return {
      resultCd: 1,
      message: 'Failed to update item quantity.',
      data: null
    };
  }
}

/**
 * Remove an item from the cart
 * 
 * Endpoint: DELETE /api/cart/{userId}/items/{cartItemId}
 */
export async function removeCartItem(
  userId: number,
  cartItemId: number
): Promise<ApiResponse<null>> {
  try {
    return await callApiWithMethod<never, ApiResponse<null>>(
      'DELETE',
      `/api/cart/${userId}/items/${cartItemId}`
    );
  } catch (error) {
    console.error('Error removing cart item:', error);
    return {
      resultCd: 1,
      message: 'Failed to remove item.',
      data: null
    };
  }
}

/**
 * Clear all items from the cart
 * 
 * Endpoint: DELETE /api/cart/{userId}/clear
 */
export async function clearCart(userId: number): Promise<ApiResponse<null>> {
  try {
    return await callApiWithMethod<never, ApiResponse<null>>(
      'DELETE',
      `/api/cart/${userId}/clear`
    );
  } catch (error) {
    console.error('Error clearing cart:', error);
    return {
      resultCd: 1,
      message: 'Failed to clear cart.',
      data: null
    };
  }
}
