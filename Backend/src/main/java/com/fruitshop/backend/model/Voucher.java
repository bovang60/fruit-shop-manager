package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "vouchers")
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "voucher_id")
    private Integer voucherId;

    @ManyToOne
    @JoinColumn(name = "shop_id", foreignKey = @ForeignKey(name = "FK_vouchers_shop"))
    private Shop shop;

    @Column(nullable = false, length = 50)
    private String code;

    @Column(name = "discount_value", nullable = false, precision = 15, scale = 0)
    private BigDecimal discountValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", length = 10)
    private DiscountType discountType = DiscountType.FIXED;

    @Column(name = "min_order_value", precision = 15, scale = 0)
    private BigDecimal minOrderValue = BigDecimal.ZERO;

    @Column(name = "expired_date")
    private LocalDateTime expiredDate;

    @Column(length = 20)
    private String status = "ACTIVE";

    @ManyToOne
    @JoinColumn(name = "created_by", foreignKey = @ForeignKey(name = "FK_vouchers_user"))
    private User createdBy;

    public enum DiscountType {
        FIXED, PERCENT
    }
}
