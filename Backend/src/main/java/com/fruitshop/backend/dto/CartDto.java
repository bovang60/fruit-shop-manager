package com.fruitshop.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CartDto {
    private Integer cartId;
    private Integer userId;
    private Integer totalItems;
    private BigDecimal totalPrice;
    private List<CartItemDto> items;
}
