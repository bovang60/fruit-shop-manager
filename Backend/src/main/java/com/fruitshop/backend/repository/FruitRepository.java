package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Fruit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FruitRepository extends JpaRepository<Fruit, Integer> {
    List<Fruit> findByShop_ShopId(Integer shopId);
}
