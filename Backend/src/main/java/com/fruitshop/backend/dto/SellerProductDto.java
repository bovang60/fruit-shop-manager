package com.fruitshop.backend.dto;

import com.fruitshop.backend.model.Product;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerProductDto {
    private Integer productId;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Boolean isActive;
    private String imageUrl;
    private Integer categoryId;
    private Integer discount;
    private BigDecimal originalPrice;
    private String unit;
    private Product.Origin origin;
    private Boolean isOrganic;
}
