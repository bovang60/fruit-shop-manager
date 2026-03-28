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
    private double cancellationRate;
    private BigDecimal totalRevenue;
    
    private long totalActiveSellers;
    private long pendingShopApprovals;

    // Charts & Lists
    private List<DailyOrderDto> ordersLast7Days;
    private List<TopSellerDto> topSellers;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class DailyOrderDto {
        private Object date;
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
}
