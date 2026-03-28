package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Fruit;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;


@Repository
public interface FruitRepository extends JpaRepository<Fruit, Integer> {
    Page<Fruit> findByFruitNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Fruit> findByShopShopId(Integer shopId, Pageable pageable);
    Page<Fruit> findByCategoryCategoryId(Integer categoryId, Pageable pageable);

    java.util.List<Fruit> findByShopShopId(Integer shopId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT f FROM Fruit f WHERE f.fruitId = :fruitId")
    Optional<Fruit> findByIdForUpdate(@Param("fruitId") Integer fruitId);
    List<Fruit> findByShop_ShopId(Integer shopId);

}

