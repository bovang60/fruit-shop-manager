package com.fruitshop.backend.dto;

import lombok.Data;

@Data
public class FeedbackRequestDto {
    private Integer orderId;
    private Integer productId;
    private Integer rating;
    private String comment;
}
