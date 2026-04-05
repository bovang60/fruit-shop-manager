package com.fruitshop.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDto {
    private Integer orderId;
    private Integer shopId;
    private String shopName;
    private String receiverName;
    private String receiverPhone;
    private String shippingAddress;
    private BigDecimal subTotal;
    private BigDecimal discountValue;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private String note;
    private LocalDateTime createdAt;
    private List<OrderItemDto> items;
}
