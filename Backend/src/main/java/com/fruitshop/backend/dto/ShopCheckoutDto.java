package com.fruitshop.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ShopCheckoutDto {
    @NotNull(message = "Shop ID is required")
    private Integer shopId;

    @NotNull(message = "Shipping method ID is required for each shop")
    private Integer shippingMethodId;

    private String note;

    private Integer voucherId;
}
