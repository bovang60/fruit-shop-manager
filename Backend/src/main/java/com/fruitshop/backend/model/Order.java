package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;

    @ManyToOne
    @JoinColumn(name = "transaction_id", nullable = false, foreignKey = @ForeignKey(name = "FK_orders_transaction"))
    private Transaction transaction;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false, foreignKey = @ForeignKey(name = "FK_orders_shop"))
    private Shop shop;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "FK_orders_user"))
    private User user;

    @Column(name = "receiver_name", nullable = false)
    private String receiverName;

    @Column(name = "receiver_phone", nullable = false, length = 15)
    private String receiverPhone;

    @Column(name = "shipping_address", nullable = false, length = 500)
    private String shippingAddress;

    @Column(name = "sub_total", nullable = false, precision = 15, scale = 0)
    private BigDecimal subTotal;

    @Column(name = "shipping_fee", precision = 15, scale = 0)
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String note;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum OrderStatus {
        PENDING, CONFIRMED, SHIPPING, DELIVERED, COMPLETED, CANCELLED, REJECTED
    }
}
