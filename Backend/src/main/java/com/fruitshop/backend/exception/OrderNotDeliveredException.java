package com.fruitshop.backend.exception;

public class OrderNotDeliveredException extends RuntimeException {
    public OrderNotDeliveredException(String message) {
        super(message);
    }
}
