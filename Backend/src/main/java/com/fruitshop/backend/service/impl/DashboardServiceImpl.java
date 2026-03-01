package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.DashboardDto;
import com.fruitshop.backend.model.Order;
import com.fruitshop.backend.model.Shop;
import com.fruitshop.backend.repository.OrderRepository;
import com.fruitshop.backend.repository.ShopRepository;
import com.fruitshop.backend.repository.UserRepository;
import com.fruitshop.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    @Override
    public ApiResponse<DashboardDto> getAdminDashboardStats() {
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        long activeUsers = userRepository.countByStatus(com.fruitshop.backend.model.User.UserStatus.ACTIVE);
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        long activeSellers = shopRepository.countByStatus(Shop.ShopStatus.APPROVED);
        long pendingApprovals = shopRepository.countByStatus(Shop.ShopStatus.PENDING);

        // Conversion Rate: Total Orders / Total Users (Basic formula)
        double conversionRate = (totalUsers > 0) ? ((double) totalOrders / totalUsers) * 100.0 : 0.0;

        DashboardDto dashboard = DashboardDto.builder()
                .activeUsers(activeUsers)
                .totalOrders(totalOrders)
                .conversionRate(Math.round(conversionRate * 100.0) / 100.0)
                .totalRevenue(totalRevenue)
                .totalActiveSellers(activeSellers)
                .pendingShopApprovals(pendingApprovals)
                .ordersByMonth(orderRepository.countOrdersByMonth())
                .topSellers(orderRepository.findTopSellersByQuantity(PageRequest.of(0, 5)))
                .shopPerformanceMonthly(orderRepository.findMonthlyPerformance())
                .build();

        return ApiResponse.success("Dashboard stats retrieved successfully", dashboard);
    }

    }
