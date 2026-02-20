package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Integer orderItemId;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false, foreignKey = @ForeignKey(name = "FK_order_items_order"))
    private Order order;

    @ManyToOne
    @JoinColumn(name = "fruit_id", nullable = false, foreignKey = @ForeignKey(name = "FK_order_items_fruit"))
    private Fruit fruit;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 15, scale = 0)
    private BigDecimal price;
}
