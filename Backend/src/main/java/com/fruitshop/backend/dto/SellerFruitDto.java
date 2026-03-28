package com.fruitshop.backend.dto;

import com.fruitshop.backend.model.Fruit;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerFruitDto {
    private Integer fruitId;
    private String fruitName;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private Fruit.FruitStatus status;
    private String imageUrl;
    private Integer categoryId;
}
