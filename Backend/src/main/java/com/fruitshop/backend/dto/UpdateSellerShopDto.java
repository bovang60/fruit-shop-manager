package com.fruitshop.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateSellerShopDto {
    @NotBlank(message = "Tên cửa hàng không được để trống")
    @Size(max = 255, message = "Tên cửa hàng tối đa 255 ký tự")
    private String shopName;

    @Size(max = 1000, message = "Mô tả tối đa 1000 ký tự")
    private String description;

    @NotBlank(message = "Địa chỉ cửa hàng không được để trống")
    @Size(max = 200, message = "Địa chỉ tối đa 200 ký tự")
    private String address;

    @Size(max = 50, message = "Loại hình tối đa 50 ký tự")
    private String shopType;

    @Size(max = 500, message = "Tên cơ sở kinh doanh tối đa 500 ký tự")
    private String businessName;

    @Size(max = 500, message = "Địa chỉ kinh doanh tối đa 500 ký tự")
    private String businessAddress;

    @Size(max = 500, message = "Địa chỉ lấy hàng tối đa 500 ký tự")
    private String pickupAddress;
}
