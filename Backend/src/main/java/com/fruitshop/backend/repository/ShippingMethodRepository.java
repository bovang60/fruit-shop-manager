package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.ShippingMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShippingMethodRepository extends JpaRepository<ShippingMethod, Integer> {
    java.util.List<ShippingMethod> findByIsAvailableTrue();
}
