package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Page<Category> findByCategoryNameContainingIgnoreCase(String keyword, Pageable pageable);
    Page<Category> findByStatus(Category.CategoryStatus status, Pageable pageable);
    Page<Category> findByCategoryNameContainingIgnoreCaseAndStatus(String keyword, Category.CategoryStatus status, Pageable pageable);
    
    @Query("SELECT c FROM Category c LEFT JOIN c.products p WHERE (:status IS NULL OR c.status = :status) GROUP BY c ORDER BY COUNT(p) DESC")
    Page<Category> findAllOrderByProductCountDesc(Category.CategoryStatus status, Pageable pageable);
    
    @Query("SELECT c FROM Category c LEFT JOIN c.products p WHERE (:status IS NULL OR c.status = :status) GROUP BY c ORDER BY COUNT(p) ASC")
    Page<Category> findAllOrderByProductCountAsc(Category.CategoryStatus status, Pageable pageable);

    boolean existsByCategoryNameIgnoreCase(String categoryName);
}
