package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

    Optional<Feedback> findByOrder_OrderIdAndProduct_ProductIdAndUser_UserId(
            Integer orderId, Integer productId, Integer userId);

    List<Feedback> findByProduct_ProductIdOrderByCreatedAtDesc(Integer productId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.product.productId = :productId")
    Double calculateAverageRatingByProductId(@Param("productId") Integer productId);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.product.productId = :productId")
    Long countByProductId(@Param("productId") Integer productId);
}
