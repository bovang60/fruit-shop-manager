package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.ShopShippingConfig;
import com.fruitshop.backend.model.ShopShippingConfigId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopShippingConfigRepository extends JpaRepository<ShopShippingConfig, ShopShippingConfigId> {
    List<ShopShippingConfig> findByShop_ShopId(Integer shopId);
}
