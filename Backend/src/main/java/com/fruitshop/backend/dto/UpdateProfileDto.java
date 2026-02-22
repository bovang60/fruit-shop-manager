package com.fruitshop.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileDto {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "Phone number must be valid Vietnamese phone number")
    private String phoneNumber;

    @Size(min = 6, max = 50, message = "Password must be between 6 and 50 characters")
    private String newPassword; // Optional - only if user wants to change password

    private String currentPassword; // Required if changing password
}
