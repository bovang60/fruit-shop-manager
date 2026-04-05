package com.fruitshop.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ShopCartDto {
    private Integer cartId;
    private Integer shopId;
    private String shopName;
    private BigDecimal shopSubtotal;
    private List<CartItemDto> items;
}
