package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.AddToCartRequestDto;
import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.CartDto;

public interface CartService {
    ApiResponse<CartDto> addToCart(Integer userId, AddToCartRequestDto dto);
    ApiResponse<CartDto> getCart(Integer userId);
    ApiResponse<CartDto> updateCartItem(Integer userId, Integer cartItemId, Integer quantity);
    ApiResponse<String> removeCartItem(Integer userId, Integer cartItemId);
    ApiResponse<String> clearCart(Integer userId);
    java.util.List<java.util.Map<String, Object>> getCartDebug(Integer userId);
}
