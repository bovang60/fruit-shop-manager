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
import java.time.LocalDate;
import java.time.LocalDateTime;
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

        long canceledOrders = orderRepository.countByStatus(Order.OrderStatus.CANCELLED);
        double cancellationRate = (totalOrders > 0) ? ((double) canceledOrders / totalOrders) * 100.0 : 0.0;

        // Xử lý thống kê 7 ngày gần nhất, kể cả ngày không có đơn
        LocalDateTime sevenDaysAgoStart = LocalDate.now().minusDays(6).atStartOfDay();
        List<DashboardDto.DailyOrderDto> rawOrders = orderRepository.countOrdersLast7Days(sevenDaysAgoStart);
        
        // Tạo Map để tra cứu nhanh từ kết quả DB
        java.util.Map<String, Long> orderMap = new java.util.HashMap<>();
        for (DashboardDto.DailyOrderDto dto : rawOrders) {
            String dateKey = dto.getDate().toString(); // Thường là YYYY-MM-DD
            orderMap.put(dateKey, dto.getOrderCount());
        }

        // Tạo danh sách đầy đủ 7 ngày
        List<DashboardDto.DailyOrderDto> filledOrders = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate date = LocalDate.now().minusDays(6 - i);
            String dateStr = date.toString();
            filledOrders.add(DashboardDto.DailyOrderDto.builder()
                    .date(dateStr)
                    .orderCount(orderMap.getOrDefault(dateStr, 0L))
                    .build());
        }

        DashboardDto dashboard = DashboardDto.builder()
                .activeUsers(activeUsers)
                .totalOrders(totalOrders)
                .cancellationRate(Math.round(cancellationRate * 100.0) / 100.0)
                .totalRevenue(totalRevenue)
                .totalActiveSellers(activeSellers)
                .pendingShopApprovals(pendingApprovals)
                .ordersLast7Days(filledOrders)
                .topSellers(orderRepository.findTopSellersByRevenue(PageRequest.of(0, 5)))
                .build();

        return ApiResponse.success("Dashboard stats retrieved successfully", dashboard);
    }
}
