package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "order_vouchers")
public class OrderVoucher {
    @EmbeddedId
    private OrderVoucherId id;

    @ManyToOne
    @MapsId("orderId")
    @JoinColumn(name = "order_id", foreignKey = @ForeignKey(name = "FK_order_vouchers_order"))
    private Order order;

    @ManyToOne
    @MapsId("voucherId")
    @JoinColumn(name = "voucher_id", foreignKey = @ForeignKey(name = "FK_order_vouchers_voucher"))
    private Voucher voucher;

    @Column(name = "applied_value", nullable = false, precision = 15, scale = 0)
    private BigDecimal appliedValue;
}
