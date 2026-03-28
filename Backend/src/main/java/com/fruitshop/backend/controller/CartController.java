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

    // ===== CUSTOMER: Get Cart (pending items) =====
    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(
            @RequestHeader("userId") Integer userId) {
        ApiResponse<CartDto> response = cartService.getCart(userId);
        return ResponseEntity.ok(response);
    }

    // ===== CUSTOMER: Update Cart Item Quantity =====
    @PutMapping("/items/{cartId}")
    public ResponseEntity<ApiResponse<CartDto>> updateCartItem(
            @RequestHeader(name = "userId") Integer userId,
            @PathVariable(name = "cartId") Integer cartId,
            @RequestParam(name = "quantity") Integer quantity) {
        ApiResponse<CartDto> response = cartService.updateCartItem(userId, cartId, quantity);
        return ResponseEntity.ok(response);
    }

    // ===== CUSTOMER: Remove Cart Item =====
    @DeleteMapping("/items/{cartId}")
    public ResponseEntity<ApiResponse<String>> removeCartItem(
            @RequestHeader(name = "userId") Integer userId,
            @PathVariable(name = "cartId") Integer cartId) {
        ApiResponse<String> response = cartService.removeCartItem(userId, cartId);
        return ResponseEntity.ok(response);
    }

    // ===== CUSTOMER: Clear All Pending Items =====
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<String>> clearCart(
            @RequestHeader("userId") Integer userId) {
        ApiResponse<String> response = cartService.clearCart(userId);
        return ResponseEntity.ok(response);
    }

 // Removed order lifecycle methods to enforce single responsibility
}
