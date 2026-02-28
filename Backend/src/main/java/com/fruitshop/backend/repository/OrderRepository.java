package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByShop_ShopIdOrderByCreatedAtDesc(Integer shopId);
    @Query("SELECT COUNT(o) FROM Order o WHERE o.shop.shopId = :shopId AND o.status = :status")
    Integer countByShopIdAndStatus(@Param("shopId") Integer shopId, @Param("status") Order.OrderStatus status);

    // Tính tổng doanh thu (Chỉ tính những đơn hàng đã hoàn thành - DELIVERED)
    @Query("SELECT SUM(o.subTotal) FROM Order o WHERE o.shop.shopId = :shopId AND o.status = 'DELIVERED'")
    java.math.BigDecimal sumRevenueByShopId(@Param("shopId") Integer shopId);

    // Tính tổng số lượng sản phẩm đã bán ra
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.order.shop.shopId = :shopId AND oi.order.status = 'DELIVERED'")
    Integer sumQuantitySoldByShopId(@Param("shopId") Integer shopId);
}
