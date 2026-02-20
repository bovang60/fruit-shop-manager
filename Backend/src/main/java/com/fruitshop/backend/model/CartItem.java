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
    @JoinColumn(name = "cart_id", nullable = false, foreignKey = @ForeignKey(name = "FK_cart_items_cart"))
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "fruit_id", nullable = false, foreignKey = @ForeignKey(name = "FK_cart_items_fruit"))
    private Fruit fruit;

    @Column(nullable = false)
    private Integer quantity;
}
