package com.fruitshop.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FeedbackRequestDto {
    // Either orderId or cartId must be provided (backward compatible)
    private Integer orderId;

    private Integer cartId;

    @NotNull(message = "Product ID is required")
    private Integer productId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    private String comment;
}

