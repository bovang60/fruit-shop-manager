package com.fruitshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewOrderNotificationDto {
    private Integer unreadCount;
    private LocalDateTime latestEventAt;
    private List<OrderSummary> orders;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderSummary {
        private Integer orderId;
        private String receiverName;
        private BigDecimal totalAmount;
        private String status;
        private LocalDateTime createdAt;
    }
}
