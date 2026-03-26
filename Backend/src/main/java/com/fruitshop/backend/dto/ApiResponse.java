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

    // ========== SUCCESS METHODS ==========

    /**
     * Tạo response thành công với message mặc định "Success"
     * 
     * Sử dụng khi: Chỉ cần trả data, không cần message cụ thể
     * 
     * Ví dụ:
     * - Lấy danh sách đơn giản: return ApiResponse.success(users);
     * - Get thông tin: return ApiResponse.success(userDto);
     * 
     * @param data Dữ liệu trả về
     * @return ApiResponse với resultCd=0, message="Success", data=data
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(0, "Thành công", data);
    }

    /**
     * Tạo response thành công với message tùy chỉnh
     * 
     * Sử dụng khi: Muốn message cụ thể, rõ ràng hơn cho user
     * 
     * Ví dụ:
     * - Login: return ApiResponse.success("Login successful", userDto);
     * - Register: return ApiResponse.success("Registration completed!", userDto);
     * - Update: return ApiResponse.success("Profile updated successfully",
     * userDto);
     * - Send OTP: return ApiResponse.success("OTP sent to your email", null);
     * 
     * @param message Thông báo chi tiết cho user
     * @param data    Dữ liệu trả về (có thể null nếu chỉ cần thông báo)
     * @return ApiResponse với resultCd=0, message=message, data=data
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(0, message, data);
    }

    // ========== ERROR METHODS ==========

    /**
     * Tạo response lỗi thông thường với resultCd=1
     * 
     * Sử dụng khi: Lỗi validation, business logic, hoặc lỗi chung
     * 
     * Ví dụ:
     * - Validation: return ApiResponse.error("Email already exists");
     * - Not found: return ApiResponse.error("User not found");
     * - Invalid input: return ApiResponse.error("Invalid OTP code");
     * - Business logic: return ApiResponse.error("OTP has expired");
     * - Exception: return ApiResponse.error("Failed to send email");
     * 
     * @param message Thông báo lỗi cho user
     * @return ApiResponse với resultCd=1, message=message, data=null
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(1, message, null);
    }

    /**
     * Tạo response lỗi với mã lỗi cụ thể (để phân loại lỗi)
     * 
     * Sử dụng khi: Cần phân loại lỗi chi tiết để frontend xử lý khác nhau
     * 
     * Ví dụ:
     * - 400: return ApiResponse.error(400, "Invalid request data");
     * - 401: return ApiResponse.error(401, "Invalid credentials");
     * - 403: return ApiResponse.error(403, "Account has been banned");
     * - 404: return ApiResponse.error(404, "User not found");
     * - 409: return ApiResponse.error(409, "Email already exists");
     * - 500: return ApiResponse.error(500, "Internal server error");
     * 
     * Frontend có thể check resultCd để hiển thị UI hoặc xử lý khác nhau:
     * - 401 → Redirect to login
     * - 403 → Show "Access Denied" page
     * - 404 → Show "Not Found" page
     * 
     * @param resultCd Mã lỗi tùy chỉnh (thường theo HTTP status code)
     * @param message  Thông báo lỗi cho user
     * @return ApiResponse với resultCd=resultCd, message=message, data=null
     */
    public static <T> ApiResponse<T> error(int resultCd, String message) {
        return new ApiResponse<>(resultCd, message, null);
    }
}
