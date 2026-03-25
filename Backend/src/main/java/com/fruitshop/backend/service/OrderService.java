package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.CheckoutRequestDto;
import com.fruitshop.backend.dto.OrderDto;
import com.fruitshop.backend.dto.OrderStatusDto;

import java.util.List;

public interface OrderService {
    ApiResponse<List<OrderDto>> checkout(CheckoutRequestDto dto);
    ApiResponse<List<OrderDto>> getOrderHistory(Integer userId);
    ApiResponse<OrderDto> getOrderDetail(Integer orderId, Integer userId);
    ApiResponse<String> confirmOrder(Integer orderId, Integer userId);
    ApiResponse<String> updateOrderStatus(Integer orderId, OrderStatusDto dto, Integer userId);
    ApiResponse<String> cancelOrder(Integer orderId, Integer userId);
    ApiResponse<String> completeOrder(Integer orderId, Integer userId);
    ApiResponse<com.fruitshop.backend.dto.OrderResponse> createOrder(Integer userId, com.fruitshop.backend.dto.OrderRequest request);
}
