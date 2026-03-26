package com.fruitshop.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ShippingMethodDto {
    private Integer methodId;
    private String methodName;
    private String description;
    private BigDecimal fixedFee;
    private Boolean isAvailable;
}
