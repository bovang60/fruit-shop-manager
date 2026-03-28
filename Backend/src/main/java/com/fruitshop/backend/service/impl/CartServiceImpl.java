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
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // =====================================================================
    //  ADD TO CART — Customer adds product, creates Cart(status=0)
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

        // --- Prevent customer buying own product ---
        if (product.getShop() != null && product.getShop().getOwner() != null
                && product.getShop().getOwner().getUserId().equals(userId)) {
            return ApiResponse.error("You cannot add your own product to cart");
        }

        // --- Get seller from product → shop → owner ---
        User seller = null;
        if (product.getShop() != null && product.getShop().getOwner() != null) {
            seller = product.getShop().getOwner();
        }
        if (seller == null) {
            return ApiResponse.error("Product is not assigned to any shop/seller");
        }

        // --- Check if same product already in cart → merge quantity ---
        Optional<Cart> existingCart = cartRepository
                .findByCustomerAndProductAndStatus(customer, product, Cart.STATUS_IN_CART);

        if (existingCart.isPresent()) {
            Cart cart = existingCart.get();
            int newQty = cart.getQuantity() + dto.getQuantity();

            // Validate stock (soft check, real validation at checkout)
            if (newQty > product.getStock()) {
                return ApiResponse.error("Not enough stock. Available: " + product.getStock());
            }

            cart.setQuantity(newQty);
            cartRepository.save(cart);
            log.info("Updated pending cart {} quantity to {} for product: {}",
                    cart.getCartId(), newQty, product.getName());
        } else {
            // Validate stock
            if (dto.getQuantity() > product.getStock()) {
                return ApiResponse.error("Not enough stock. Available: " + product.getStock());
            }

            Cart newCart = new Cart();
            newCart.setCustomer(customer);
            newCart.setSeller(seller);
            newCart.setProduct(product);
            newCart.setQuantity(dto.getQuantity());
            newCart.setStatus(Cart.STATUS_IN_CART);
            cartRepository.save(newCart);
            log.info("Created new cart for customer={}, product={}, qty={}",
                    userId, product.getName(), dto.getQuantity());
        }

        return ApiResponse.success("Added to cart", buildCartDto(userId));
    }

    // =====================================================================
    //  GET CART — All pending items for a customer
    // =====================================================================
    @Override
    @Transactional(readOnly = true)
    public ApiResponse<CartDto> getCart(Integer userId) {
        return ApiResponse.success(buildCartDto(userId));
    }

    // =====================================================================
    //  UPDATE CART ITEM — Change quantity of a pending cart item
    // =====================================================================
    @Override
    @Transactional
    public ApiResponse<CartDto> updateCartItem(Integer userId, Integer cartId, Integer quantity) {
        Optional<Cart> cartOpt = cartRepository.findById(cartId);
        if (cartOpt.isEmpty()) {
            return ApiResponse.error("Cart item not found");
        }

        Cart cart = cartOpt.get();

        // Verify ownership
        if (!cart.getCustomer().getUserId().equals(userId)) {
            return ApiResponse.error("Cart item does not belong to this user");
        }

        // Only in_cart items can be modified
        if (cart.getStatus() != Cart.STATUS_IN_CART) {
            return ApiResponse.error("Only items currently in cart can be modified");
        }

        if (quantity == null || quantity <= 0) {
            cartRepository.delete(cart);
            return ApiResponse.success("Item removed from cart", buildCartDto(userId));
        }

        // Validate stock
        Product product = cart.getProduct();
        if (product.getStock() == null) {
            return ApiResponse.error("Product stock is invalid");
        }
        if (quantity > product.getStock()) {
            return ApiResponse.error("Not enough stock. Available: " + product.getStock());
        }

        cart.setQuantity(quantity);
        cartRepository.save(cart);

        return ApiResponse.success("Cart updated", buildCartDto(userId));
    }

    // =====================================================================
    //  REMOVE CART ITEM — Delete a pending cart item
    // =====================================================================
    @Override
    @Transactional
    public ApiResponse<String> removeCartItem(Integer userId, Integer cartId) {
        Optional<Cart> cartOpt = cartRepository.findById(cartId);
        if (cartOpt.isEmpty()) {
            return ApiResponse.error("Cart item not found");
        }

        Cart cart = cartOpt.get();

        // Verify ownership
        if (!cart.getCustomer().getUserId().equals(userId)) {
            return ApiResponse.error("Cart item does not belong to this user");
        }

        // Only in_cart items can be removed
        if (cart.getStatus() != Cart.STATUS_IN_CART) {
            return ApiResponse.error("Only items currently in cart can be removed");
        }

        cartRepository.delete(cart);
        return ApiResponse.success("Item removed from cart", null);
    }

    // =====================================================================
    //  CLEAR CART — Delete all pending cart items for a customer
    // =====================================================================
    @Override
    @Transactional
    public ApiResponse<String> clearCart(Integer userId) {
        List<Cart> pendingCarts = cartRepository
                .findByCustomerUserIdAndStatus(userId, Cart.STATUS_IN_CART);
        if (pendingCarts.isEmpty()) {
            return ApiResponse.error("Cart is already empty");
        }
        cartRepository.deleteAll(pendingCarts);
        return ApiResponse.success("Cart cleared", null);
    }

    // Removed order lifecycle methods (checkout, cancel, confirm, complete, history) to enforce single responsibility

    // =====================================================================
    //  DEBUG (DEV only)
    // =====================================================================
    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getCartDebug(Integer userId) {
        List<Cart> carts = cartRepository
                .findByCustomerUserIdAndStatus(userId, Cart.STATUS_IN_CART);
        List<Map<String, Object>> debugItems = new ArrayList<>();

        for (Cart cart : carts) {
            Map<String, Object> map = new HashMap<>();
            map.put("cartId", cart.getCartId());
            map.put("productId", cart.getProduct() != null ? cart.getProduct().getProductId() : null);
            map.put("productName", cart.getProduct() != null ? cart.getProduct().getName() : null);
            map.put("price", cart.getProduct() != null ? cart.getProduct().getPrice() : null);
            map.put("quantity", cart.getQuantity());
            map.put("status", cart.getStatus());
            map.put("sellerId", cart.getSeller() != null ? cart.getSeller().getUserId() : null);
            debugItems.add(map);
        }
        return debugItems;
    }

    // =====================================================================
    //  HELPER: Build CartDto from customer's pending items
    // =====================================================================
    private CartDto buildCartDto(Integer userId) {
        List<Cart> pendingCarts = cartRepository
                .findByCustomerUserIdAndStatus(userId, Cart.STATUS_IN_CART);

        List<CartItemDto> itemDtos = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (Cart cart : pendingCarts) {
            CartItemDto dto = toCartItemDto(cart);
            itemDtos.add(dto);
            if (dto.getSubtotal() != null) {
                totalPrice = totalPrice.add(dto.getSubtotal());
            }
        }

        CartDto cartDto = new CartDto();
        cartDto.setUserId(userId);
        cartDto.setTotalItems(itemDtos.size());
        cartDto.setTotalPrice(totalPrice);
        cartDto.setItems(itemDtos);
        return cartDto;
    }

    // =====================================================================
    //  HELPER: Convert Cart entity → CartItemDto
    // =====================================================================
    private CartItemDto toCartItemDto(Cart cart) {
        CartItemDto dto = new CartItemDto();
        dto.setCartItemId(cart.getCartId());

        if (cart.getProduct() != null) {
            dto.setProductId(cart.getProduct().getProductId());
            dto.setProductName(cart.getProduct().getName());
            dto.setPrice(cart.getProduct().getPrice());
            dto.setImageUrl(cart.getProduct().getImageUrl());

            BigDecimal price = cart.getProduct().getPrice() != null
                    ? cart.getProduct().getPrice() : BigDecimal.ZERO;
            dto.setSubtotal(price.multiply(BigDecimal.valueOf(cart.getQuantity())));
        }

        dto.setQuantity(cart.getQuantity());
        return dto;
    }
}
