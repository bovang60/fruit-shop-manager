package com.fruitshop.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class ShopShippingConfigId implements Serializable {
    @Column(name = "shop_id")
    private Integer shopId;

    @Column(name = "method_id")
    private Integer methodId;
}
