package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.SalesReportDto;
import com.fruitshop.backend.model.Order;
import com.fruitshop.backend.repository.OrderRepository;
import com.fruitshop.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    @Override
    public List<Order> getOrdersByShop(Integer shopId) {
        return orderRepository.findByShop_ShopIdOrderByCreatedAtDesc(shopId);
    }

    @Override
    public Order getOrderDetail(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + orderId));
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Integer orderId, Order.OrderStatus newStatus) {
        Order order = getOrderDetail(orderId);

        // Logic chặn: Nếu đơn đã hủy hoặc đã hoàn thành thì không cho đổi trạng thái nữa
        if (order.getStatus() == Order.OrderStatus.CANCELLED ||
                order.getStatus() == Order.OrderStatus.COMPLETED) {
            throw new IllegalStateException("Đơn hàng đã đóng, không thể thay đổi trạng thái!");
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
    @Override
    public SalesReportDto getShopSalesReport(Integer shopId) {
        Integer totalOrders = (int) orderRepository.count(); // Có thể lọc thêm theo shopId
        Integer successfulOrders = orderRepository.countByShopIdAndStatus(shopId, Order.OrderStatus.COMPLETED);
        java.math.BigDecimal revenue = orderRepository.sumRevenueByShopId(shopId);
        Integer quantitySold = orderRepository.sumQuantitySoldByShopId(shopId);

        return SalesReportDto.builder()
                .totalOrders(totalOrders)
                .successfulOrders(successfulOrders)
                .totalRevenue(revenue != null ? revenue : java.math.BigDecimal.ZERO)
                .totalFruitsSold(quantitySold != null ? quantitySold : 0)
                .build();
    }
}
