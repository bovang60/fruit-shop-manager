package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer productId;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(optional = false)
    @JoinColumn(name = "shop_id", nullable = false, foreignKey = @ForeignKey(name = "FK_products_shop"))
    private Shop shop;

    @Column(length = 255)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    private Origin origin = Origin.LOCAL;

    @Column(name = "is_organic")
    private Boolean isOrganic = false;

    @Column
    private Integer stock = 0;

    @Column(length = 50)
    private String unit = "kg";

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @Column
    private Integer discount = 0;

    @Column(name = "sold_count")
    private Integer soldCount = 0;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "is_active")
    private Boolean isActive = true;

    @org.hibernate.annotations.Formula("(SELECT COALESCE(SUM(oi.quantity), 0) FROM order_items oi JOIN orders o ON oi.order_id = o.order_id WHERE oi.product_id = id AND o.status = 'COMPLETED')")
    private Integer completedOrderSoldCount;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Enums
    public enum Origin {
        LOCAL("local"),
        IMPORTED("imported");

        private final String value;

        Origin(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        @Converter(autoApply = true)
        public static class OriginConverter implements AttributeConverter<Origin, String> {
            @Override
            public String convertToDatabaseColumn(Origin origin) {
                return origin == null ? null : origin.getValue();
            }

            @Override
            public Origin convertToEntityAttribute(String value) {
                if (value == null)
                    return null;
                for (Origin origin : Origin.values()) {
                    if (origin.getValue().equals(value)) {
                        return origin;
                    }
                }
                throw new IllegalArgumentException("Unknown value: " + value);
            }
        }
    }
}
