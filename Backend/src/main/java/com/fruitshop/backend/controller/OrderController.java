package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.OrderRequest;
import com.fruitshop.backend.dto.OrderResponse;
import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.CheckoutRequestDto;
import com.fruitshop.backend.dto.OrderDto;
import com.fruitshop.backend.dto.OrderStatusDto;
import com.fruitshop.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;

    // ===== USER: Create Order =====
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @RequestHeader("userId") Integer userId,
            @Valid @RequestBody OrderRequest request) {
        ApiResponse<OrderResponse> response = orderService.createOrder(userId, request);
        return ResponseEntity.ok(response);
    }

    // ===== USER: Checkout (legacy) =====
    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<List<OrderDto>>> checkout(
            @Valid @RequestBody CheckoutRequestDto dto) {
        ApiResponse<List<OrderDto>> response = orderService.checkout(dto);
        return ResponseEntity.ok(response);
    }

    // ===== USER: Get Order History =====
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getOrderHistory(
            @PathVariable("userId") Integer userId) {
        log.info("GET /api/orders/user/{} - Fetching order history", userId);
        ApiResponse<List<OrderDto>> response = orderService.getOrderHistory(userId);
        return ResponseEntity.ok(response);
    }

    // ===== USER: Get Order Detail =====
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderDetail(
            @PathVariable("orderId") Integer orderId,
            @RequestParam("userId") Integer userId) {
        ApiResponse<OrderDto> response = orderService.getOrderDetail(orderId, userId);
        return ResponseEntity.ok(response);
    }

    // ===== USER: Cancel Order (only PENDING) =====
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<String>> cancelOrder(
            @PathVariable("orderId") Integer orderId,
            @RequestParam("userId") Integer userId) {
        ApiResponse<String> response = orderService.cancelOrder(orderId, userId);
        return ResponseEntity.ok(response);
    }

    // ===== SELLER: Confirm Order (PENDING -> SHIPPING) =====
    @PutMapping("/{orderId}/confirm")
    public ResponseEntity<ApiResponse<String>> confirmOrder(
            @PathVariable("orderId") Integer orderId,
            @RequestHeader("userId") Integer userId) {
        ApiResponse<String> response = orderService.confirmOrder(orderId, userId);
        return ResponseEntity.ok(response);
    }

    // ===== SELLER: Update Status (SHIPPING -> DELIVERED) =====
    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<String>> updateOrderStatus(
            @PathVariable("orderId") Integer orderId,
            @RequestHeader("userId") Integer userId,
            @Valid @RequestBody OrderStatusDto dto) {
        ApiResponse<String> response = orderService.updateOrderStatus(orderId, dto, userId);
        return ResponseEntity.ok(response);
    }

    // ===== USER: Confirm Received (SHIPPING -> COMPLETED) =====
    @PutMapping("/{orderId}/complete")
    public ResponseEntity<ApiResponse<String>> completeOrder(
            @PathVariable("orderId") Integer orderId,
            @RequestParam("userId") Integer userId) {
        ApiResponse<String> response = orderService.completeOrder(orderId, userId);
        return ResponseEntity.ok(response);
    }
}
