package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.*;
import com.fruitshop.backend.model.*;
import com.fruitshop.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements com.fruitshop.backend.service.CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ApiResponse<CartDto> addToCart(AddToCartRequestDto dto) {
        Integer userId = dto != null ? dto.getUserId() : null;
        if (userId == null) {
            return ApiResponse.error("User ID is required");
        }

        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find product
        Optional<Product> productOpt = productRepository.findById(dto.getProductId());
        if (productOpt.isEmpty()) {
            return ApiResponse.error("Product not found");
        }
        Product product = productOpt.get();

        // Validate product is active
        if (product.getIsActive() != null && !product.getIsActive()) {
            return ApiResponse.error("Product is not available");
        }

        // Prevent 500 when legacy data has NULL stock
        if (product.getStock() == null) {
            return ApiResponse.error("Product stock is invalid");
        }
        
        System.out.println("addToCart -> userId: " + userId);

        // Find or create cart
        Cart cart = cartRepository.findByShellerUserId(userId).orElse(null);
        System.out.println("cart before save: " + (cart != null ? cart.getCartId() : "null"));
        if (cart == null) {
            cart = new Cart();
            cart.setSheller(user);
            cart = cartRepository.save(cart);
            cartRepository.flush();
            log.info("Created new cart with ID: {} for user: {}", cart.getCartId(), userId);
        }
        System.out.println("cart after save: " + cart.getCartId());

        // Check if item already in cart
        Optional<CartItem> existingItem = cartItemRepository.findByCartAndProduct(cart, product);
        if (existingItem.isPresent()) {
            // Update quantity
            CartItem item = existingItem.get();
            int newQty = item.getQuantity() + dto.getQuantity();

            // Validate stock
            if (newQty > product.getStock()) {
                return ApiResponse.error("Not enough stock. Available: " + product.getStock());
            }

            item.setQuantity(newQty);
            try {
                cartItemRepository.save(item);
            } catch (DataIntegrityViolationException e) {
                log.error("Failed to update cart item due to DB constraint", e);
                return ApiResponse.error("Cart item data is incompatible with current database schema");
            }
            log.info("Updated cart item quantity to {} for product: {}", newQty, product.getName());
        } else {
            // Validate stock
            if (dto.getQuantity() > product.getStock()) {
                return ApiResponse.error("Not enough stock. Available: " + product.getStock());
            }

            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(dto.getQuantity());
            try {
                cartItemRepository.save(newItem);
            } catch (DataIntegrityViolationException e) {
                log.error("Failed to insert cart item due to DB constraint", e);
                return ApiResponse.error("Cart item data is incompatible with current database schema");
            }
            log.info("Added new cart item: product={}, qty={}", product.getName(), dto.getQuantity());
        }

        // Flush to ensure all saves are committed before building DTO
        cartItemRepository.flush();

        return ApiResponse.success("Added to cart", buildCartDto(cart));
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<CartDto> getCart(Integer userId) {
        System.out.println("getCart -> userId: " + userId);
        Optional<Cart> cartOpt = cartRepository.findByShellerUserId(userId);
        if (cartOpt.isEmpty()) {
            System.out.println("getCart -> Number of cart items: 0");
            CartDto emptyCart = new CartDto();
            emptyCart.setUserId(userId);
            emptyCart.setTotalItems(0);
            emptyCart.setTotalPrice(BigDecimal.ZERO);
            emptyCart.setItems(new ArrayList<>());
            return ApiResponse.success(emptyCart);
        }
        return ApiResponse.success(buildCartDto(cartOpt.get()));
    }

    @Override
    @Transactional
    public ApiResponse<CartDto> updateCartItem(Integer userId, Integer cartItemId, Integer quantity) {
        Optional<Cart> cartOpt = cartRepository.findByShellerUserId(userId);
        if (cartOpt.isEmpty()) {
            return ApiResponse.error("Cart not found");
        }
        Cart cart = cartOpt.get();

        Optional<CartItem> itemOpt = cartItemRepository.findById(cartItemId);
        if (itemOpt.isEmpty()) {
            return ApiResponse.error("Cart item not found");
        }

        CartItem item = itemOpt.get();

        // Verify item belongs to user's cart
        if (!item.getCart().getCartId().equals(cart.getCartId())) {
            return ApiResponse.error("Cart item does not belong to this user");
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            cartItemRepository.delete(item);
            cartItemRepository.flush();
            return ApiResponse.success("Item removed from cart", buildCartDto(cart));
        }

        // Validate stock
        if (item.getProduct().getStock() == null) {
            return ApiResponse.error("Product stock is invalid");
        }
        if (quantity > item.getProduct().getStock()) {
            return ApiResponse.error("Not enough stock. Available: " + item.getProduct().getStock());
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return ApiResponse.success("Cart updated", buildCartDto(cart));
    }

    @Override
    @Transactional
    public ApiResponse<String> removeCartItem(Integer userId, Integer cartItemId) {
        Optional<Cart> cartOpt = cartRepository.findByShellerUserId(userId);
        if (cartOpt.isEmpty()) {
            return ApiResponse.error("Cart not found");
        }
        Cart cart = cartOpt.get();

        Optional<CartItem> itemOpt = cartItemRepository.findById(cartItemId);
        if (itemOpt.isEmpty()) {
            return ApiResponse.error("Cart item not found");
        }

        CartItem item = itemOpt.get();
        if (!item.getCart().getCartId().equals(cart.getCartId())) {
            return ApiResponse.error("Cart item does not belong to this user");
        }

        cartItemRepository.delete(item);
        return ApiResponse.success("Item removed from cart", null);
    }

    @Override
    @Transactional
    public ApiResponse<String> clearCart(Integer userId) {
        Optional<Cart> cartOpt = cartRepository.findByShellerUserId(userId);
        if (cartOpt.isEmpty()) {
            return ApiResponse.error("Cart not found");
        }
        cartItemRepository.deleteByCart(cartOpt.get());
        return ApiResponse.success("Cart cleared", null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<java.util.Map<String, Object>> getCartDebug(Integer userId) {
        Optional<Cart> cartOpt = cartRepository.findByShellerUserId(userId); 
        if (cartOpt.isEmpty()) {
            return new ArrayList<>();
        }
        
        List<CartItem> items = cartItemRepository.findByCart(cartOpt.get());
        List<java.util.Map<String, Object>> debugItems = new ArrayList<>();
        
        for (CartItem item : items) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("productId", item.getProduct() != null ? item.getProduct().getProductId() : null);
            map.put("price", item.getProduct() != null ? item.getProduct().getPrice() : null);
            map.put("quantity", item.getQuantity());
            debugItems.add(map);
        }
        return debugItems;
    }

    // ========== Helper Methods ==========

    private CartDto buildCartDto(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCart(cart);
        System.out.println("buildCartDto -> Number of cart items: " + items.size());

        List<CartItemDto> itemDtos = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (CartItem item : items) {
            CartItemDto dto = new CartItemDto();
            dto.setCartItemId(item.getCartItemId());
            dto.setProductId(item.getProduct().getProductId());
            dto.setProductName(item.getProduct().getName());
            dto.setPrice(item.getProduct().getPrice());
            dto.setQuantity(item.getQuantity());
            dto.setSubtotal(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            dto.setImageUrl(item.getProduct().getImageUrl());
            itemDtos.add(dto);

            totalPrice = totalPrice.add(dto.getSubtotal());
        }

        CartDto cartDto = new CartDto();
        cartDto.setCartId(cart.getCartId());
        cartDto.setUserId(cart.getSheller().getUserId());
        cartDto.setTotalItems(items.size());
        cartDto.setTotalPrice(totalPrice);
        cartDto.setItems(itemDtos);
        return cartDto;
    }
}
