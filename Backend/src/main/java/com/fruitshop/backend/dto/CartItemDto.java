package com.fruitshop.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemDto {
    private Integer cartItemId;
    private Integer productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;
    private String imageUrl;
}
