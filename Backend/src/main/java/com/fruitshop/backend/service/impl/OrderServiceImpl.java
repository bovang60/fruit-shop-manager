package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.*;
import com.fruitshop.backend.model.*;
import com.fruitshop.backend.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import com.fruitshop.backend.service.OrderService;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final ShippingMethodRepository shippingMethodRepository;
    private final VoucherRepository voucherRepository;
    private final OrderVoucherRepository orderVoucherRepository;

    @PersistenceContext
    private EntityManager entityManager;

    // =====================================================================
    //  CHECKOUT — Cart-per-shop → Order-per-shop (production-ready)
    // =====================================================================
    @Override
    @Transactional
    public ApiResponse<List<OrderDto>> checkout(CheckoutRequestDto dto) {
        // 1. Find user
        Optional<User> userOpt = userRepository.findById(dto.getUserId());
        if (userOpt.isEmpty()) {
            return ApiResponse.error("User not found");
        }
        User user = userOpt.get();

        // 2. Find all in-cart carts for user (each cart = 1 shop)
        // Validate shops payload
        if (dto.getShops() == null || dto.getShops().isEmpty()) {
            return ApiResponse.error("No shop selected for checkout");
        }

        List<Integer> selectedShopIds = dto.getShops().stream()
                .map(ShopCheckoutDto::getShopId)
                .collect(Collectors.toList());

        List<Cart> carts = cartRepository.findByCustomerIdAndStatusWithItems(
                dto.getUserId(), Cart.STATUS_IN_CART);

        // Filter carts
        carts = carts.stream()
                .filter(c -> selectedShopIds.contains(c.getShop().getShopId()))
                .collect(Collectors.toList());

        if (carts.isEmpty()) {
            return ApiResponse.error("Cart is empty or no valid items selected");
        }

        // Map payload config by shopId
        Map<Integer, ShopCheckoutDto> shopConfigMap = dto.getShops().stream()
                .collect(Collectors.toMap(ShopCheckoutDto::getShopId, s -> s));

        // 3. Collect all product IDs, sort & lock to prevent deadlock + race condition
        List<Integer> allProductIds = carts.stream()
                .flatMap(cart -> cart.getItems().stream())
                .map(item -> item.getProduct().getProductId())
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        List<Product> lockedProducts = productRepository.findByIdsForUpdate(allProductIds);
        Map<Integer, Product> productMap = lockedProducts.stream()
                .collect(Collectors.toMap(Product::getProductId, p -> p));

        // 4. Validate stock for ALL items across ALL carts
        for (Cart cart : carts) {
            for (CartItem cartItem : cart.getItems()) {
                Product lockedProduct = productMap.get(cartItem.getProduct().getProductId());
                if (lockedProduct == null) {
                    return ApiResponse.error("Product not found: " + cartItem.getProduct().getProductId());
                }
                if (lockedProduct.getStock() < cartItem.getQuantity()) {
                    return ApiResponse.error(
                            "Not enough stock for \"" + lockedProduct.getName()
                                    + "\". Available: " + lockedProduct.getStock()
                                    + ", Requested: " + cartItem.getQuantity());
                }
            }
        }

        // 5. Parse payment method
        Transaction.PaymentMethod paymentMethod;
        try {
            paymentMethod = Transaction.PaymentMethod.valueOf(dto.getPaymentMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ApiResponse.error("Invalid payment method: " + dto.getPaymentMethod());
        }

        // 6. Calculate total payment across all carts, INCLUDING shipping fees
        BigDecimal totalPayment = BigDecimal.ZERO;
        
        // Caching validated shipping methods
        Map<Integer, ShippingMethod> validatedShippingMethods = new HashMap<>();
        Map<Integer, Voucher> validatedVouchers = new HashMap<>();
        Map<Integer, BigDecimal> shopDiscounts = new HashMap<>();

        for (Cart cart : carts) {
            ShopCheckoutDto config = shopConfigMap.get(cart.getShop().getShopId());
            if (config == null || config.getShippingMethodId() == null) {
                return ApiResponse.error("Missing shipping method config for shop: " + cart.getShop().getShopName());
            }

            // Validate shipping method
            ShippingMethod shippingMethod = validatedShippingMethods.computeIfAbsent(
                config.getShippingMethodId(), 
                id -> shippingMethodRepository.findById(id).orElse(null)
            );
            
            if (shippingMethod == null || !shippingMethod.getIsAvailable()) {
                return ApiResponse.error("Invalid or unavailable shipping method selected for shop: " + cart.getShop().getShopName());
            }

            BigDecimal shopSubTotal = BigDecimal.ZERO;
            for (CartItem item : cart.getItems()) {
                Product p = productMap.get(item.getProduct().getProductId());
                shopSubTotal = shopSubTotal.add(
                        p.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            }
            
            // Handle Voucher calculation
            BigDecimal discount = BigDecimal.ZERO;
            if (config.getVoucherId() != null) {
                Voucher voucher = voucherRepository.findById(config.getVoucherId()).orElse(null);
                if (voucher == null) {
                    return ApiResponse.error("Voucher not found for shop: " + cart.getShop().getShopName());
                }
                if (!voucher.getShop().getShopId().equals(cart.getShop().getShopId())) {
                    return ApiResponse.error("Voucher does not belong to shop: " + cart.getShop().getShopName());
                }
                if (!"ACTIVE".equalsIgnoreCase(voucher.getStatus())) {
                    return ApiResponse.error("Voucher is not active: " + voucher.getCode());
                }
                if (voucher.getExpiredDate() != null && voucher.getExpiredDate().isBefore(java.time.LocalDateTime.now())) {
                    return ApiResponse.error("Voucher has expired: " + voucher.getCode());
                }
                if (shopSubTotal.compareTo(voucher.getMinOrderValue()) < 0) {
                    return ApiResponse.error("Order value does not meet the minimum requirement for voucher: " + voucher.getCode());
                }

                if (voucher.getDiscountType() == Voucher.DiscountType.PERCENT) {
                    discount = shopSubTotal.multiply(voucher.getDiscountValue()).divide(BigDecimal.valueOf(100));
                } else {
                    discount = voucher.getDiscountValue();
                }
                
                // Ensure discount doesn't exceed subtotal (prevent negative payment)
                discount = discount.min(shopSubTotal);
                
                validatedVouchers.put(cart.getShop().getShopId(), voucher);
            }
            shopDiscounts.put(cart.getShop().getShopId(), discount);

            // Subtotal - Discount + Shipping Fee
            totalPayment = totalPayment.add(shopSubTotal).subtract(discount).add(shippingMethod.getFixedFee());
        }

        // 7. Create Transaction FIRST
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setTotalPayment(totalPayment);
        transaction.setPaymentMethod(paymentMethod);
        transaction.setPaymentStatus(Transaction.PaymentStatus.UNPAID);
        transaction = transactionRepository.save(transaction);

        // 8. For each Cart (= 1 shop): create Order + OrderItems, deduct stock
        List<OrderDto> orderDtos = new ArrayList<>();

        for (Cart cart : carts) {
            Shop shop = cart.getShop();
            if (shop == null) {
                return ApiResponse.error("Cart is not associated with a shop");
            }

            // Calculate sub total for this shop's order
            BigDecimal subTotal = BigDecimal.ZERO;
            for (CartItem item : cart.getItems()) {
                Product p = productMap.get(item.getProduct().getProductId());
                subTotal = subTotal.add(
                        p.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            }

            ShopCheckoutDto config = shopConfigMap.get(shop.getShopId());
            ShippingMethod shopShipping = validatedShippingMethods.get(config.getShippingMethodId());
            BigDecimal shippingFee = shopShipping != null ? shopShipping.getFixedFee() : BigDecimal.ZERO;
            BigDecimal appliedDiscount = shopDiscounts.getOrDefault(shop.getShopId(), BigDecimal.ZERO);

            // Save Order
            Order order = new Order();
            order.setTransaction(transaction);
            order.setShop(shop);
            order.setUser(user);
            order.setReceiverName(dto.getReceiverName());
            order.setReceiverPhone(dto.getReceiverPhone());
            order.setShippingAddress(dto.getShippingAddress());
            order.setSubTotal(subTotal);
            order.setShippingFee(shippingFee);
            order.setStatus(Order.OrderStatus.PENDING);
            order.setNote(config.getNote());
            order = orderRepository.save(order);

            // Save OrderVoucher if voucher was applied
            Voucher appliedVoucher = validatedVouchers.get(shop.getShopId());
            if (appliedVoucher != null) {
                OrderVoucherId orderVoucherId = new OrderVoucherId(order.getOrderId(), appliedVoucher.getVoucherId());

                OrderVoucher orderVoucher = new OrderVoucher();
                orderVoucher.setId(orderVoucherId);
                orderVoucher.setOrder(order);
                orderVoucher.setVoucher(appliedVoucher);
                orderVoucher.setAppliedValue(appliedDiscount);
                
                orderVoucherRepository.save(orderVoucher);
            }

            // Copy CartItems → OrderItems & deduct stock
            List<OrderItem> batchOrderItems = new ArrayList<>();
            List<OrderItemDto> orderItemDtos = new ArrayList<>();

            for (CartItem cartItem : cart.getItems()) {
                Product product = productMap.get(cartItem.getProduct().getProductId());

                // Create OrderItem (snapshot of cart item)
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setPrice(product.getPrice());
                batchOrderItems.add(orderItem);

                // Deduct stock
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

            // Batch save order items
            orderItemRepository.saveAll(batchOrderItems);

            // Build OrderDto
            OrderDto orderDto = new OrderDto();
            orderDto.setOrderId(order.getOrderId());
            orderDto.setShopId(shop.getShopId());
            orderDto.setShopName(shop.getShopName());
            orderDto.setReceiverName(order.getReceiverName());
            orderDto.setReceiverPhone(order.getReceiverPhone());
            orderDto.setShippingAddress(order.getShippingAddress());
            orderDto.setSubTotal(subTotal);
            orderDto.setDiscountValue(appliedDiscount);
            orderDto.setShippingFee(order.getShippingFee() != null ? order.getShippingFee() : BigDecimal.ZERO);
            orderDto.setTotalAmount(subTotal.subtract(appliedDiscount).add(orderDto.getShippingFee()));
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

        // 10. DELETE all carts + cart items (Cart is temporary, Order is history)
        cartRepository.deleteAll(carts);
        log.info("Checkout complete: {} orders created, cart cleared for userId: {}",
                orderDtos.size(), dto.getUserId());

        return ApiResponse.success("Order placed successfully", orderDtos);
    }

    // =====================================================================
    //  UPDATE ORDER STATUS (seller-facing, by entity)
    // =====================================================================
    @Override
    @Transactional
    public Order updateOrderStatus(Integer orderId, Order.OrderStatus newStatus) {
        Order order = getOrderDetail(orderId);

        if (order.getStatus() == Order.OrderStatus.CANCELLED ||
                order.getStatus() == Order.OrderStatus.REJECTED ||
                order.getStatus() == Order.OrderStatus.COMPLETED) {
            throw new IllegalStateException("Đơn hàng đã đóng, không thể thay đổi trạng thái!");
        }

        // Auto restore stock when seller REJECTS a PENDING order
        if (order.getStatus() == Order.OrderStatus.PENDING && newStatus == Order.OrderStatus.REJECTED) {
            List<OrderItem> items = orderItemRepository.findByOrderOrderId(orderId);
            for (OrderItem item : items) {
                Product product = productRepository.findByIdForUpdate(item.getProduct().getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProduct().getProductId()));
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }
            log.info("Seller rejected order {} -> stock restored for {} items", orderId, items.size());
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    // =====================================================================
    //  SALES REPORT
    // =====================================================================
    @Override
    public SalesReportDto getShopSalesReport(Integer shopId) {
        Integer totalOrders = Math.toIntExact(orderRepository.countByShop_ShopId(shopId));
        Integer successfulOrders = Math.toIntExact(
            orderRepository.countByShopIdAndStatus(shopId, Order.OrderStatus.COMPLETED));
        java.math.BigDecimal revenue = orderRepository.sumRevenueByShopId(shopId);
        Integer quantitySold = orderRepository.sumQuantitySoldByShopId(shopId);

        return SalesReportDto.builder()
                .totalOrders(totalOrders)
                .successfulOrders(successfulOrders)
                .totalRevenue(revenue != null ? revenue : java.math.BigDecimal.ZERO)
                .totalFruitsSold(quantitySold != null ? quantitySold : 0)
                .build();
    }

    // =====================================================================

    //  ORDER HISTORY
    // =====================================================================
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

    // =====================================================================
    //  ORDER DETAIL
    // =====================================================================
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

    // =====================================================================
    //  CONFIRM ORDER (Seller: PENDING → SHIPPING)
    // =====================================================================
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

        if (order.getShop() == null || order.getShop().getOwner() == null
                || !order.getShop().getOwner().getUserId().equals(userId)) {
            return ApiResponse.error("This order does not belong to your shop");
        }

        if (order.getStatus() != Order.OrderStatus.PENDING) {
            return ApiResponse.error("Order cannot be confirmed");
        }

        order.setStatus(Order.OrderStatus.SHIPPING);
        orderRepository.save(order);

        return ApiResponse.success("Order confirmed and moved to SHIPPING", null);
    }

    // =====================================================================
    //  UPDATE ORDER STATUS (Seller: SHIPPING→DELIVERED, PENDING→REJECTED)
    // =====================================================================
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

        // SELLER valid flow 1: SHIPPING -> DELIVERED
        if (currentStatus == Order.OrderStatus.SHIPPING && newStatus == Order.OrderStatus.DELIVERED) {
            order.setStatus(newStatus);
            if (order.getTransaction() != null && order.getTransaction().getPaymentMethod() == Transaction.PaymentMethod.COD) {
                order.getTransaction().setPaymentStatus(Transaction.PaymentStatus.PAID);
                transactionRepository.save(order.getTransaction());
            }
            orderRepository.save(order);
            return ApiResponse.success("Order status updated successfully", null);
        }

        // SELLER valid flow 2: PENDING -> REJECTED (auto restore stock)
        if (currentStatus == Order.OrderStatus.PENDING && newStatus == Order.OrderStatus.REJECTED) {
            List<OrderItem> items = orderItemRepository.findByOrderOrderId(orderId);
            for (OrderItem item : items) {
                Product product = productRepository.findByIdForUpdate(item.getProduct().getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProduct().getProductId()));
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }
            order.setStatus(Order.OrderStatus.REJECTED);
            orderRepository.save(order);
            log.info("Seller {} rejected order {} -> stock restored", userId, orderId);
            return ApiResponse.success("Order rejected and stock restored successfully", null);
        }

        return ApiResponse.error("Cannot transition order status from " + currentStatus + " to " + newStatus);
    }

    // =====================================================================
    //  CANCEL ORDER (User: only PENDING)
    // =====================================================================
    @Override
    @Transactional
    public ApiResponse<String> cancelOrder(Integer orderId, Integer userId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return ApiResponse.error("Order not found");
        }

        Order order = orderOpt.get();

        if (!order.getUser().getUserId().equals(userId)) {
            return ApiResponse.error("Order does not belong to this user");
        }

        if (order.getStatus() != Order.OrderStatus.PENDING) {
            return ApiResponse.error("Only pending orders can be cancelled. Current status: " + order.getStatus());
        }

        // Restore stock with PESSIMISTIC LOCK
        List<OrderItem> items = orderItemRepository.findByOrderOrderId(orderId);
        for (OrderItem item : items) {
            Product product = productRepository.findByIdForUpdate(item.getProduct().getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProduct().getProductId()));
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);

        return ApiResponse.success("Order cancelled successfully", null);
    }

    // =====================================================================
    //  COMPLETE ORDER (User: SHIPPING → COMPLETED)
    // =====================================================================
    @Override
    @Transactional
    public ApiResponse<String> completeOrder(Integer orderId, Integer userId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return ApiResponse.error("Order not found");
        }

        Order order = orderOpt.get();

        if (!order.getUser().getUserId().equals(userId)) {
            return ApiResponse.error("Unauthorized");
        }

        if (order.getStatus() == Order.OrderStatus.COMPLETED) {
            return ApiResponse.error("Order already completed");
        }
        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            return ApiResponse.error("Cannot complete cancelled order");
        }

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
        
        // Load OrderVoucher purely for Order History details
        List<OrderVoucher> orderVouchers = entityManager
                .createQuery("SELECT ov FROM OrderVoucher ov WHERE ov.order.orderId = :orderId", OrderVoucher.class)
                .setParameter("orderId", order.getOrderId())
                .getResultList();
                
        BigDecimal discountValue = BigDecimal.ZERO;
        if (!orderVouchers.isEmpty()) {
            discountValue = orderVouchers.get(0).getAppliedValue();
        }

        dto.setSubTotal(subTotal);
        dto.setDiscountValue(discountValue);
        dto.setShippingFee(shippingFee);
        dto.setTotalAmount(subTotal.subtract(discountValue).add(shippingFee));
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

    @Override
    public List<Order> getOrdersByShop(Integer shopId) {
        return orderRepository.findByShop_ShopIdOrderByCreatedAtDesc(shopId);
    }

    @Override
    public Order getOrderDetail(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + orderId));
    }
}
