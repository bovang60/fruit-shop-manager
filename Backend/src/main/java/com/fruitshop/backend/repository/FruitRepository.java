package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Fruit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FruitRepository extends JpaRepository<Fruit, Integer> {
    Page<Fruit> findByFruitNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Fruit> findByShopShopId(Integer shopId, Pageable pageable);
    Page<Fruit> findByCategoryCategoryId(Integer categoryId, Pageable pageable);
    
    java.util.List<Fruit> findByShopShopId(Integer shopId);
}
