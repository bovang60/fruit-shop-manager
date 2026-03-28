package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.NewOrderNotificationDto;
import com.fruitshop.backend.service.impl.SellerNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/seller/notifications")
@RequiredArgsConstructor
public class SellerNotificationController {

    private final SellerNotificationService sellerNotificationService;

    /**
     * Polling endpoint cho FE gọi mỗi 5s để lấy đơn PENDING mới của shop.
     *
     * @param shopId ID của shop
     * @param since  Thời điểm đồng bộ lần cuối (ISO format, e.g. 2026-03-29T10:00:00)
     * @param limit  Số đơn tối đa trả về (default: 10)
     */
    @GetMapping("/orders/new")
    public ResponseEntity<ApiResponse<NewOrderNotificationDto>> getNewOrders(
            @RequestParam Integer shopId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(sellerNotificationService.getNewOrders(shopId, since, limit));
    }
}
