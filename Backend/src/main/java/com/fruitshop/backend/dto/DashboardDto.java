package com.fruitshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {
    // KPI Cards
    private long activeUsers;
    private long totalOrders;
    private double conversionRate;
    private BigDecimal totalRevenue;
    
    private long totalActiveSellers;
    private long pendingShopApprovals;

    // Charts & Lists
    private List<MonthlyOrderDto> ordersByMonth;
    private List<TopSellerDto> topSellers;
    private List<MonthlyPerformanceDto> shopPerformanceMonthly;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class MonthlyOrderDto {
        private String month;
        private long orderCount;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class TopSellerDto {
        private String shopName;
        private long totalUnitsSold;
        private BigDecimal totalRevenue;
        private String status;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class MonthlyPerformanceDto {
        private String month;
        private long totalOrders;
        private long canceledOrders;
        private BigDecimal totalRevenue;
    }
}
