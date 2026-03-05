package com.fruitshop.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductSummaryDto {
    private Integer productId;
    private String name;
    private BigDecimal price;
    private String imageUrl;
    private List<String> tags;
    private BigDecimal rating;
    private Integer soldCount;
    private Integer viewCount;
    private LocalDateTime createdAt;
}
