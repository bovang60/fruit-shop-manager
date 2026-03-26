package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.*;
import com.fruitshop.backend.model.*;
import com.fruitshop.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements com.fruitshop.backend.service.OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final com.fruitshop.backend.repository.ShippingMethodRepository shippingMethodRepository;

    @Override
    @Transactional
    public ApiResponse<OrderResponse> createOrder(Integer userId, OrderRequest request) {
        System.out.println("createOrder -> userId: " + userId);
        
        // Fetch user from db
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate Shipping Method
        if (request.getShippingMethodId() == null) {
            return ApiResponse.error("Shipping method is required");
        }
        
        com.fruitshop.backend.model.ShippingMethod shippingMethod = shippingMethodRepository.findById(request.getShippingMethodId()).orElse(null);
        if (shippingMethod == null) {
            return ApiResponse.error("Shipping method not found");
        }
        
        if (Boolean.FALSE.equals(shippingMethod.getIsAvailable())) {
            return ApiResponse.error("Shipping method is not available");
        }
        
        BigDecimal shippingFee = shippingMethod.getFixedFee() != null ? shippingMethod.getFixedFee() : BigDecimal.ZERO;

        // Fetch user's actual cart
        Optional<Cart> cartOpt = cartRepository.findByUserUserId(userId);
        if (cartOpt.isEmpty()) {
            return ApiResponse.error("Cart not found. Cannot create order.");
        }
        
        Cart cart = cartOpt.get();
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);

        if (cartItems.isEmpty()) {
            return ApiResponse.error("Cart is empty. Cannot create order.");
        }
        
        System.out.println("createOrder -> cartItems count: " + cartItems.size());

        // 1. Calculate totalAmount
        BigDecimal subTotal = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            if (item.getProduct() != null && item.getProduct().getPrice() != null) {
                subTotal = subTotal.add(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            }
        }
        
        BigDecimal totalAmount = subTotal.add(shippingFee);
        
        System.out.println("createOrder -> subTotal: " + subTotal + ", shippingFee: " + shippingFee + ", totalAmount: " + totalAmount);

        // 2. To save Order in this existing architecture, we MUST create a Transaction first (nullable = false)
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setTotalPayment(totalAmount);
        transaction.setPaymentStatus(Transaction.PaymentStatus.UNPAID);
        try {
            transaction.setPaymentMethod(Transaction.PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase()));
        } catch (Exception e) {
            transaction.setPaymentMethod(Transaction.PaymentMethod.COD);
        }
        
        // Save the transaction to avoid TransientPropertyValueException
        transaction = transactionRepository.save(transaction);

        // 3. We also need a Shop (nullable = false). Pick from cart or DB.
        Shop shop = null;
        if (cartItems.get(0).getProduct() != null && cartItems.get(0).getProduct().getShop() != null) {
            shop = cartItems.get(0).getProduct().getShop();
        } else {
            List<Product> allProducts = productRepository.findAll();
            if (!allProducts.isEmpty() && allProducts.get(0).getShop() != null) {
                shop = allProducts.get(0).getShop();
            }
        }

        // 4. Create and Save Order Entity using existing structure
        System.out.println("Preparing to save order... totalAmount: " + totalAmount);
        
        Order order = new Order();
        order.setTransaction(transaction);
        order.setShop(shop); 
        order.setUser(user);
        order.setReceiverName(request.getCustomerName());
        order.setReceiverPhone(request.getPhone());
        order.setShippingAddress(request.getAddress());
        order.setNote(request.getNote());
        order.setSubTotal(subTotal);
        order.setShippingFee(shippingFee);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setCreatedAt(java.time.LocalDateTime.now());

        Order savedOrder;
        try {
            savedOrder = orderRepository.save(order);
            System.out.println("Saved order successfully! ID: " + savedOrder.getOrderId());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to save order: " + e.getMessage());
            return ApiResponse.error("Error saving order");
        }

        // 4b. Create OrderItem from Cart
        List<OrderItem> orderItems = new java.util.ArrayList<>();
        for (CartItem cartItem : cartItems) {
            if (cartItem.getProduct() == null) {
                return ApiResponse.error("CartItem product is missing");
            }

            Optional<Product> productOpt = productRepository.findById(cartItem.getProduct().getProductId());
            if (productOpt.isEmpty()) {
                return ApiResponse.error("Product with ID " + cartItem.getProduct().getProductId() + " not found");
            }
            Product product = productOpt.get();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product); // Setting entity relationship
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());
            
            System.out.println("createOrder -> productId: " + cartItem.getProduct().getProductId());
            
            orderItems.add(orderItem);
        }
        
        System.out.println("SavedOrder ID: " + savedOrder.getOrderId());
        System.out.println("Number of orderItems: " + orderItems.size());
        
        try {
            orderItemRepository.saveAll(orderItems);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Error saving order items");
        }
        
        // 5. CLEAR CART (Enterprise Standard)
        cartItemRepository.deleteByCart(cart);
        System.out.println("createOrder -> Cart cleared successfully for userId: " + userId);
        
        // 6. Log SELLER notification
        java.util.List<User> sellers = userRepository.findByRole(User.Role.SELLER);
        for (User seller : sellers) {
            System.out.println("New order " + savedOrder.getOrderId() + " created. Seller " + seller.getUserId() + " notified.");
        }

        // 5. Build Response
        OrderResponse response = new OrderResponse();
        response.setOrderId(savedOrder.getOrderId());
        response.setTotalAmount(totalAmount);
        response.setShippingFee(shippingFee);
        response.setStatus(savedOrder.getStatus().name());
        response.setCreatedAt(savedOrder.getCreatedAt());
        
        return ApiResponse.success("Order saved successfully", response);
    }

    @Override
    @Transactional
    public ApiResponse<List<OrderDto>> checkout(CheckoutRequestDto dto) {
        // 1. Find user
        Optional<User> userOpt = userRepository.findById(dto.getUserId());
        if (userOpt.isEmpty()) {
            return ApiResponse.error("User not found");
        }
        User user = userOpt.get();

        // 2. Find cart and validate non-empty
        Optional<Cart> cartOpt = cartRepository.findByUserUserId(dto.getUserId());
        if (cartOpt.isEmpty()) {
            return ApiResponse.error("Cart not found");
        }
        Cart cart = cartOpt.get();

        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        if (cartItems.isEmpty()) {
            return ApiResponse.error("Cart is empty");
        }

        // 3. Lock fruit rows and validate stock (PESSIMISTIC_WRITE prevents race condition)
        for (CartItem cartItem : cartItems) {
            Product lockedProduct = productRepository.findByIdForUpdate(cartItem.getProduct().getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + cartItem.getProduct().getProductId()));

            if (lockedProduct.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException(
                        "Not enough stock for \"" + lockedProduct.getName()
                                + "\". Available: " + lockedProduct.getStock()
                                + ", Requested: " + cartItem.getQuantity());
            }

            // Update the cartItem's fruit reference to the locked version
            cartItem.setProduct(lockedProduct);
        }

        // 4. Parse payment method
        Transaction.PaymentMethod paymentMethod;
        try {
            paymentMethod = Transaction.PaymentMethod.valueOf(dto.getPaymentMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid payment method: " + dto.getPaymentMethod());
        }

        // 5. Group cart items by shop
        List<CartItem> invalidShopItems = cartItems.stream()
                .filter(item -> item.getProduct() == null || item.getProduct().getShop() == null)
                .toList();
        if (!invalidShopItems.isEmpty()) {
            return ApiResponse.error("Some products are not mapped to any shop");
        }

        Map<Integer, List<CartItem>> itemsByShop = cartItems.stream()
                .collect(Collectors.groupingBy(item -> item.getProduct().getShop().getShopId()));

        // 6. Calculate total payment
        BigDecimal totalPayment = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            totalPayment = totalPayment.add(
                    item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        // 7. Create transaction FIRST
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setTotalPayment(totalPayment);
        transaction.setPaymentMethod(paymentMethod);
        transaction.setPaymentStatus(paymentMethod == Transaction.PaymentMethod.COD
                ? Transaction.PaymentStatus.UNPAID
                : Transaction.PaymentStatus.UNPAID);
        transaction = transactionRepository.save(transaction);

        // 8. For each shop group: create Order, then OrderItems, deduct stock
        List<OrderDto> orderDtos = new ArrayList<>();

        for (Map.Entry<Integer, List<CartItem>> entry : itemsByShop.entrySet()) {
            List<CartItem> shopItems = entry.getValue();
            Shop shop = shopItems.get(0).getProduct().getShop();

            // Calculate sub total for this shop's order
            BigDecimal subTotal = BigDecimal.ZERO;
            for (CartItem item : shopItems) {
                subTotal = subTotal.add(
                        item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            }

            // Save Order FIRST (before OrderItems — FK constraint)
            Order order = new Order();
            order.setTransaction(transaction);
            order.setShop(shop);
            order.setUser(user);
            order.setReceiverName(dto.getReceiverName());
            order.setReceiverPhone(dto.getReceiverPhone());
            order.setShippingAddress(dto.getShippingAddress());
            order.setSubTotal(subTotal);
            order.setShippingFee(BigDecimal.ZERO);
            order.setStatus(Order.OrderStatus.PENDING);
            order.setNote(dto.getNote());
            order = orderRepository.save(order);

            // Save OrderItems and deduct stock
            List<OrderItemDto> orderItemDtos = new ArrayList<>();
            for (CartItem cartItem : shopItems) {
                Product product = cartItem.getProduct();

                // Create OrderItem
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setPrice(product.getPrice());
                orderItemRepository.save(orderItem);

                // Deduct stock (fruit is already locked by PESSIMISTIC_WRITE)
                product.setStock(product.getStock() - cartItem.getQuantity());
                productRepository.save(product);

                // Build DTO
                OrderItemDto itemDto = new OrderItemDto();
                itemDto.setOrderItemId(orderItem.getOrderItemId());
                itemDto.setProductId(product.getProductId());
                itemDto.setProductName(product.getName());
                itemDto.setImageUrl(product.getImageUrl());
                itemDto.setQuantity(cartItem.getQuantity());
                itemDto.setPrice(product.getPrice());
                itemDto.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
                orderItemDtos.add(itemDto);
            }

            // Build OrderDto
            OrderDto orderDto = new OrderDto();
            orderDto.setOrderId(order.getOrderId());
            orderDto.setShopId(shop.getShopId());
            orderDto.setShopName(shop.getShopName());
            orderDto.setReceiverName(order.getReceiverName());
            orderDto.setReceiverPhone(order.getReceiverPhone());
            orderDto.setShippingAddress(order.getShippingAddress());
            BigDecimal subTotalCheckout = order.getSubTotal() != null ? order.getSubTotal() : BigDecimal.ZERO;
            BigDecimal shippingFeeCheckout = order.getShippingFee() != null ? order.getShippingFee() : BigDecimal.ZERO;

            orderDto.setSubTotal(subTotalCheckout);
            orderDto.setShippingFee(shippingFeeCheckout);
            orderDto.setTotalAmount(subTotalCheckout.add(shippingFeeCheckout));
            orderDto.setStatus(order.getStatus().name());
            if (order.getTransaction() != null) {
                orderDto.setPaymentMethod(order.getTransaction().getPaymentMethod().name());
                orderDto.setPaymentStatus(order.getTransaction().getPaymentStatus().name());
            }
            orderDto.setNote(order.getNote());
            orderDto.setCreatedAt(order.getCreatedAt());
            orderDto.setItems(orderItemDtos);
            orderDtos.add(orderDto);
        }

        // 9. Clear cart (prevent duplicate order)
        cartItemRepository.deleteByCart(cart);

        return ApiResponse.success("Order placed successfully", orderDtos);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<OrderDto>> getOrderHistory(Integer userId) {
        log.info("getOrderHistory -> userId: {}", userId);
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            List<Order> orders = orderRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
            if (orders == null) {
                orders = new ArrayList<>();
            }
            log.info("getOrderHistory -> number of orders: {}", orders.size());

            List<OrderDto> orderDtos = new ArrayList<>();
            for (Order order : orders) {
                log.info("getOrderHistory -> processing orderId: {}", order.getOrderId());
                List<OrderItem> items = orderItemRepository.findByOrderOrderId(order.getOrderId());
                if (items == null || items.isEmpty()) {
                    log.warn("getOrderHistory -> orderId {} has no items, skipping", order.getOrderId());
                    continue; // Skip invalid orders
                }
                orderDtos.add(buildOrderDto(order, items));
            }

            return ApiResponse.success(orderDtos);
        } catch (Exception e) {
            log.error("Error fetching order history for userId: {}", userId, e);
            return ApiResponse.error("Internal Server Error fetching order history: " + e.getClass().getName() + " - " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<OrderDto> getOrderDetail(Integer orderId, Integer userId) {
        log.info("getOrderDetail -> userId: {}, orderId: {}", userId, orderId);
        try {
            Optional<Order> orderOpt = orderRepository.findById(orderId);
            if (orderOpt.isEmpty()) {
                return ApiResponse.error("Order not found");
            }

            Order order = orderOpt.get();

            // Verify order belongs to user
            if (order.getUser() == null || !order.getUser().getUserId().equals(userId)) {
                log.warn("getOrderDetail -> Unauthorized access attempt for orderId: {} by userId: {}", orderId, userId);
                return ApiResponse.error("Unauthorized");
            }

            List<OrderItem> items = orderItemRepository.findByOrderOrderId(orderId);
            log.info("getOrderDetail -> found {} items", (items != null ? items.size() : 0));
            return ApiResponse.success(buildOrderDto(order, items));
        } catch (Exception e) {
            log.error("Error fetching order detail for orderId: {}, userId: {}", orderId, userId, e);
            return ApiResponse.error("Internal Server Error fetching order detail: " + e.getClass().getName() + " - " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ApiResponse<String> confirmOrder(Integer orderId, Integer userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty() || userOpt.get().getRole() != User.Role.SELLER) {
            return ApiResponse.error("Permission denied");
        }

        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return ApiResponse.error("Order not found");
        }

        Order order = orderOpt.get();
        if (order.getStatus() != Order.OrderStatus.PENDING) {
            return ApiResponse.error("Order cannot be confirmed");
        }

        // AUTO FLOW: Immediately set order.status = SHIPPING
        order.setStatus(Order.OrderStatus.SHIPPING);
        orderRepository.save(order);

        return ApiResponse.success("Order confirmed and moved to SHIPPING", null);
    }

    @Override
    @Transactional
    public ApiResponse<String> updateOrderStatus(Integer orderId, com.fruitshop.backend.dto.OrderStatusDto dto, Integer userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty() || userOpt.get().getRole() != User.Role.SELLER) {
            return ApiResponse.error("Permission denied");
        }

        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return ApiResponse.error("Order not found");
        }

        Order order = orderOpt.get();
        Order.OrderStatus currentStatus = order.getStatus();
        Order.OrderStatus newStatus;

        try {
            newStatus = Order.OrderStatus.valueOf(dto.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ApiResponse.error("Invalid order status: " + dto.getStatus());
        }

        // SELLER only valid flow: SHIPPING -> DELIVERED
        if (currentStatus == Order.OrderStatus.SHIPPING && newStatus == Order.OrderStatus.DELIVERED) {
            order.setStatus(newStatus);
            if (order.getTransaction() != null && order.getTransaction().getPaymentMethod() == Transaction.PaymentMethod.COD) {
                order.getTransaction().setPaymentStatus(Transaction.PaymentStatus.PAID);
                transactionRepository.save(order.getTransaction());
            }
            orderRepository.save(order);
            return ApiResponse.success("Order status updated successfully", null);
        }

        return ApiResponse.error("Cannot transition order status from " + currentStatus + " to " + newStatus);
    }

    @Override
    @Transactional
    public ApiResponse<String> cancelOrder(Integer orderId, Integer userId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return ApiResponse.error("Order not found");
        }

        Order order = orderOpt.get();

        // Verify order belongs to user
        if (!order.getUser().getUserId().equals(userId)) {
            return ApiResponse.error("Order does not belong to this user");
        }

        // Only PENDING orders can be cancelled
        if (order.getStatus() != Order.OrderStatus.PENDING) {
            return ApiResponse.error("Only pending orders can be cancelled. Current status: " + order.getStatus());
        }

        // Restore stock
        List<OrderItem> items = orderItemRepository.findByOrderOrderId(orderId);
        for (OrderItem item : items) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        // Update order status
        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);

        return ApiResponse.success("Order cancelled successfully", null);
    }

    @Override
    @Transactional
    public ApiResponse<String> completeOrder(Integer orderId, Integer userId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return ApiResponse.error("Order not found");
        }

        Order order = orderOpt.get();

        // Check ownership
        if (!order.getUser().getUserId().equals(userId)) {
            return ApiResponse.error("Unauthorized");
        }

        // Check terminal states first
        if (order.getStatus() == Order.OrderStatus.COMPLETED) {
            return ApiResponse.error("Order already completed");
        }
        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            return ApiResponse.error("Cannot complete cancelled order");
        }

        // Only SHIPPING can be completed by user
        if (order.getStatus() != Order.OrderStatus.SHIPPING) {
            return ApiResponse.error("Order must be in SHIPPING status to complete");
        }

        Order.OrderStatus previousStatus = order.getStatus();
        order.setStatus(Order.OrderStatus.COMPLETED);
        orderRepository.save(order);

        System.out.println("User " + userId + " completed order " + orderId + " (" + previousStatus + " → COMPLETED)");

        return ApiResponse.success("Order completed successfully", null);
    }

    // ========== Helper Methods ==========

    private OrderDto buildOrderDto(Order order, List<OrderItem> items) {
        List<OrderItemDto> itemDtos = new ArrayList<>();
        if (items != null) {
            for (OrderItem item : items) {
                if (item.getProduct() == null) {
                    log.warn("Skipped orderItemId={} because Product is null", item.getOrderItemId());
                    continue;
                }
                
                Product product = item.getProduct();
                
                OrderItemDto dto = new OrderItemDto();
                dto.setOrderItemId(item.getOrderItemId());
                dto.setProductId(product.getProductId());
                dto.setProductName(product.getName() != null ? product.getName() : "Unknown Product");
                dto.setImageUrl(product.getImageUrl() != null ? product.getImageUrl() : "");
                
                Integer quantity = item.getQuantity() != null ? item.getQuantity() : 0;
                BigDecimal price = item.getPrice() != null ? item.getPrice() : BigDecimal.ZERO;
                
                dto.setQuantity(quantity);
                dto.setPrice(price);
                dto.setSubtotal(price.multiply(BigDecimal.valueOf(quantity)));
                
                itemDtos.add(dto);
            }
        }

        OrderDto dto = new OrderDto();
        dto.setOrderId(order.getOrderId());
        
        if (order.getShop() != null) {
            dto.setShopId(order.getShop().getShopId());
            dto.setShopName(order.getShop().getShopName() != null ? order.getShop().getShopName() : "Unknown Shop");
        }
        
        dto.setReceiverName(order.getReceiverName() != null ? order.getReceiverName() : "");
        dto.setReceiverPhone(order.getReceiverPhone() != null ? order.getReceiverPhone() : "");
        dto.setShippingAddress(order.getShippingAddress() != null ? order.getShippingAddress() : "");
        BigDecimal subTotal = order.getSubTotal() != null ? order.getSubTotal() : BigDecimal.ZERO;
        BigDecimal shippingFee = order.getShippingFee() != null ? order.getShippingFee() : BigDecimal.ZERO;

        dto.setSubTotal(subTotal);
        dto.setShippingFee(shippingFee);
        dto.setTotalAmount(subTotal.add(shippingFee));
        dto.setStatus(order.getStatus().name());
        if (order.getTransaction() != null) {
            dto.setPaymentMethod(order.getTransaction().getPaymentMethod().name());
            dto.setPaymentStatus(order.getTransaction().getPaymentStatus().name());
        }
        dto.setNote(order.getNote());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setItems(itemDtos);
        return dto;
    }
}
