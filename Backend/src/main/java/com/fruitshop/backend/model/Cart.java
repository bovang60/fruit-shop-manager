package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "carts", indexes = {
    @Index(name = "idx_cart_customer_status", columnList = "customer_id, status")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_cart_customer_shop_status", columnNames = {"customer_id", "shop_id", "status"})
})
public class Cart {

    // ========== Status Constants ==========
    public static final int STATUS_IN_CART = -2;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Integer cartId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false, foreignKey = @ForeignKey(name = "FK_carts_shop"))
    private Shop shop;

    @Column(name = "status", nullable = false)
    private Integer status = STATUS_IN_CART;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CartItem> items = new ArrayList<>();

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
