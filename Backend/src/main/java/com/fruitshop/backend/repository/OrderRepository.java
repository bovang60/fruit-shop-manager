package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
        @org.springframework.data.jpa.repository.Query("SELECT SUM(o.subTotal + o.shippingFee) FROM Order o WHERE o.status = 'COMPLETED'")
        java.math.BigDecimal sumTotalRevenue();

        long countByStatus(Order.OrderStatus status);

        @org.springframework.data.jpa.repository.Query("SELECT new com.fruitshop.backend.dto.DashboardDto$DailyOrderDto(" +
                        "CAST(o.createdAt AS date), COUNT(o)) " +
                        "FROM Order o WHERE o.createdAt >= :startDate " +
                        "GROUP BY CAST(o.createdAt AS date) " +
                        "ORDER BY CAST(o.createdAt AS date) ASC")
        java.util.List<com.fruitshop.backend.dto.DashboardDto.DailyOrderDto> countOrdersLast7Days(
                        @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate);

        @org.springframework.data.jpa.repository.Query("SELECT new com.fruitshop.backend.dto.DashboardDto$TopSellerDto(s.shopName, "
                        +
                        "SUM(oi.quantity), SUM(o.subTotal + o.shippingFee), 'APPROVED') " +
                        "FROM OrderItem oi JOIN oi.order o JOIN o.shop s " +
                        "WHERE o.status = 'COMPLETED' " +
                        "GROUP BY s.shopId, s.shopName, s.status " +
                        "ORDER BY SUM(o.subTotal + o.shippingFee) DESC")
        java.util.List<com.fruitshop.backend.dto.DashboardDto.TopSellerDto> findTopSellersByRevenue(
                        org.springframework.data.domain.Pageable pageable);

        java.util.List<Order> findByUser_UserIdOrderByCreatedAtDesc(Integer userId);

        long countByShop_ShopId(Integer shopId);
        long countByShop_ShopIdAndStatus(Integer shopId, Order.OrderStatus status);
}
