package com.fruitshop.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO để xác nhận đổi mật khẩu với OTP (Bước 2)
 * 
 * Flow:
 * 1. User nhập OTP code nhận từ email
 * 2. User nhập new password
 * 3. User xác nhận new password
 * 4. System verify OTP và đổi password
 */
@Data
public class ConfirmChangePasswordDto {

    @NotBlank(message = "OTP code is required")
    private String otpCode;

    @NotBlank(message = "New password is required")
    @Size(min = 6, max = 50, message = "New password must be between 6 and 50 characters")
    private String newPassword;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}
