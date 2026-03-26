package com.fruitshop.backend.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private String customerName;
    private String phone;
    private String address;
    private String note;
    private String paymentMethod;
    private Integer shippingMethodId;
}
