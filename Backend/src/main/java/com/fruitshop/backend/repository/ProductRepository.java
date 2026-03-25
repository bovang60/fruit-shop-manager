package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.productId = :productId")
    Optional<Product> findByIdForUpdate(@Param("productId") Integer productId);

    // Search and filter products
    @Query("SELECT p FROM Product p LEFT JOIN p.category c WHERE " +
            "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:categoryId IS NULL OR c.categoryId = :categoryId) AND " +
            "(:category IS NULL OR (c IS NOT NULL AND LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :category, '%')))) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
            "(:origin IS NULL OR p.origin = :origin) AND " +
            "(:organic IS NULL OR p.isOrganic = :organic) AND " +
            "(p.isActive IS NULL OR p.isActive = true)")
    Page<Product> searchProducts(
            @Param("search") String search,
            @Param("categoryId") Integer categoryId,
            @Param("category") String category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("origin") Product.Origin origin,
            @Param("organic") Boolean organic,
            Pageable pageable);

    // Get new arrivals (newest products)
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.createdAt DESC")
    List<Product> findNewArrivals(Pageable pageable);

    // Get trending products (by soldCount and viewCount)
    @Query("SELECT p FROM Product p WHERE p.isActive = true " +
            "ORDER BY (p.soldCount * 0.7 + p.viewCount * 0.3) DESC")
    List<Product> findTrendingProducts(Pageable pageable);
}
