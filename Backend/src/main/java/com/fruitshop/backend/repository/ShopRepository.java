package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Shop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Integer> {
    List<Shop> findByStatus(Shop.ShopStatus status);
    Page<Shop> findByStatus(Shop.ShopStatus status, Pageable pageable);
}
