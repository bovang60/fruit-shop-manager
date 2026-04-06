package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.*;
import com.fruitshop.backend.exception.*;
import com.fruitshop.backend.model.*;
import com.fruitshop.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeedbackServiceImplTest {

    @Mock
    private FeedbackRepository feedbackRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private OrderItemRepository orderItemRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private FeedbackServiceImpl feedbackService;

    private User user;
    private User otherUser;
    private Product product;
    private Order order;
    private OrderItem orderItem;
    private Feedback feedback;
    private FeedbackRequestDto requestDto;

    @BeforeEach
    void setUp() {
        // Mock User
        user = new User();
        user.setUserId(1);
        user.setFullName("John Doe");

        otherUser = new User();
        otherUser.setUserId(2);

        // Mock Product
        product = new Product();
        product.setProductId(100);
        product.setName("Mango");

        // Mock Order
        order = new Order();
        order.setOrderId(10);
        order.setUser(user);
        order.setStatus(Order.OrderStatus.DELIVERED);

        // Mock Order Item
        orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);

        // Mock existing Feedback
        feedback = new Feedback();
        feedback.setFeedbackId(1);
        feedback.setUser(user);
        feedback.setProduct(product);
        feedback.setOrder(order);
        feedback.setRating(4);

        // Request DTO
        requestDto = new FeedbackRequestDto();
        requestDto.setOrderId(10);
        requestDto.setProductId(100);
        requestDto.setRating(5);
        requestDto.setComment("Very good!");
    }

    // ==============================================
    // createFeedback Tests
    // ==============================================

    @Test
    void createFeedback_Success() {
        when(productRepository.findById(100)).thenReturn(Optional.of(product));
        when(orderRepository.findById(10)).thenReturn(Optional.of(order));
        when(orderItemRepository.findByOrderOrderId(10)).thenReturn(List.of(orderItem));
        when(feedbackRepository.findByOrder_OrderIdAndProduct_ProductIdAndUser_UserId(10, 100, 1))
                .thenReturn(Optional.empty());

        // For recalculation
        when(feedbackRepository.calculateAverageRatingByProductId(100)).thenReturn(5.0);
        when(feedbackRepository.countByProductId(100)).thenReturn(1L);

        ApiResponse<FeedbackDto> response = feedbackService.createFeedback(1, requestDto);

        assertEquals(0, response.getResultCd());
        assertEquals("Feedback submitted successfully", response.getMessage());
        assertEquals(5, response.getData().getRating());
        
        verify(feedbackRepository, times(1)).save(any(Feedback.class));
        verify(productRepository, times(1)).save(product); // Recalculation saves product
    }

    @Test
    void createFeedback_Fail_OrderNotDelivered() {
        order.setStatus(Order.OrderStatus.PENDING); // Wrong status

        when(productRepository.findById(100)).thenReturn(Optional.of(product));
        when(orderRepository.findById(10)).thenReturn(Optional.of(order));

        assertThrows(OrderNotDeliveredException.class, () -> {
            feedbackService.createFeedback(1, requestDto);
        });

        verify(feedbackRepository, never()).save(any());
    }

    @Test
    void createFeedback_Fail_Unauthorized() {
        // User 2 tries to review User 1's order
        when(productRepository.findById(100)).thenReturn(Optional.of(product));
        when(orderRepository.findById(10)).thenReturn(Optional.of(order));

        assertThrows(UnauthorizedFeedbackAccessException.class, () -> {
            feedbackService.createFeedback(2, requestDto); // Wrong user ID passed
        });

        verify(feedbackRepository, never()).save(any());
    }

    @Test
    void createFeedback_Fail_AlreadyReviewed() {
        when(productRepository.findById(100)).thenReturn(Optional.of(product));
        when(orderRepository.findById(10)).thenReturn(Optional.of(order));
        when(orderItemRepository.findByOrderOrderId(10)).thenReturn(List.of(orderItem));
        
        // Mock that feedback already exists in DB
        when(feedbackRepository.findByOrder_OrderIdAndProduct_ProductIdAndUser_UserId(10, 100, 1))
                .thenReturn(Optional.of(feedback));

        assertThrows(FeedbackAlreadyExistsException.class, () -> {
            feedbackService.createFeedback(1, requestDto);
        });

        verify(feedbackRepository, never()).save(any(Feedback.class));
    }

    // ==============================================
    // updateFeedback Tests
    // ==============================================

    @Test
    void updateFeedback_Success() {
        when(feedbackRepository.findById(1)).thenReturn(Optional.of(feedback));
        when(productRepository.findById(100)).thenReturn(Optional.of(product));
        
        // For recalculation
        when(feedbackRepository.calculateAverageRatingByProductId(100)).thenReturn(5.0);
        when(feedbackRepository.countByProductId(100)).thenReturn(1L);

        ApiResponse<FeedbackDto> response = feedbackService.updateFeedback(1, 1, requestDto);

        assertEquals(0, response.getResultCd());
        assertEquals("Feedback updated successfully", response.getMessage());
        assertEquals(5, feedback.getRating()); // Ensure rating was updated

        verify(feedbackRepository, times(1)).save(feedback);
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void updateFeedback_Fail_Unauthorized() {
        when(feedbackRepository.findById(1)).thenReturn(Optional.of(feedback));

        // User 2 tries to update User 1's feedback
        assertThrows(UnauthorizedFeedbackAccessException.class, () -> {
            feedbackService.updateFeedback(2, 1, requestDto);
        });

        verify(feedbackRepository, never()).save(any());
    }

    // ==============================================
    // Query Tests
    // ==============================================

    @Test
    void getFeedbackByProduct_Success() {
        when(feedbackRepository.findByProduct_ProductIdOrderByCreatedAtDesc(100))
                .thenReturn(List.of(feedback));

        ApiResponse<List<FeedbackDto>> response = feedbackService.getFeedbackByProduct(100);

        assertEquals(0, response.getResultCd());
        assertNotNull(response.getData());
        assertEquals(1, response.getData().size());
    }
}
