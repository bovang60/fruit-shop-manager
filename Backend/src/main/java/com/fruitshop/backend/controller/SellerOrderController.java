package com.fruitshop.backend.controller;

import com.fruitshop.backend.model.Order;
import com.fruitshop.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/seller/orders")
@RequiredArgsConstructor
@CrossOrigin("*")
public class SellerOrderController {

    private final OrderService orderService;

    // Use Case: Manage Orders - Lấy danh sách đơn hàng của Shop
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<Order>> getAllOrders(@PathVariable Integer shopId) {
        return ResponseEntity.ok(orderService.getOrdersByShop(shopId));
    }

    // Xem chi tiết một đơn hàng
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Integer orderId) {
        return ResponseEntity.ok(orderService.getOrderDetail(orderId));
    }

    // Use Case: Update Order Status - Cập nhật trạng thái đơn hàng
    // Ví dụ: PENDING -> SHIPPED
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Integer orderId,
            @RequestParam Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}