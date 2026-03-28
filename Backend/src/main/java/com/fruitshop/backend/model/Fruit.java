package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "fruits")
public class Fruit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fruit_id")
    private Integer fruitId;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false, foreignKey = @ForeignKey(name = "FK_fruits_shop"))
    private Shop shop;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false, foreignKey = @ForeignKey(name = "FK_fruits_category"))
    private Category category;

    @Column(name = "fruit_name", nullable = false)
    private String fruitName;

    @Column(nullable = false, precision = 15, scale = 0)
    private BigDecimal price;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Enumerated(EnumType.STRING)
    private FruitStatus status = FruitStatus.AVAILABLE;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum FruitStatus {
        AVAILABLE, OUT_OF_STOCK, HIDDEN, DISCONTINUED
    }
}
