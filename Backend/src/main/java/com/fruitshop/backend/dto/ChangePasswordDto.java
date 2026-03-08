package com.fruitshop.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO để đổi mật khẩu
 * 
 * Sử dụng khi: User đã login và muốn thay đổi mật khẩu
 * 
 * Flow:
 * 1. User nhập mật khẩu hiện tại để xác thực
 * 2. User nhập mật khẩu mới (phải khác mật khẩu cũ)
 * 3. User xác nhận lại mật khẩu mới
 * 
 * Validation:
 * - currentPassword: Bắt buộc
 * - newPassword: Bắt buộc, 6-50 ký tự
 * - confirmPassword: Bắt buộc, phải giống newPassword (validate ở service layer)
 */
@Data
public class ChangePasswordDto {

    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 6, max = 50, message = "New password must be between 6 and 50 characters")
    private String newPassword;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}
