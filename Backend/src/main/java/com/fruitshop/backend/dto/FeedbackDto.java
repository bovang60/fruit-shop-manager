package com.fruitshop.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FeedbackDto {
    private Integer feedbackId;
    private Integer orderId;
    private String userName;
    private Integer productId;
    private String productName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
