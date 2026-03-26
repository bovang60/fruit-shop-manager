package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    Optional<Feedback> findByOrder_OrderIdAndProduct_ProductIdAndUser_UserId(Integer orderId, Integer productId, Integer userId);
    List<Feedback> findByProduct_ProductIdOrderByCreatedAtDesc(Integer productId);
}
