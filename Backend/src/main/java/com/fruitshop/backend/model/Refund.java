package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "refunds")
public class Refund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refund_id")
    private Integer refundId;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false, foreignKey = @ForeignKey(name = "FK_refunds_order"))
    private Order order;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String reason;

    @Column(name = "image_proof_url", length = 500)
    private String imageProofUrl;

    @Enumerated(EnumType.STRING)
    private RefundStatus status = RefundStatus.REQUESTED;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false, foreignKey = @ForeignKey(name = "FK_refunds_user"))
    private User createdBy;

    public enum RefundStatus {
        REQUESTED, APPROVED, REJECTED
    }
}
