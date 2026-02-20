package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Integer reviewId;

    @OneToOne
    @JoinColumn(name = "order_item_id", nullable = false, foreignKey = @ForeignKey(name = "FK_reviews_order_item"))
    private OrderItem orderItem;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "FK_reviews_user"))
    private User user;

    @ManyToOne
    @JoinColumn(name = "fruit_id", nullable = false, foreignKey = @ForeignKey(name = "FK_reviews_fruit"))
    private Fruit fruit;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String comment;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
