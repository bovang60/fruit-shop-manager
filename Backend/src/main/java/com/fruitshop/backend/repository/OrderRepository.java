package com.fruitshop.backend.repository;

import com.fruitshop.backend.dto.DashboardDto;
import com.fruitshop.backend.model.Order;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
        List<Order> findByShop_ShopIdOrderByCreatedAtDesc(Integer shopId);

        @Query("SELECT COUNT(o) FROM Order o WHERE o.shop.shopId = :shopId")
        long countByShopId(@Param("shopId") Integer shopId);

        @Query("SELECT COUNT(o) FROM Order o WHERE o.shop.shopId = :shopId AND o.status = :status")
        long countByShopIdAndStatus(@Param("shopId") Integer shopId, @Param("status") Order.OrderStatus status);
        @Query("SELECT COUNT(o) FROM Order o WHERE o.shop.shopId = :shopId")
        long countByShop_ShopId(Integer shopId);

        // @Query("SELECT COUNT(o) FROM Order o WHERE o.shop.shopId = :shopId AND o.status = :status")
        // Integer countByShopIdAndStatus(@Param("shopId") Integer shopId, @Param("status") Order.OrderStatus status);

        // Tinh tong doanh thu theo shop (chi tinh don da hoan thanh)
        @Query("SELECT SUM(o.subTotal) FROM Order o WHERE o.shop.shopId = :shopId AND o.status = 'COMPLETED'")
        BigDecimal sumRevenueByShopId(@Param("shopId") Integer shopId);

        // Tinh tong so luong san pham da ban ra theo shop
        @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.order.shop.shopId = :shopId AND oi.order.status = 'COMPLETED'")
        Integer sumQuantitySoldByShopId(@Param("shopId") Integer shopId);

        @Query("SELECT SUM(o.subTotal + o.shippingFee) FROM Order o WHERE o.status = 'COMPLETED'")
        BigDecimal sumTotalRevenue();

        long countByStatus(Order.OrderStatus status);

        @org.springframework.data.jpa.repository.Query("SELECT new com.fruitshop.backend.dto.DashboardDto$DailyOrderDto(" +
                        "CAST(o.createdAt AS date), COUNT(o)) " +
                        "FROM Order o WHERE o.createdAt >= :startDate " +
                        "GROUP BY CAST(o.createdAt AS date) " +
                        "ORDER BY CAST(o.createdAt AS date) ASC")
        java.util.List<com.fruitshop.backend.dto.DashboardDto.DailyOrderDto> countOrdersLast7Days(
                        @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate);
        @Query("SELECT new com.fruitshop.backend.dto.DashboardDto$MonthlyOrderDto(" +
                        "CONCAT(YEAR(o.createdAt), '-', MONTH(o.createdAt)), COUNT(o)) " +
                        "FROM Order o GROUP BY YEAR(o.createdAt), MONTH(o.createdAt) " +
                        "ORDER BY YEAR(o.createdAt) DESC, MONTH(o.createdAt) DESC")
        List<DashboardDto.MonthlyOrderDto> countOrdersByMonth();

        @Query("SELECT new com.fruitshop.backend.dto.DashboardDto$MonthlyPerformanceDto(" +
                        "CONCAT(YEAR(o.createdAt), '-', MONTH(o.createdAt)), " +
                        "COUNT(o), " +
                        "SUM(CASE WHEN o.status = 'CANCELLED' THEN 1 ELSE 0 END), " +
                        "SUM(CASE WHEN o.status = 'COMPLETED' THEN (o.subTotal + o.shippingFee) ELSE 0 END)) " +
                        "FROM Order o GROUP BY YEAR(o.createdAt), MONTH(o.createdAt) " +
                        "ORDER BY YEAR(o.createdAt) DESC, MONTH(o.createdAt) DESC")
        List<DashboardDto.MonthlyPerformanceDto> findMonthlyPerformance();

        @Query("SELECT new com.fruitshop.backend.dto.DashboardDto$TopSellerDto(s.shopName, " +
                        "SUM(oi.quantity), SUM(o.subTotal + o.shippingFee), 'APPROVED') " +
                        "FROM OrderItem oi JOIN oi.order o JOIN o.shop s " +
                        "WHERE o.status = 'COMPLETED' " +
                        "GROUP BY s.shopId, s.shopName, s.status " +
                        "ORDER BY SUM(oi.quantity) DESC")
        List<DashboardDto.TopSellerDto> findTopSellersByQuantity(Pageable pageable);

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

        @Modifying
        @Transactional
        @Query("UPDATE Order o SET o.status = 'CANCELLED' WHERE o.shop.shopId = :shopId AND o.status = 'PENDING'")
        int cancelPendingOrdersByShopId(@Param("shopId") Integer shopId);

        @Modifying
        @Transactional
        @Query("UPDATE Order o SET o.status = 'CANCELLED' WHERE o.user.userId = :userId AND o.status = 'PENDING'")
        int cancelPendingOrdersByUserId(@Param("userId") Integer userId);
        @Query("SELECT o FROM Order o WHERE o.shop.shopId = :shopId AND o.status = 'PENDING' AND (:since IS NULL OR o.createdAt > :since) ORDER BY o.createdAt DESC")
        List<Order> findNewPendingOrdersByShop(
                @Param("shopId") Integer shopId,
                @Param("since") java.time.LocalDateTime since,
                Pageable pageable);

        @Query("SELECT COUNT(o) FROM Order o WHERE o.shop.shopId = :shopId AND o.status = 'PENDING' AND (:since IS NULL OR o.createdAt > :since)")
        Integer countNewPendingOrdersByShop(
                @Param("shopId") Integer shopId,
                @Param("since") java.time.LocalDateTime since);
}
