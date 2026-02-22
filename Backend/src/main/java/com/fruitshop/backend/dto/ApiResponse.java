package com.fruitshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private int resultCd; // 0: success, 1: error
    private String message;
    private T data;

    // Success response
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(0, "Success", data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(0, message, data);
    }

    // Error response
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(1, message, null);
    }

    public static <T> ApiResponse<T> error(int resultCd, String message) {
        return new ApiResponse<>(resultCd, message, null);
    }
}
