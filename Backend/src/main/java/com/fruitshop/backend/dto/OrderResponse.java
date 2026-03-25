package com.fruitshop.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderResponse {
    private Integer orderId;
    private BigDecimal totalAmount;
    private BigDecimal shippingFee;
    private String status;
    private LocalDateTime createdAt;
}
