package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
        @org.springframework.data.jpa.repository.Query("SELECT SUM(o.subTotal + o.shippingFee) FROM Order o WHERE o.status = 'COMPLETED'")
        java.math.BigDecimal sumTotalRevenue();

        long countByStatus(Order.OrderStatus status);

        @org.springframework.data.jpa.repository.Query("SELECT new com.fruitshop.backend.dto.DashboardDto$MonthlyOrderDto("
                        +
                        "CONCAT(YEAR(o.createdAt), '-', MONTH(o.createdAt)), COUNT(o)) " +
                        "FROM Order o GROUP BY YEAR(o.createdAt), MONTH(o.createdAt) " +
                        "ORDER BY YEAR(o.createdAt) DESC, MONTH(o.createdAt) DESC")
        java.util.List<com.fruitshop.backend.dto.DashboardDto.MonthlyOrderDto> countOrdersByMonth();

        @org.springframework.data.jpa.repository.Query("SELECT new com.fruitshop.backend.dto.DashboardDto$MonthlyPerformanceDto("
                        +
                        "CONCAT(YEAR(o.createdAt), '-', MONTH(o.createdAt)), " +
                        "COUNT(o), " +
                        "SUM(CASE WHEN o.status = 'CANCELLED' THEN 1 ELSE 0 END), " +
                        "SUM(CASE WHEN o.status = 'COMPLETED' THEN (o.subTotal + o.shippingFee) ELSE 0 END)) " +
                        "FROM Order o GROUP BY YEAR(o.createdAt), MONTH(o.createdAt) " +
                        "ORDER BY YEAR(o.createdAt) DESC, MONTH(o.createdAt) DESC")
        java.util.List<com.fruitshop.backend.dto.DashboardDto.MonthlyPerformanceDto> findMonthlyPerformance();

        @org.springframework.data.jpa.repository.Query("SELECT new com.fruitshop.backend.dto.DashboardDto$TopSellerDto(s.shopName, "
                        +
                        "SUM(oi.quantity), SUM(o.subTotal + o.shippingFee), 'APPROVED') " +
                        "FROM OrderItem oi JOIN oi.order o JOIN o.shop s " +
                        "WHERE o.status = 'COMPLETED' " +
                        "GROUP BY s.shopId, s.shopName, s.status " +
                        "ORDER BY SUM(oi.quantity) DESC")
        java.util.List<com.fruitshop.backend.dto.DashboardDto.TopSellerDto> findTopSellersByQuantity(
                        org.springframework.data.domain.Pageable pageable);
}
