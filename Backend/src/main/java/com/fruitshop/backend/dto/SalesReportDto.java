package com.fruitshop.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class SalesReportDto {
    private Integer totalOrders;       // Tổng số đơn hàng
    private Integer successfulOrders;  // Số đơn hàng thành công
    private BigDecimal totalRevenue;   // Tổng doanh thu thực tế
    private Integer totalFruitsSold;   // Tổng số lượng trái cây đã bán
}