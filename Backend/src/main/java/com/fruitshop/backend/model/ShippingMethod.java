package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "shipping_methods")
public class ShippingMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "method_id")
    private Integer methodId;

    @Column(name = "method_name", columnDefinition = "NVARCHAR(100)", nullable = false)
    private String methodName;

    @Column(name = "description", columnDefinition = "NVARCHAR(500)")
    private String description;

    @Column(name = "fixed_fee", precision = 18, scale = 0)
    private BigDecimal fixedFee = BigDecimal.ZERO;

    @Column(name = "is_available")
    private Boolean isAvailable = true;
}
