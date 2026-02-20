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

    @OneToMany(mappedBy = "shop")
    private java.util.List<ShopDocument> documents;

    public enum ShopStatus {
        PENDING, APPROVED, REJECTED
    }
}
