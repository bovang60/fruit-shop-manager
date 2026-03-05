package com.fruitshop.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO để reset password với OTP (Bước 2 - Forgot Password)
 * 
 * Flow:
 * 1. User nhập email (để tìm user)
 * 2. User nhập OTP code nhận từ email
 * 3. User nhập new password
 * 4. User xác nhận new password
 * 5. System verify OTP và reset password
 */
@Data
public class ResetPasswordDto {

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "OTP code is required")
    private String otpCode;

    @NotBlank(message = "New password is required")
    @Size(min = 6, max = 50, message = "New password must be between 6 and 50 characters")
    private String newPassword;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}
