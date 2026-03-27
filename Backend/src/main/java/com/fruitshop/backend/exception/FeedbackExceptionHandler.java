package com.fruitshop.backend.exception;

import com.fruitshop.backend.controller.FeedbackController;
import com.fruitshop.backend.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(assignableTypes = FeedbackController.class)
public class FeedbackExceptionHandler {

    @ExceptionHandler(FeedbackAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<String>> handleFeedbackAlreadyExists(FeedbackAlreadyExistsException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(409, ex.getMessage()));
    }

    @ExceptionHandler(FeedbackNotFoundException.class)
    public ResponseEntity<ApiResponse<String>> handleFeedbackNotFound(FeedbackNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(404, ex.getMessage()));
    }

    @ExceptionHandler(OrderNotDeliveredException.class)
    public ResponseEntity<ApiResponse<String>> handleOrderNotDelivered(OrderNotDeliveredException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(400, ex.getMessage()));
    }

    @ExceptionHandler(UnauthorizedFeedbackAccessException.class)
    public ResponseEntity<ApiResponse<String>> handleUnauthorizedAccess(UnauthorizedFeedbackAccessException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error(403, ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .reduce((a, b) -> a + "; " + b)
                .orElse("Invalid request data");
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(400, message));
    }
}
