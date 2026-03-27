package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductDetailRepository extends JpaRepository<Product, Integer> {

    /**
     * Find active product by ID (fetch category and shop eagerly)
     */
    @Query("SELECT p FROM Product p " +
            "LEFT JOIN FETCH p.category " +
            "LEFT JOIN FETCH p.shop " +
            "WHERE p.productId = :id AND p.isActive = true")
    Optional<Product> findActiveProductById(@Param("id") Integer id);

    /**
     * Find related products by same category, excluding the current product
     */
    @Query("SELECT p FROM Product p " +
            "WHERE p.category.categoryId = :categoryId " +
            "AND p.productId <> :excludeProductId " +
            "AND p.isActive = true " +
            "ORDER BY p.soldCount DESC")
    List<Product> findRelatedProducts(
            @Param("categoryId") Integer categoryId,
            @Param("excludeProductId") Integer excludeProductId,
            Pageable pageable);

    /**
     * Increment view count for a product
     */
    @Modifying
    @Query("UPDATE Product p SET p.viewCount = p.viewCount + 1 WHERE p.productId = :id")
    void incrementViewCount(@Param("id") Integer id);
}
