package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.NewOrderNotificationDto;
import com.fruitshop.backend.model.Order;
import com.fruitshop.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerNotificationService {

    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public ApiResponse<NewOrderNotificationDto> getNewOrders(Integer shopId, LocalDateTime since, int limit) {
        List<Order> orders = orderRepository.findNewPendingOrdersByShop(
                shopId, since, PageRequest.of(0, limit));

        Integer unreadCount = orderRepository.countNewPendingOrdersByShop(shopId, since);

        LocalDateTime latestEventAt = orders.isEmpty() ? null : orders.get(0).getCreatedAt();

        List<NewOrderNotificationDto.OrderSummary> summaries = orders.stream()
                .map(o -> new NewOrderNotificationDto.OrderSummary(
                        o.getOrderId(),
                        o.getReceiverName(),
                        o.getSubTotal(),
                        o.getStatus().name(),
                        o.getCreatedAt()))
                .collect(Collectors.toList());

        return ApiResponse.success("Success",
                new NewOrderNotificationDto(unreadCount, latestEventAt, summaries));
    }
}
