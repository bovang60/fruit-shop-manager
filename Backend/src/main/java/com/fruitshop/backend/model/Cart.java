package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "carts", indexes = {
    @Index(name = "idx_cart_customer_status", columnList = "customer_id, status"),
    @Index(name = "idx_cart_customer_product_status", columnList = "customer_id, product_id, status"),
    @Index(name = "idx_cart_seller_status", columnList = "sheller_id, status")
})
public class Cart {

    // ========== Status Constants ==========
    public static final int STATUS_IN_CART = -2;
    public static final int STATUS_PENDING = 0;
    public static final int STATUS_CONFIRMED = 1;
    public static final int STATUS_COMPLETED = 2;
    public static final int STATUS_CANCELLED = -1;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Integer cartId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sheller_id", nullable = false,
            foreignKey = @ForeignKey(name = "FKb5o626f86h46m4s7ms6ginnop"))
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "status", nullable = false)
    private Integer status = STATUS_PENDING;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
