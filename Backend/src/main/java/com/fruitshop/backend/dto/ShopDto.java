package com.fruitshop.backend.dto;

import com.fruitshop.backend.model.Shop;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ShopDto {
    private Integer shopId;
    private String shopName;
    private Integer ownerId;
    private String ownerName;
    private String ownerEmail;
    private String ownerPhone;
    private String address;
    private String description;
    private Shop.ShopStatus status;
    private String rejectReason;
    private LocalDateTime createdAt;
    private java.time.LocalDate regDate;
    private String taxCode;
    private String shopType;
    private String businessName;
    private String businessAddress;
    private String pickupAddress;
}
