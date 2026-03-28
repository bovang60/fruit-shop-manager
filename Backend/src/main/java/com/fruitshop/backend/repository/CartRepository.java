package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Cart;
import com.fruitshop.backend.model.Product;
import com.fruitshop.backend.model.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

    // ========== Legacy method (kept for backward compat) ==========
    Optional<Cart> findBySellerUserId(Integer userId);

    // ========== New Cart-based flow methods ==========

    /** Get all pending cart items for a customer */
    List<Cart> findByCustomerUserIdAndStatus(Integer customerId, Integer status);

    /** Get all cart items for a customer (any status) */
    List<Cart> findByCustomerUserIdOrderByCreatedAtDesc(Integer customerId);

    /** Get all cart items for a customer with specific statuses */
    List<Cart> findByCustomerUserIdAndStatusInOrderByCreatedAtDesc(Integer customerId, List<Integer> statuses);

    /** Find existing pending cart for same customer + product (to merge quantities) */
    Optional<Cart> findByCustomerAndProductAndStatus(User customer, Product product, Integer status);

    /** Find by cartId with pessimistic lock for checkout / cancel */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Cart c WHERE c.cartId = :cartId")
    Optional<Cart> findByIdForUpdate(@Param("cartId") Integer cartId);

    /** Get carts by seller and status (for seller dashboard) */
    List<Cart> findBySellerUserIdAndStatus(Integer sellerId, Integer status);

    /** Get carts by seller (for seller order management) */
    List<Cart> findBySellerUserIdAndStatusInOrderByCreatedAtDesc(Integer sellerId, List<Integer> statuses);
}
