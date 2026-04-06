package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.*;
import com.fruitshop.backend.model.*;
import com.fruitshop.backend.repository.*;
import com.fruitshop.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // =====================================================================
    //  ADD TO CART — Auto-groups by shop
    // =====================================================================
    @Override
    @Transactional
    public ApiResponse<CartDto> addToCart(AddToCartRequestDto dto) {
        // --- Validate input ---
        if (dto == null || dto.getUserId() == null) {
            return ApiResponse.error("User ID is required");
        }
        Integer userId = dto.getUserId();
        if (dto.getQuantity() == null || dto.getQuantity() <= 0) {
            return ApiResponse.error("Quantity must be greater than 0");
        }

        // --- Find customer ---
        User customer = userRepository.findById(userId).orElse(null);
        if (customer == null) {
            return ApiResponse.error("User not found");
        }

        // --- Find product ---
        Product product = productRepository.findById(dto.getProductId()).orElse(null);
        if (product == null) {
            return ApiResponse.error("Product not found");
        }

        // --- Validate product is active ---
        if (product.getIsActive() != null && !product.getIsActive()) {
            return ApiResponse.error("Product is not available");
        }

        // --- Validate stock exists ---
        if (product.getStock() == null) {
            return ApiResponse.error("Product stock is invalid");
        }

        // --- Get shop from product ---
        Shop shop = product.getShop();
        if (shop == null) {
            return ApiResponse.error("Product is not assigned to any shop");
        }

        // --- Prevent customer buying own product ---
        if (shop.getOwner() != null && shop.getOwner().getUserId().equals(userId)) {
            return ApiResponse.error("You cannot add your own product to cart");
        }

        // --- Find or create Cart for this customer + shop ---
        Optional<Cart> existingCartOpt = cartRepository
                .findByCustomerAndShopAndStatus(customer, shop, Cart.STATUS_IN_CART);

        Cart cart;
        if (existingCartOpt.isPresent()) {
            cart = existingCartOpt.get();
        } else {
            cart = new Cart();
            cart.setCustomer(customer);
            cart.setShop(shop);
            cart.setStatus(Cart.STATUS_IN_CART);
            cart = cartRepository.save(cart);
            log.info("Created new cart for customer={}, shop={}", userId, shop.getShopId());
        }

        // --- Find or create CartItem for this product in the cart ---
        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartAndProduct(cart, product);

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            int newQty = existingItem.getQuantity() + dto.getQuantity();

            // Validate stock
            if (newQty > product.getStock()) {
                return ApiResponse.error("Tạm thời hết hàng. Vui lòng quay lại sau");
            }

            existingItem.setQuantity(newQty);
            cartItemRepository.save(existingItem);
            log.info("Updated cart item quantity to {} for product: {}", newQty, product.getName());
        } else {
            // Validate stock
            if (dto.getQuantity() > product.getStock()) {
                return ApiResponse.error("Tạm thời hết hàng. Vui lòng quay lại sau");
            }

            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(dto.getQuantity());
            cartItemRepository.save(newItem);
            log.info("Added new item to cart: product={}, qty={}", product.getName(), dto.getQuantity());
        }

        return ApiResponse.success("Added to cart", buildCartDto(userId));
    }

    // =====================================================================
    //  GET CART — All in-cart items grouped by shop
    // =====================================================================
    @Override
    @Transactional(readOnly = true)
    public ApiResponse<CartDto> getCart(Integer userId) {
        return ApiResponse.success(buildCartDto(userId));
    }

    // =====================================================================
    //  UPDATE CART ITEM — Change quantity of a CartItem
    // =====================================================================
    @Override
    @Transactional
    public ApiResponse<CartDto> updateCartItem(Integer userId, Integer cartItemId, Integer quantity) {
        Optional<CartItem> itemOpt = cartItemRepository.findById(cartItemId);
        if (itemOpt.isEmpty()) {
            return ApiResponse.error("Cart item not found");
        }

        CartItem item = itemOpt.get();
        Cart cart = item.getCart();

        // Verify ownership
        if (!cart.getCustomer().getUserId().equals(userId)) {
            return ApiResponse.error("Cart item does not belong to this user");
        }

        // Only in_cart items can be modified
        if (cart.getStatus() != Cart.STATUS_IN_CART) {
            return ApiResponse.error("Only items currently in cart can be modified");
        }

        // If quantity <= 0, remove item
        if (quantity == null || quantity <= 0) {
            cartItemRepository.delete(item);
            // If cart has no more items, remove the cart too
            cleanupEmptyCart(cart);
            return ApiResponse.success("Item removed from cart", buildCartDto(userId));
        }

        // Validate stock
        Product product = item.getProduct();
        if (product.getStock() == null) {
            return ApiResponse.error("Product stock is invalid");
        }
        if (quantity > product.getStock()) {
            return ApiResponse.error("Tạm thời hết hàng. Vui lòng quay lại sau");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return ApiResponse.success("Cart updated", buildCartDto(userId));
    }

    // =====================================================================
    //  REMOVE CART ITEM — Delete a CartItem
    // =====================================================================
    @Override
    @Transactional
    public ApiResponse<String> removeCartItem(Integer userId, Integer cartItemId) {
        Optional<CartItem> itemOpt = cartItemRepository.findById(cartItemId);
        if (itemOpt.isEmpty()) {
            return ApiResponse.error("Cart item not found");
        }

        CartItem item = itemOpt.get();
        Cart cart = item.getCart();

        // Verify ownership
        if (!cart.getCustomer().getUserId().equals(userId)) {
            return ApiResponse.error("Cart item does not belong to this user");
        }

        // Only in_cart items can be removed
        if (cart.getStatus() != Cart.STATUS_IN_CART) {
            return ApiResponse.error("Only items currently in cart can be removed");
        }

        cartItemRepository.delete(item);
        // If cart has no more items, remove the cart too
        cleanupEmptyCart(cart);

        return ApiResponse.success("Item removed from cart", null);
    }

    // =====================================================================
    //  CLEAR CART — Delete all carts + items for a customer
    // =====================================================================
    @Override
    @Transactional
    public ApiResponse<String> clearCart(Integer userId) {
        List<Cart> carts = cartRepository
                .findByCustomerUserIdAndStatus(userId, Cart.STATUS_IN_CART);
        if (carts.isEmpty()) {
            return ApiResponse.error("Cart is already empty");
        }
        // CascadeType.ALL + orphanRemoval will delete CartItems too
        cartRepository.deleteAll(carts);
        return ApiResponse.success("Cart cleared", null);
    }

    // =====================================================================
    //  DEBUG (DEV only)
    // =====================================================================
    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getCartDebug(Integer userId) {
        List<Cart> carts = cartRepository
                .findByCustomerIdAndStatusWithItems(userId, Cart.STATUS_IN_CART);
        List<Map<String, Object>> debugItems = new ArrayList<>();

        for (Cart cart : carts) {
            for (CartItem item : cart.getItems()) {
                Map<String, Object> map = new HashMap<>();
                map.put("cartId", cart.getCartId());
                map.put("shopId", cart.getShop() != null ? cart.getShop().getShopId() : null);
                map.put("shopName", cart.getShop() != null ? cart.getShop().getShopName() : null);
                map.put("cartItemId", item.getCartItemId());
                map.put("productId", item.getProduct() != null ? item.getProduct().getProductId() : null);
                map.put("productName", item.getProduct() != null ? item.getProduct().getName() : null);
                map.put("price", item.getProduct() != null ? item.getProduct().getPrice() : null);
                map.put("quantity", item.getQuantity());
                map.put("status", cart.getStatus());
                debugItems.add(map);
            }
        }
        return debugItems;
    }

    // =====================================================================
    //  HELPER: Build CartDto grouped by shop
    // =====================================================================
    private CartDto buildCartDto(Integer userId) {
        List<Cart> carts = cartRepository
                .findByCustomerIdAndStatusWithItems(userId, Cart.STATUS_IN_CART);

        List<ShopCartDto> shopCartDtos = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;
        int totalItems = 0;

        for (Cart cart : carts) {
            ShopCartDto shopCartDto = new ShopCartDto();
            shopCartDto.setCartId(cart.getCartId());

            if (cart.getShop() != null) {
                shopCartDto.setShopId(cart.getShop().getShopId());
                shopCartDto.setShopName(cart.getShop().getShopName());
            }

            List<CartItemDto> itemDtos = new ArrayList<>();
            BigDecimal shopSubtotal = BigDecimal.ZERO;

            for (CartItem item : cart.getItems()) {
                CartItemDto dto = toCartItemDto(item);
                itemDtos.add(dto);
                if (dto.getSubtotal() != null) {
                    shopSubtotal = shopSubtotal.add(dto.getSubtotal());
                }
                totalItems++;
            }

            shopCartDto.setItems(itemDtos);
            shopCartDto.setShopSubtotal(shopSubtotal);
            shopCartDtos.add(shopCartDto);

            totalPrice = totalPrice.add(shopSubtotal);
        }

        CartDto cartDto = new CartDto();
        cartDto.setUserId(userId);
        cartDto.setTotalItems(totalItems);
        cartDto.setTotalPrice(totalPrice);
        cartDto.setShopCarts(shopCartDtos);
        return cartDto;
    }

    // =====================================================================
    //  HELPER: Convert CartItem → CartItemDto
    // =====================================================================
    private CartItemDto toCartItemDto(CartItem item) {
        CartItemDto dto = new CartItemDto();
        dto.setCartItemId(item.getCartItemId());

        if (item.getProduct() != null) {
            dto.setProductId(item.getProduct().getProductId());
            dto.setProductName(item.getProduct().getName());
            dto.setPrice(item.getProduct().getPrice());
            dto.setImageUrl(item.getProduct().getImageUrl());

            BigDecimal price = item.getProduct().getPrice() != null
                    ? item.getProduct().getPrice() : BigDecimal.ZERO;
            dto.setSubtotal(price.multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        dto.setQuantity(item.getQuantity());
        return dto;
    }

    // =====================================================================
    //  HELPER: Remove cart if it has no more items
    // =====================================================================
    private void cleanupEmptyCart(Cart cart) {
        // Refresh the items list
        List<CartItem> remaining = cartItemRepository.findByCart(cart);
        if (remaining.isEmpty()) {
            cartRepository.delete(cart);
            log.info("Removed empty cart: cartId={}", cart.getCartId());
        }
    }
}
