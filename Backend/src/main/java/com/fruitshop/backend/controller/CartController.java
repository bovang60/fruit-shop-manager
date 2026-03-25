package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.AddToCartRequestDto;
import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.CartDto;
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

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(
            @RequestHeader("userId") Integer userId,
            @Valid @RequestBody AddToCartRequestDto dto) {
        ApiResponse<CartDto> response = cartService.addToCart(userId, dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(
            @RequestHeader("userId") Integer userId) {
        ApiResponse<CartDto> response = cartService.getCart(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/debug")
    public ResponseEntity<java.util.List<java.util.Map<String, Object>>> getCartDebug(
            @RequestHeader("userId") Integer userId) {
        return ResponseEntity.ok(cartService.getCartDebug(userId));
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<CartDto>> updateCartItem(
            @RequestHeader("userId") Integer userId,
            @PathVariable Integer cartItemId,
            @RequestParam Integer quantity) {
        ApiResponse<CartDto> response = cartService.updateCartItem(userId, cartItemId, quantity);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<String>> removeCartItem(
            @RequestHeader("userId") Integer userId,
            @PathVariable Integer cartItemId) {
        ApiResponse<String> response = cartService.removeCartItem(userId, cartItemId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<String>> clearCart(
            @RequestHeader("userId") Integer userId) {
        ApiResponse<String> response = cartService.clearCart(userId);
        return ResponseEntity.ok(response);
    }
}
