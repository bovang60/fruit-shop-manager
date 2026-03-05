package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.SalesReportDto;
import com.fruitshop.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    private final OrderService orderService;

    /**
     * Use Case: View Sale Report
     * Lấy dữ liệu tổng quan về tình hình kinh doanh của Shop
     */
    @GetMapping("/reports/{shopId}")
    public ResponseEntity<SalesReportDto> getSalesReport(@PathVariable Integer shopId) {
        return ResponseEntity.ok(orderService.getShopSalesReport(shopId));
    }
}
