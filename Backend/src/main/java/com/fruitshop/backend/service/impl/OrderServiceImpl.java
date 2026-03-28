package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.*;
import com.fruitshop.backend.model.*;
import com.fruitshop.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements com.fruitshop.backend.service.OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final ShippingMethodRepository shippingMethodRepository;

    @Override
    @Transactional
    public ApiResponse<OrderResponse> createOrder(Integer userId, OrderRequest request) {
        log.info("createOrder -> userId: {}", userId);

        // Fetch user from db
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate Shipping Method
        if (request.getShippingMethodId() == null) {
            return ApiResponse.error("Shipping method is required");
        }

        ShippingMethod shippingMethod = shippingMethodRepository.findById(request.getShippingMethodId()).orElse(null);
        if (shippingMethod == null) {
            return ApiResponse.error("Shipping method not found");
        }

        if (Boolean.FALSE.equals(shippingMethod.getIsAvailable())) {
            return ApiResponse.error("Shipping method is not available");
        }

        BigDecimal shippingFee = shippingMethod.getFixedFee() != null ? shippingMethod.getFixedFee() : BigDecimal.ZERO;

        // Fetch user's cart items
        List<Cart> cartItems = cartRepository.findByCustomerUserIdAndStatus(userId, Cart.STATUS_IN_CART);
        if (cartItems.isEmpty()) {
            return ApiResponse.error("Cart is empty. Cannot create order.");
        }

        log.info("createOrder -> cartItems count: {}", cartItems.size());

        // --- SORT product IDs and lock to prevent deadlock + race condition ---
        List<Integer> productIds = cartItems.stream()
                .map(c -> c.getProduct().getProductId())
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        List<Product> lockedProducts = productRepository.findByIdsForUpdate(productIds);
        Map<Integer, Product> productMap = lockedProducts.stream()
                .collect(Collectors.toMap(Product::getProductId, p -> p));

        // Validate stock for all items
        for (Cart cartItem : cartItems) {
            Product lockedProduct = productMap.get(cartItem.getProduct().getProductId());
            if (lockedProduct == null) {
                return ApiResponse.error("Product not found: " + cartItem.getProduct().getProductId());
            }
            if (lockedProduct.getStock() < cartItem.getQuantity()) {
                return ApiResponse.error("Not enough stock for \"" + lockedProduct.getName()
                        + "\". Available: " + lockedProduct.getStock()
                        + ", Requested: " + cartItem.getQuantity());
            }
        }

        // 1. Calculate totalAmount
        BigDecimal subTotal = BigDecimal.ZERO;
        for (Cart item : cartItems) {
            Product p = productMap.get(item.getProduct().getProductId());
            if (p != null && p.getPrice() != null) {
                subTotal = subTotal.add(p.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            }
        }

        BigDecimal totalAmount = subTotal.add(shippingFee);
        log.info("createOrder -> subTotal: {}, shippingFee: {}, totalAmount: {}", subTotal, shippingFee, totalAmount);

        // 2. Create Transaction
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setTotalPayment(totalAmount);
        transaction.setPaymentStatus(Transaction.PaymentStatus.UNPAID);
        try {
            transaction.setPaymentMethod(Transaction.PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase()));
        } catch (Exception e) {
            transaction.setPaymentMethod(Transaction.PaymentMethod.COD);
        }
        transaction = transactionRepository.save(transaction);

        // 3. Get shop from first cart item
        Shop shop = null;
        if (cartItems.get(0).getProduct() != null && cartItems.get(0).getProduct().getShop() != null) {
            shop = cartItems.get(0).getProduct().getShop();
        }
        if (shop == null) {
            return ApiResponse.error("Product is not assigned to any shop");
        }

        // 4. Create and Save Order Entity
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
            log.info("Saved order successfully! ID: {}", savedOrder.getOrderId());
        } catch (Exception e) {
            log.error("Failed to save order", e);
            return ApiResponse.error("Error saving order");
        }

        // 4b. Create OrderItems + DEDUCT STOCK
        List<OrderItem> orderItems = new ArrayList<>();
        for (Cart cartItem : cartItems) {
            Product product = productMap.get(cartItem.getProduct().getProductId());

            // Create OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItems.add(orderItem);

            // DEDUCT STOCK (FIX: was missing before)
            product.setStock(product.getStock() - cartItem.getQuantity());
            if (product.getSoldCount() != null) {
                product.setSoldCount(product.getSoldCount() + cartItem.getQuantity());
            } else {
                product.setSoldCount(cartItem.getQuantity());
            }
        }

        try {
            orderItemRepository.saveAll(orderItems);
            productRepository.saveAll(lockedProducts); // Batch save stock changes
        } catch (Exception e) {
            log.error("Error saving order items or updating stock", e);
            return ApiResponse.error("Error saving order items");
        }

        // 5. Delete cart items after successful checkout
        cartRepository.deleteAll(cartItems);
        log.info("createOrder -> {} cart items removed from cart for userId: {}", cartItems.size(), userId);

        // 6. Log SELLER notification
        List<User> sellers = userRepository.findByRole(User.Role.SELLER);
        for (User seller : sellers) {
            log.info("New order {} created. Seller {} notified.", savedOrder.getOrderId(), seller.getUserId());
        }

        // 7. Build Response
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

        // 2. Find pending cart items for user
        List<Cart> cartItems = cartRepository.findByCustomerUserIdAndStatus(dto.getUserId(), Cart.STATUS_IN_CART);
        if (cartItems.isEmpty()) {
            return ApiResponse.error("Cart is empty");
        }

        // 3. Sort product IDs and lock (PESSIMISTIC_WRITE, prevents deadlock + race condition)
        List<Integer> productIds = cartItems.stream()
                .map(c -> c.getProduct().getProductId())
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        List<Product> lockedProducts = productRepository.findByIdsForUpdate(productIds);
        Map<Integer, Product> productMap = lockedProducts.stream()
                .collect(Collectors.toMap(Product::getProductId, p -> p));

        // Validate stock
        for (Cart cartItem : cartItems) {
            Product lockedProduct = productMap.get(cartItem.getProduct().getProductId());
            if (lockedProduct == null) {
                throw new RuntimeException("Product not found: " + cartItem.getProduct().getProductId());
            }
            if (lockedProduct.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException(
                        "Not enough stock for \"" + lockedProduct.getName()
                                + "\". Available: " + lockedProduct.getStock()
                                + ", Requested: " + cartItem.getQuantity());
            }
        }

        // 4. Parse payment method
        Transaction.PaymentMethod paymentMethod;
        try {
            paymentMethod = Transaction.PaymentMethod.valueOf(dto.getPaymentMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid payment method: " + dto.getPaymentMethod());
        }

        // 5. Group cart items by shop
        List<Cart> invalidShopItems = cartItems.stream()
                .filter(item -> item.getProduct() == null || item.getProduct().getShop() == null)
                .toList();
        if (!invalidShopItems.isEmpty()) {
            return ApiResponse.error("Some products are not mapped to any shop");
        }

        Map<Integer, List<Cart>> itemsByShop = cartItems.stream()
                .collect(Collectors.groupingBy(item -> item.getProduct().getShop().getShopId()));

        // 6. Calculate total payment
        BigDecimal totalPayment = BigDecimal.ZERO;
        for (Cart item : cartItems) {
            Product p = productMap.get(item.getProduct().getProductId());
            totalPayment = totalPayment.add(
                    p.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
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

        for (Map.Entry<Integer, List<Cart>> entry : itemsByShop.entrySet()) {
            List<Cart> shopItems = entry.getValue();
            Shop shop = shopItems.get(0).getProduct().getShop();

            // Calculate sub total for this shop's order
            BigDecimal subTotal = BigDecimal.ZERO;
            for (Cart item : shopItems) {
                Product p = productMap.get(item.getProduct().getProductId());
                subTotal = subTotal.add(
                        p.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
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
            List<OrderItem> batchOrderItems = new ArrayList<>();
            List<OrderItemDto> orderItemDtos = new ArrayList<>();
            for (Cart cartItem : shopItems) {
                Product product = productMap.get(cartItem.getProduct().getProductId());

                // Create OrderItem
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setPrice(product.getPrice());
                batchOrderItems.add(orderItem);

                // Deduct stock (already locked by PESSIMISTIC_WRITE)
                product.setStock(product.getStock() - cartItem.getQuantity());

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

            // Batch save
            orderItemRepository.saveAll(batchOrderItems);

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

        // 9. Batch save product stock changes
        productRepository.saveAll(lockedProducts);

        // 10. Delete cart items as they are now Orders
        cartRepository.deleteAll(cartItems);

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
                List<OrderItem> items = orderItemRepository.findByOrderOrderId(order.getOrderId());
                if (items == null || items.isEmpty()) {
                    log.warn("getOrderHistory -> orderId {} has no items, skipping", order.getOrderId());
                    continue;
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

        // FIX: Verify seller owns this order's shop
        if (order.getShop() == null || order.getShop().getOwner() == null
                || !order.getShop().getOwner().getUserId().equals(userId)) {
            return ApiResponse.error("This order does not belong to your shop");
        }

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
    public ApiResponse<String> updateOrderStatus(Integer orderId, OrderStatusDto dto, Integer userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty() || userOpt.get().getRole() != User.Role.SELLER) {
            return ApiResponse.error("Permission denied");
        }

        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return ApiResponse.error("Order not found");
        }

        Order order = orderOpt.get();

        // FIX: Verify seller owns this order's shop
        if (order.getShop() == null || order.getShop().getOwner() == null
                || !order.getShop().getOwner().getUserId().equals(userId)) {
            return ApiResponse.error("This order does not belong to your shop");
        }

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

        // FIX: Restore stock with PESSIMISTIC LOCK to prevent lost update
        List<OrderItem> items = orderItemRepository.findByOrderOrderId(orderId);
        for (OrderItem item : items) {
            Product product = productRepository.findByIdForUpdate(item.getProduct().getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProduct().getProductId()));
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

        log.info("User {} completed order {} ({} → COMPLETED)", userId, orderId, previousStatus);

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
