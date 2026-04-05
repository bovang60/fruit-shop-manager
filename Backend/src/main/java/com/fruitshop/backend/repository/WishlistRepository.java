package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    
    @Query("SELECT w FROM Wishlist w JOIN FETCH w.product p LEFT JOIN FETCH p.category WHERE w.user.userId = :userId ORDER BY w.createdAt DESC")
    List<Wishlist> findAllWithProductsByUserId(@Param("userId") Integer userId);
    
    Optional<Wishlist> findByUser_UserIdAndProduct_ProductId(Integer userId, Integer productId);
    
    boolean existsByUser_UserIdAndProduct_ProductId(Integer userId, Integer productId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Wishlist w WHERE w.user.userId = :userId AND w.product.productId = :productId")
    void deleteByUserIdAndProductId(@Param("userId") Integer userId, @Param("productId") Integer productId);
}
