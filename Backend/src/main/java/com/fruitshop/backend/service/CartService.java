package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.*;

import java.util.List;
import java.util.Map;

public interface CartService {

    /** Customer adds a product to cart (auto-groups by shop) */
    ApiResponse<CartDto> addToCart(AddToCartRequestDto dto);

    /** Get all in-cart items for a customer, grouped by shop */
    ApiResponse<CartDto> getCart(Integer userId);

    /** Customer updates quantity of a cart item */
    ApiResponse<CartDto> updateCartItem(Integer userId, Integer cartItemId, Integer quantity);

    /** Customer removes a cart item */
    ApiResponse<String> removeCartItem(Integer userId, Integer cartItemId);

    /** Customer clears all carts */
    ApiResponse<String> clearCart(Integer userId);

    /** Debug endpoint (DEV only) */
    List<Map<String, Object>> getCartDebug(Integer userId);
}
