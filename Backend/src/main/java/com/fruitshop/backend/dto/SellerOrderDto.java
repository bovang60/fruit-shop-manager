package com.fruitshop.backend.dto;

import com.fruitshop.backend.model.Order;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerOrderDto {
    private Integer orderId;
    private String receiverName;
    private String receiverPhone;
    private String shippingAddress;
    private String note;
    private BigDecimal subTotal;
    private BigDecimal shippingFee;
    private String paymentMethod;
    private String paymentStatus;
    private Order.OrderStatus status;
    private LocalDateTime createdAt;
}
