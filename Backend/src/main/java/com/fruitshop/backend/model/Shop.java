package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "shops")
public class Shop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shop_id")
    private Integer shopId;

    @Column(name = "shop_name", nullable = false)
    private String shopName;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false, foreignKey = @ForeignKey(name = "FK_shops_owner"))
    private User owner;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Enumerated(EnumType.STRING)
    private ShopStatus status = ShopStatus.PENDING;

    @Column(name = "reject_reason", columnDefinition = "NVARCHAR(MAX)")
    private String rejectReason;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "reg_date")
    private java.time.LocalDate regDate;

    @Column(name = "address", length = 200)
    private String address;


    @Column(name = "tax_code", length = 20)
    private String taxCode;

    @Column(name = "shop_type", columnDefinition = "NVARCHAR(50)")
    private String shopType;

    @Column(name = "business_name", columnDefinition = "NVARCHAR(500)")
    private String businessName;

    @Column(name = "business_address", columnDefinition = "NVARCHAR(500)")
    private String businessAddress;

    @Column(name = "pickup_address", columnDefinition = "NVARCHAR(500)")
    private String pickupAddress;


    public enum ShopStatus {
        PENDING, APPROVED, REJECTED, SUSPENDED
    }
}
