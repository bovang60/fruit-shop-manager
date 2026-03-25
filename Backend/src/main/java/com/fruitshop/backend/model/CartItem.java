package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id")
    private Integer cartItemId;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "fruit_id")
    private Integer legacyFruitId;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false, foreignKey = @ForeignKey(name = "FK_cart_items_cart"))
    private Cart cart;

    @Column(nullable = false)
    private Integer quantity;

    @PrePersist
    @PreUpdate
    private void syncLegacyFruitId() {
        if (product != null && product.getProductId() != null) {
            this.legacyFruitId = product.getProductId();
        }
    }
}
