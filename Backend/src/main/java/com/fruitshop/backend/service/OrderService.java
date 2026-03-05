package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.SalesReportDto;
import com.fruitshop.backend.model.Order;
import java.util.List;

public interface OrderService {
    List<Order> getOrdersByShop(Integer shopId);
    Order getOrderDetail(Integer orderId);
    Order updateOrderStatus(Integer orderId, Order.OrderStatus status);
    SalesReportDto getShopSalesReport(Integer shopId);
}
