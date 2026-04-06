package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.SellerOrderDto;
import com.fruitshop.backend.model.Order;
import com.fruitshop.backend.model.OrderVoucher;
import com.fruitshop.backend.repository.OrderVoucherRepository;
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
    private final OrderVoucherRepository orderVoucherRepository;

    // Use Case: Manage Orders - Lấy danh sách đơn hàng của Shop
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<ApiResponse<List<SellerOrderDto>>> getAllOrders(@PathVariable Integer shopId) {
        try {
            List<Order> orders = orderService.getOrdersByShop(shopId);
            List<SellerOrderDto> orderDtos = orders.stream()
                    .map(this::toDto)
                    .toList();
            return ResponseEntity.ok(ApiResponse.success("Tải danh sách đơn hàng thành công", orderDtos));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    // Xem chi tiết một đơn hàng
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<SellerOrderDto>> getOrderById(@PathVariable Integer orderId) {
        try {
            Order order = orderService.getOrderDetail(orderId);
            return ResponseEntity.ok(ApiResponse.success("Tải chi tiết đơn hàng thành công", toDto(order)));
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
                .shippingAddress(order.getShippingAddress())
                .note(order.getNote())
                .subTotal(order.getSubTotal())
                .shippingFee(order.getShippingFee() == null ? BigDecimal.ZERO : order.getShippingFee())
                .discountValue(resolveDiscountValue(order.getOrderId()))
                .paymentMethod(order.getTransaction() != null && order.getTransaction().getPaymentMethod() != null
                        ? order.getTransaction().getPaymentMethod().name()
                        : null)
                .paymentStatus(order.getTransaction() != null && order.getTransaction().getPaymentStatus() != null
                        ? order.getTransaction().getPaymentStatus().name()
                        : null)
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }

    private BigDecimal resolveDiscountValue(Integer orderId) {
        List<OrderVoucher> orderVouchers = orderVoucherRepository.findByOrder_OrderId(orderId);
        if (orderVouchers == null || orderVouchers.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal discount = orderVouchers.get(0).getAppliedValue();
        return discount == null ? BigDecimal.ZERO : discount;
    }
}
