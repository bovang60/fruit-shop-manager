package com.fruitshop.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDto {
    private Integer productId;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String imageUrl;
    private String category;
    private String origin;
    private Boolean isOrganic;
    private Integer stock;
    private String unit;
    private BigDecimal rating;
    private Integer reviewCount;
    private Integer discount;
    private Integer shopId;
    private String shopName;
    private List<String> tags;
    private Boolean isFavorite;
}
