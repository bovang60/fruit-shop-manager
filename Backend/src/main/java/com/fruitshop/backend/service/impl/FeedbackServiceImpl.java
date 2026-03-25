package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.FeedbackDto;
import com.fruitshop.backend.dto.FeedbackRequestDto;
import com.fruitshop.backend.model.*;
import com.fruitshop.backend.repository.*;
import com.fruitshop.backend.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public ApiResponse<String> createFeedback(Integer userId, FeedbackRequestDto request) {
        // 1. Validate order exists
        if (request.getOrderId() == null) {
            return ApiResponse.error("Order ID is required");
        }
        Optional<Order> orderOpt = orderRepository.findById(request.getOrderId());
        if (orderOpt.isEmpty()) {
            return ApiResponse.error("Order not found");
        }
        Order order = orderOpt.get();

        // 2. Validate user is owner
        if (!order.getUser().getUserId().equals(userId)) {
            return ApiResponse.error("Unauthorized");
        }

        // 3. Validate order status = COMPLETED
        if (order.getStatus() != Order.OrderStatus.COMPLETED) {
            return ApiResponse.error("Order must be completed to give feedback");
        }

        // 4. Validate product exists
        if (request.getProductId() == null) {
            return ApiResponse.error("Product ID is required");
        }
        Optional<Product> productOpt = productRepository.findById(request.getProductId());
        if (productOpt.isEmpty()) {
            return ApiResponse.error("Product not found");
        }
        Product product = productOpt.get();

        // 5. Validate product belongs to this order
        List<OrderItem> orderItems = orderItemRepository.findByOrderOrderId(order.getOrderId());
        boolean productInOrder = orderItems.stream()
                .anyMatch(item -> item.getProduct() != null && item.getProduct().getProductId().equals(request.getProductId()));
        if (!productInOrder) {
            return ApiResponse.error("Product is not part of this order");
        }

        // 6. Validate not already reviewed
        Optional<Feedback> existingFeedback = feedbackRepository
                .findByOrder_OrderIdAndProduct_ProductIdAndUser_UserId(request.getOrderId(), request.getProductId(), userId);
        if (existingFeedback.isPresent()) {
            return ApiResponse.error("You already reviewed this product");
        }

        // 7. Validate rating
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            return ApiResponse.error("Rating must be between 1 and 5");
        }

        // 8. Save feedback
        Feedback feedback = new Feedback();
        feedback.setUser(order.getUser());
        feedback.setProduct(product);
        feedback.setOrder(order);
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment() != null ? request.getComment() : "");

        feedbackRepository.save(feedback);

        System.out.println("User " + userId + " reviewed product " + request.getProductId() + " in order " + request.getOrderId());

        return ApiResponse.success("Feedback submitted successfully", null);
    }

    @Override
    public ApiResponse<List<FeedbackDto>> getFeedbackByProduct(Integer productId) {
        List<Feedback> feedbacks = feedbackRepository.findByProduct_ProductIdOrderByCreatedAtDesc(productId);
        List<FeedbackDto> dtos = new ArrayList<>();

        for (Feedback fb : feedbacks) {
            FeedbackDto dto = new FeedbackDto();
            dto.setFeedbackId(fb.getFeedbackId());
            dto.setUserName(fb.getUser() != null ? fb.getUser().getFullName() : "Anonymous");
            dto.setProductId(fb.getProduct() != null ? fb.getProduct().getProductId() : null);
            dto.setProductName(fb.getProduct() != null ? fb.getProduct().getName() : "Unknown Product");
            dto.setRating(fb.getRating());
            dto.setComment(fb.getComment());
            dto.setCreatedAt(fb.getCreatedAt());
            dtos.add(dto);
        }

        return ApiResponse.success(dtos);
    }
}
