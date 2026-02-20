package com.fruitshop.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class OrderVoucherId implements Serializable {
    @Column(name = "order_id")
    private Integer orderId;

    @Column(name = "voucher_id")
    private Integer voucherId;

    public OrderVoucherId() {}

    public OrderVoucherId(Integer orderId, Integer voucherId) {
        this.orderId = orderId;
        this.voucherId = voucherId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderVoucherId that = (OrderVoucherId) o;
        return Objects.equals(orderId, that.orderId) && Objects.equals(voucherId, that.voucherId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderId, voucherId);
    }
}
