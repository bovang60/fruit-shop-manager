package com.fruitshop.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductDetailDto {
    private Integer productId;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String imageUrl;
    private String origin;
    private Boolean isOrganic;
    private Integer stock;
    private String unit;
    private BigDecimal rating;
    private Integer reviewCount;
    private Integer discount;
    private Integer soldCount;
    private Integer viewCount;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> tags;
    private Boolean isFavorite;

    // Category info
    private Integer categoryId;
    private String categoryName;

    // Shop info
    private Integer shopId;
    private String shopName;
}
