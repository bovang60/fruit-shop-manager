package com.fruitshop.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderStatusDto {
    @NotBlank(message = "Status cannot be blank")
    private String status;
}
