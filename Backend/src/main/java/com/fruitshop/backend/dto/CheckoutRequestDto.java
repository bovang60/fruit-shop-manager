package com.fruitshop.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;
import lombok.Data;
import java.util.List;

@Data
public class CheckoutRequestDto {
    @NotNull(message = "User ID is required")
    private Integer userId;

    @NotBlank(message = "Receiver name is required")
    private String receiverName;

    @NotBlank(message = "Receiver phone is required")
    private String receiverPhone;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // COD, VNPAY, MOMO

    @NotEmpty(message = "At least one shop is required to checkout")
    @Valid
    private List<ShopCheckoutDto> shops;
}
