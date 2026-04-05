package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Cart;
import com.fruitshop.backend.model.Shop;
import com.fruitshop.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

    /** Find all carts for a customer with a specific status */
    List<Cart> findByCustomerUserIdAndStatus(Integer customerId, Integer status);

    /** Find cart for a specific customer + shop + status (to reuse existing cart) */
    Optional<Cart> findByCustomerAndShopAndStatus(User customer, Shop shop, Integer status);

    /** Find cart by customer ID + shop ID + status */
    Optional<Cart> findByCustomerUserIdAndShopShopIdAndStatus(Integer customerId, Integer shopId, Integer status);

    /** Fetch carts with items eagerly for building DTOs */
    @Query("SELECT DISTINCT c FROM Cart c LEFT JOIN FETCH c.items ci LEFT JOIN FETCH ci.product WHERE c.customer.userId = :customerId AND c.status = :status")
    List<Cart> findByCustomerIdAndStatusWithItems(@Param("customerId") Integer customerId, @Param("status") Integer status);
}
