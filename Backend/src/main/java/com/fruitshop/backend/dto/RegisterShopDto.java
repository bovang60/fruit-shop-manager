package com.fruitshop.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class RegisterShopDto {
    @NotNull(message = "Owner ID is required")
    private Integer ownerId;

    @NotBlank(message = "Shop name is required")
    private String shopName;

    private String description;

    @NotBlank(message = "Address is required")
    private String address;

    
    private String taxCode;

    @NotBlank(message = "Shop type is required")
    private String shopType;

    @NotBlank(message = "Business name is required")
    private String businessName;

    @NotBlank(message = "Business address is required")
    private String businessAddress;

    @NotBlank(message = "Pickup address is required")
    private String pickupAddress;

    @NotNull(message = "At least one shipping method is required")
    private List<Integer> shippingMethodIds;
}

