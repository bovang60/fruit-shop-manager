package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.*;
import com.fruitshop.backend.model.*;
import com.fruitshop.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceImplTest {

    @Mock
    private CartRepository cartRepository;
    @Mock
    private CartItemRepository cartItemRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartServiceImpl cartService;

    private User customer;
    private User seller;
    private Shop shop;
    private Product product;
    private Cart cart;
    private CartItem cartItem;

    @BeforeEach
    void setUp() {
        // Setup Customer
        customer = new User();
        customer.setUserId(1);
        customer.setFullName("John Doe");

        // Setup Seller
        seller = new User();
        seller.setUserId(2);
        seller.setFullName("Jane Shop");

        // Setup Shop
        shop = new Shop();
        shop.setShopId(1);
        shop.setOwner(seller);
        shop.setShopName("Jane's Fruits");

        // Setup Product
        product = new Product();
        product.setProductId(1);
        product.setName("Apple");
        product.setPrice(new BigDecimal("10.00"));
        product.setStock(100);
        product.setIsActive(true);
        product.setShop(shop);

        // Setup Cart
        cart = new Cart();
        cart.setCartId(1);
        cart.setCustomer(customer);
        cart.setShop(shop);
        cart.setStatus(Cart.STATUS_IN_CART);
        cart.setItems(new ArrayList<>());

        // Setup CartItem
        cartItem = new CartItem();
        cartItem.setCartItemId(1);
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(2);
        cart.getItems().add(cartItem);
    }

    // ==============================================
    // addToCart Tests
    // ==============================================

    @Test
    void addToCart_Success_NewItem() {
        AddToCartRequestDto request = new AddToCartRequestDto();
        request.setUserId(1);
        request.setProductId(1);
        request.setQuantity(3);

        when(userRepository.findById(1)).thenReturn(Optional.of(customer));
        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        when(cartRepository.findByCustomerAndShopAndStatus(customer, shop, Cart.STATUS_IN_CART))
                .thenReturn(Optional.of(cart));
        when(cartItemRepository.findByCartAndProduct(cart, product)).thenReturn(Optional.empty());
        // For buildCartDto helper mock
        when(cartRepository.findByCustomerIdAndStatusWithItems(1, Cart.STATUS_IN_CART))
                .thenReturn(List.of(cart));

        ApiResponse<CartDto> response = cartService.addToCart(request);

        assertEquals(0, response.getResultCd());
        assertEquals("Added to cart", response.getMessage());
        verify(cartItemRepository, times(1)).save(any(CartItem.class));
    }

    @Test
    void addToCart_Success_ExistingItem() {
        AddToCartRequestDto request = new AddToCartRequestDto();
        request.setUserId(1);
        request.setProductId(1);
        request.setQuantity(3);

        when(userRepository.findById(1)).thenReturn(Optional.of(customer));
        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        when(cartRepository.findByCustomerAndShopAndStatus(customer, shop, Cart.STATUS_IN_CART))
                .thenReturn(Optional.of(cart));
        when(cartItemRepository.findByCartAndProduct(cart, product)).thenReturn(Optional.of(cartItem));
        when(cartRepository.findByCustomerIdAndStatusWithItems(1, Cart.STATUS_IN_CART))
                .thenReturn(List.of(cart));

        ApiResponse<CartDto> response = cartService.addToCart(request);

        assertEquals(0, response.getResultCd());
        assertEquals(5, cartItem.getQuantity()); // 2 + 3 = 5
        verify(cartItemRepository, times(1)).save(cartItem);
    }

    @Test
    void addToCart_Fail_UserNotFound() {
        AddToCartRequestDto request = new AddToCartRequestDto();
        request.setUserId(99);
        request.setProductId(1);
        request.setQuantity(1);

        when(userRepository.findById(99)).thenReturn(Optional.empty());

        ApiResponse<CartDto> response = cartService.addToCart(request);

        assertEquals(1, response.getResultCd());
        assertEquals("User not found", response.getMessage());
    }

    @Test
    void addToCart_Fail_ProductInactive() {
        product.setIsActive(false);

        AddToCartRequestDto request = new AddToCartRequestDto();
        request.setUserId(1);
        request.setProductId(1);
        request.setQuantity(1);

        when(userRepository.findById(1)).thenReturn(Optional.of(customer));
        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        ApiResponse<CartDto> response = cartService.addToCart(request);

        assertEquals(1, response.getResultCd());
        assertEquals("Product is not available", response.getMessage());
    }

    @Test
    void addToCart_Fail_NotEnoughStock() {
        AddToCartRequestDto request = new AddToCartRequestDto();
        request.setUserId(1);
        request.setProductId(1);
        request.setQuantity(999); // Exceeds product stock (100)

        when(userRepository.findById(1)).thenReturn(Optional.of(customer));
        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        when(cartRepository.findByCustomerAndShopAndStatus(customer, shop, Cart.STATUS_IN_CART))
                .thenReturn(Optional.of(cart));
        when(cartItemRepository.findByCartAndProduct(cart, product)).thenReturn(Optional.empty());

        ApiResponse<CartDto> response = cartService.addToCart(request);

        assertEquals(1, response.getResultCd());
        assertEquals("Tạm thời hết hàng. Vui lòng quay lại sau", response.getMessage());
    }

    @Test
    void addToCart_Fail_SellerBuysOwnProduct() {
        // userId 2 is the seller/owner of the shop
        AddToCartRequestDto request = new AddToCartRequestDto();
        request.setUserId(2); 
        request.setProductId(1);
        request.setQuantity(1);

        when(userRepository.findById(2)).thenReturn(Optional.of(seller));
        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        ApiResponse<CartDto> response = cartService.addToCart(request);

        assertEquals(1, response.getResultCd());
        assertEquals("You cannot add your own product to cart", response.getMessage());
    }

    // ==============================================
    // updateCartItem Tests
    // ==============================================

    @Test
    void updateCartItem_Success_IncreaseQuantity() {
        when(cartItemRepository.findById(1)).thenReturn(Optional.of(cartItem));
        when(cartRepository.findByCustomerIdAndStatusWithItems(1, Cart.STATUS_IN_CART))
                .thenReturn(List.of(cart));

        ApiResponse<CartDto> response = cartService.updateCartItem(1, 1, 5);

        assertEquals(0, response.getResultCd());
        assertEquals("Cart updated", response.getMessage());
        assertEquals(5, cartItem.getQuantity());
        verify(cartItemRepository, times(1)).save(cartItem);
    }

    @Test
    void updateCartItem_Success_RemoveWhenZero() {
        when(cartItemRepository.findById(1)).thenReturn(Optional.of(cartItem));
        // Mocks for cleanup
        when(cartItemRepository.findByCart(cart)).thenReturn(new ArrayList<>());
        when(cartRepository.findByCustomerIdAndStatusWithItems(1, Cart.STATUS_IN_CART))
                .thenReturn(List.of(cart));

        ApiResponse<CartDto> response = cartService.updateCartItem(1, 1, 0);

        assertEquals(0, response.getResultCd());
        assertEquals("Item removed from cart", response.getMessage());
        verify(cartItemRepository, times(1)).delete(cartItem);
        // Cart Cleanup should trigger deleting the cart since it's empty
        verify(cartRepository, times(1)).delete(cart);
    }

    @Test
    void updateCartItem_Fail_WrongUser() {
        when(cartItemRepository.findById(1)).thenReturn(Optional.of(cartItem));

        // Try to update with User ID 99 (Hacker)
        ApiResponse<CartDto> response = cartService.updateCartItem(99, 1, 5);

        assertEquals(1, response.getResultCd());
        assertEquals("Cart item does not belong to this user", response.getMessage());
        verify(cartItemRepository, never()).save(any());
    }

    // ==============================================
    // removeCartItem and clearCart Tests
    // ==============================================

    @Test
    void removeCartItem_Success() {
        when(cartItemRepository.findById(1)).thenReturn(Optional.of(cartItem));
        when(cartItemRepository.findByCart(cart)).thenReturn(new ArrayList<>());

        ApiResponse<String> response = cartService.removeCartItem(1, 1);

        assertEquals(0, response.getResultCd());
        assertEquals("Item removed from cart", response.getMessage());
        verify(cartItemRepository, times(1)).delete(cartItem);
        verify(cartRepository, times(1)).delete(cart);
    }

    @Test
    void clearCart_Success() {
        when(cartRepository.findByCustomerUserIdAndStatus(1, Cart.STATUS_IN_CART))
                .thenReturn(List.of(cart));

        ApiResponse<String> response = cartService.clearCart(1);

        assertEquals(0, response.getResultCd());
        assertEquals("Cart cleared", response.getMessage());
        verify(cartRepository, times(1)).deleteAll(anyList());
    }
}
