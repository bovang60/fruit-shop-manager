package com.fruitshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistResponseDto {
    private Integer wishlistId;
    private Integer productId;
    private String productName;
    private BigDecimal price;
    private String imageUrl;
    private String category;
    private Integer shopId;
    private String shopName;
    private LocalDateTime addedAt;
}
