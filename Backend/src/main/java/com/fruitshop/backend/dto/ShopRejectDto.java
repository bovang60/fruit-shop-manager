package com.fruitshop.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ShopRejectDto {
    @Size(min = 3, max = 255, message = "Reason length must be between 3 and 255 characters")
    private String reason;
}
