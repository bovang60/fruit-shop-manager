package com.fruitshop.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO để request reset password (Bước 1 - Forgot Password)
 * 
 * Flow:
 * 1. User nhập email (không cần biết userId)
 * 2. System tìm user theo email
 * 3. System gửi OTP qua email
 * 4. User nhận OTP và chuyển sang bước 2 (ResetPasswordDto)
 */
@Data
public class RequestForgotPasswordDto {

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
}
