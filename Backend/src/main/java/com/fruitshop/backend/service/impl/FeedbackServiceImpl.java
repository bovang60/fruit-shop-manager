package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.FeedbackDto;
import com.fruitshop.backend.dto.FeedbackRequestDto;
import com.fruitshop.backend.exception.*;
import com.fruitshop.backend.model.*;
import com.fruitshop.backend.repository.*;
import com.fruitshop.backend.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public ApiResponse<FeedbackDto> createFeedback(Integer userId, FeedbackRequestDto request) {
        // === PROGRAMMATIC VALIDATION (second layer after @Valid) ===
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // 1. Validate order exists
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new FeedbackNotFoundException("Order not found with id: " + request.getOrderId()));

        // 2. Validate order belongs to current user (OWNERSHIP CHECK)
        if (!order.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedFeedbackAccessException("You are not authorized to give feedback for this order");
        }

        // 3. Validate order status = DELIVERED or COMPLETED
        if (order.getStatus() != Order.OrderStatus.DELIVERED && order.getStatus() != Order.OrderStatus.COMPLETED) {
            throw new OrderNotDeliveredException(
                    "Order must be delivered or completed before giving feedback. Current status: " + order.getStatus());
        }

        // 4. Validate product exists
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new FeedbackNotFoundException("Product not found with id: " + request.getProductId()));

        // 5. Validate product belongs to this order (PRODUCT-IN-ORDER CHECK)
        List<OrderItem> orderItems = orderItemRepository.findByOrderOrderId(order.getOrderId());
        boolean productInOrder = orderItems.stream()
                .anyMatch(item -> item.getProduct() != null
                        && item.getProduct().getProductId().equals(request.getProductId()));
        if (!productInOrder) {
            throw new IllegalArgumentException("Product is not part of this order");
        }

        // 6. Validate feedback does NOT already exist (DUPLICATE CHECK)
        Optional<Feedback> existingFeedback = feedbackRepository
                .findByOrder_OrderIdAndProduct_ProductIdAndUser_UserId(
                        request.getOrderId(), request.getProductId(), userId);
        if (existingFeedback.isPresent()) {
            throw new FeedbackAlreadyExistsException(
                    "You have already reviewed this product for this order");
        }

        // 7. Save feedback
        Feedback feedback = new Feedback();
        feedback.setUser(order.getUser());
        feedback.setProduct(product);
        feedback.setOrder(order);
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment() != null ? request.getComment() : "");

        feedbackRepository.save(feedback);

        // 8. Recalculate product rating from DB (ALWAYS AVG + COUNT)
        recalculateProductRating(product.getProductId());

        return ApiResponse.success("Feedback submitted successfully", toDto(feedback));
    }

    @Override
    @Transactional
    public ApiResponse<FeedbackDto> updateFeedback(Integer userId, Integer feedbackId, FeedbackRequestDto request) {
        // === PROGRAMMATIC VALIDATION ===
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // 1. Validate feedback exists
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new FeedbackNotFoundException("Feedback not found with id: " + feedbackId));

        // 2. Validate feedback belongs to current user (OWNERSHIP CHECK)
        if (!feedback.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedFeedbackAccessException("You are not authorized to update this feedback");
        }

        // 3. ONLY update rating + comment (NEVER orderId or productId)
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment() != null ? request.getComment() : feedback.getComment());

        feedbackRepository.save(feedback);

        // 4. Recalculate product rating from DB (ALWAYS AVG + COUNT)
        recalculateProductRating(feedback.getProduct().getProductId());

        return ApiResponse.success("Feedback updated successfully", toDto(feedback));
    }

    @Override
    public ApiResponse<List<FeedbackDto>> getFeedbackByProduct(Integer productId) {
        List<Feedback> feedbacks = feedbackRepository.findByProduct_ProductIdOrderByCreatedAtDesc(productId);
        List<FeedbackDto> dtos = new ArrayList<>();

        for (Feedback fb : feedbacks) {
            dtos.add(toDto(fb));
        }

        return ApiResponse.success(dtos);
    }

    // ============= PRIVATE HELPERS =============

    /**
     * ALWAYS recalculate from DB using SELECT AVG + SELECT COUNT.
     * NEVER increment manually to avoid data corruption.
     */
    private void recalculateProductRating(Integer productId) {
        Double avg = feedbackRepository.calculateAverageRatingByProductId(productId);
        Long count = feedbackRepository.countByProductId(productId);

        // Handle AVG = NULL (no feedbacks yet)
        avg = avg != null ? avg : 0.0;
        count = count != null ? count : 0L;

        Product product = productRepository.findById(productId).orElse(null);
        if (product != null) {
            product.setRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
            product.setReviewCount(count.intValue());
            productRepository.save(product);
        }
    }

    /**
     * Convert Feedback entity to FeedbackDto
     */
    private FeedbackDto toDto(Feedback fb) {
        FeedbackDto dto = new FeedbackDto();
        dto.setFeedbackId(fb.getFeedbackId());
        dto.setUserName(fb.getUser() != null ? fb.getUser().getFullName() : "Anonymous");
        dto.setProductId(fb.getProduct() != null ? fb.getProduct().getProductId() : null);
        dto.setProductName(fb.getProduct() != null ? fb.getProduct().getName() : "Unknown Product");
        dto.setRating(fb.getRating());
        dto.setComment(fb.getComment());
        dto.setCreatedAt(fb.getCreatedAt());
        return dto;
    }
}

