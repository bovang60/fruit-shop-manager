package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.SellerOrderDto;
import com.fruitshop.backend.model.Order;
import com.fruitshop.backend.service.OrderService;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seller/orders")
@RequiredArgsConstructor
public class SellerOrderController {

    private final OrderService orderService;

    // Use Case: Manage Orders - Lấy danh sách đơn hàng của Shop
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<ApiResponse<List<SellerOrderDto>>> getAllOrders(@PathVariable Integer shopId) {
        try {
            List<Order> orders = orderService.getOrdersByShop(shopId);
            List<SellerOrderDto> orderDtos = orders.stream()
                    .map(this::toDto)
                    .toList();
            return ResponseEntity.ok(ApiResponse.success(orderDtos));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    // Xem chi tiết một đơn hàng
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<SellerOrderDto>> getOrderById(@PathVariable Integer orderId) {
        try {
            Order order = orderService.getOrderDetail(orderId);
            return ResponseEntity.ok(ApiResponse.success(toDto(order)));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    // Use Case: Update Order Status - Cập nhật trạng thái đơn hàng
    // Ví dụ: PENDING -> SHIPPED
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<SellerOrderDto>> updateStatus(
            @PathVariable Integer orderId,
            @RequestParam Order.OrderStatus status) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(ApiResponse.success(
                    "Cập nhật trạng thái đơn hàng thành công!",
                    toDto(updatedOrder)
            ));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    private SellerOrderDto toDto(Order order) {
        if (order == null) {
            return null;
        }
        return SellerOrderDto.builder()
                .orderId(order.getOrderId())
                .receiverName(order.getReceiverName())
                .receiverPhone(order.getReceiverPhone())
                .subTotal(order.getSubTotal())
                .shippingFee(order.getShippingFee() == null ? BigDecimal.ZERO : order.getShippingFee())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
