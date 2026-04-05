package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.*;
import com.fruitshop.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // ===== CUSTOMER: Add to Cart =====
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(
            @Valid @RequestBody AddToCartRequestDto dto) {
        ApiResponse<CartDto> response = cartService.addToCart(dto);
        return ResponseEntity.ok(response);
    }

    // ===== CUSTOMER: Get Cart (grouped by shop) =====
    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(
            @RequestHeader("userId") Integer userId) {
        ApiResponse<CartDto> response = cartService.getCart(userId);
        return ResponseEntity.ok(response);
    }

    // ===== CUSTOMER: Update Cart Item Quantity =====
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<CartDto>> updateCartItem(
            @RequestHeader(name = "userId") Integer userId,
            @PathVariable(name = "cartItemId") Integer cartItemId,
            @RequestParam(name = "quantity") Integer quantity) {
        ApiResponse<CartDto> response = cartService.updateCartItem(userId, cartItemId, quantity);
        return ResponseEntity.ok(response);
    }

    // ===== CUSTOMER: Remove Cart Item =====
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<String>> removeCartItem(
            @RequestHeader(name = "userId") Integer userId,
            @PathVariable(name = "cartItemId") Integer cartItemId) {
        ApiResponse<String> response = cartService.removeCartItem(userId, cartItemId);
        return ResponseEntity.ok(response);
    }

    // ===== CUSTOMER: Clear All Carts =====
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<String>> clearCart(
            @RequestHeader("userId") Integer userId) {
        ApiResponse<String> response = cartService.clearCart(userId);
        return ResponseEntity.ok(response);
    }
}
