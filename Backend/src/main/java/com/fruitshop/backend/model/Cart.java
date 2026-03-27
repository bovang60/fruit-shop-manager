package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Integer cartId;

    @ManyToOne
    @JoinColumn(name = "sheller_id", nullable = false, foreignKey = @ForeignKey(name = "FKb5o626f86h46m4s7ms6ginnop"))
    private User sheller;

    @Column(name = "customer_id", nullable = false, columnDefinition = "int default 0")
    private Integer customerId;

    @Column(name = "product_id", nullable = false, columnDefinition = "int default 0")
    private Integer productId;

    @Column(name = "status")
    private Integer status;

    @Column(name = "quantity")
    private Integer quantity;
}

