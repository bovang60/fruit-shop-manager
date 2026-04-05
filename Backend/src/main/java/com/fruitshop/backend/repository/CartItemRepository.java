package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Cart;
import com.fruitshop.backend.model.CartItem;
import com.fruitshop.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCart(Cart cart);
    List<CartItem> findByCartCartId(Integer cartId);
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
    void deleteByCart(Cart cart);
}
