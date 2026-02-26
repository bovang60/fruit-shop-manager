package com.fruitshop.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO để request đổi mật khẩu (Bước 1)
 * 
 * Flow:
 * 1. User nhập current password để verify
 * 2. System gửi OTP qua email
 * 3. User nhận OTP và chuyển sang bước 2 (ConfirmChangePasswordDto)
 */
@Data
public class RequestChangePasswordDto {

    @NotBlank(message = "Current password is required")
    private String currentPassword;
}
