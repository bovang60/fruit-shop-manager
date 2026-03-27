package com.fruitshop.backend.exception;

public class UnauthorizedFeedbackAccessException extends RuntimeException {
    public UnauthorizedFeedbackAccessException(String message) {
        super(message);
    }
}
