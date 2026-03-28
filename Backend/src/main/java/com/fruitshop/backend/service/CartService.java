package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.*;

import java.util.List;
import java.util.Map;

public interface CartService {

    // ========== New Cart-based flow ==========

    /** Customer adds a product to cart (creates Cart record with status=0) */
    ApiResponse<CartDto> addToCart(AddToCartRequestDto dto);

    /** Get all pending cart items for a customer */
    ApiResponse<CartDto> getCart(Integer userId);

    /** Customer updates quantity of a pending cart item */
    ApiResponse<CartDto> updateCartItem(Integer userId, Integer cartItemId, Integer quantity);

    /** Customer removes a pending cart item */
    ApiResponse<String> removeCartItem(Integer userId, Integer cartItemId);

    /** Customer clears all pending cart items */
    ApiResponse<String> clearCart(Integer userId);

    // Removed order lifecycle methods (checkout, cancel, confirm, complete, history) to enforce single responsibility

    /** Debug endpoint (DEV only) */
    List<Map<String, Object>> getCartDebug(Integer userId);
}
