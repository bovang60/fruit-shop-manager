package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Data
@Entity
@Table(name = "shop_shipping_configs")
public class ShopShippingConfig {

    @EmbeddedId
    private ShopShippingConfigId id;

    @ManyToOne
    @MapsId("shopId")
    @JoinColumn(name = "shop_id", foreignKey = @ForeignKey(name = "FK_ShopConfig_Shop"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Shop shop;

    @ManyToOne
    @MapsId("methodId")
    @JoinColumn(name = "method_id", foreignKey = @ForeignKey(name = "FK_ShopConfig_Method"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ShippingMethod shippingMethod;

    @Column(name = "is_active")
    private Boolean isActive = false;
}
