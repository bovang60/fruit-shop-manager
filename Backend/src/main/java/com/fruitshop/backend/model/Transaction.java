package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Integer transactionId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "FK_transactions_user"))
    private User user;

    @Column(name = "total_payment", nullable = false, precision = 15, scale = 0)
    private BigDecimal totalPayment;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.UNPAID;

    @Column(name = "transaction_code")
    private String transactionCode;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum PaymentMethod {
        COD, VNPAY, MOMO
    }

    public enum PaymentStatus {
        PENDING, SUCCESS, FAILED, UNPAID, COMPLETED, PAID
    }
}
