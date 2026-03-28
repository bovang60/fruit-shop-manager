package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ChangePasswordDto;
import com.fruitshop.backend.dto.LoginDto;
import com.fruitshop.backend.dto.RegisterDto;
import com.fruitshop.backend.dto.RequestForgotPasswordDto;
import com.fruitshop.backend.dto.ResetPasswordDto;
import com.fruitshop.backend.dto.UpdateProfileDto;
import com.fruitshop.backend.dto.UserDto;
import com.fruitshop.backend.dto.VerifyOtpDto;
import com.fruitshop.backend.model.User;
import com.fruitshop.backend.service.FileStorageService;
import com.fruitshop.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final FileStorageService fileStorageService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserDto>> login(@Valid @RequestBody LoginDto loginDto) {
        ApiResponse<UserDto> response = userService.login(loginDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/request-register")
    public ResponseEntity<ApiResponse<String>> requestRegister(@Valid @RequestBody RegisterDto registerDto) {
        ApiResponse<String> response = userService.requestRegister(registerDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<UserDto>> verifyOtp(@Valid @RequestBody VerifyOtpDto verifyOtpDto) {
        ApiResponse<UserDto> response = userService.verifyOtpAndRegister(verifyOtpDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestParam(name = "token") String token) {
        ApiResponse<String> response = userService.verifyEmail(token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getUsers(
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "status", required = false) User.UserStatus status,
            @RequestParam(name = "role", required = false) User.Role role,
            Pageable pageable) {
        ApiResponse<Page<UserDto>> response = userService.getUsers(search, status, role, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUser(@PathVariable(name = "id") Integer id) {
        ApiResponse<UserDto> response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(
            @PathVariable(name = "id") Integer id,
            @RequestParam(name = "status") User.UserStatus status) {
        ApiResponse<UserDto> response = userService.updateUserStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @PathVariable(name = "id") Integer id,
            @Valid @RequestBody UpdateProfileDto updateProfileDto) {
        ApiResponse<UserDto> response = userService.updateProfile(id, updateProfileDto);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @PathVariable(name = "id") Integer id,
            @Valid @RequestBody ChangePasswordDto changePasswordDto) {
        ApiResponse<String> response = userService.changePassword(id, changePasswordDto);
        return ResponseEntity.ok(response);
    }

    // Forgot password with OTP - Step 1: Request OTP
    @PostMapping("/forgot-password/request")
    public ResponseEntity<ApiResponse<String>> requestForgotPassword(
            @Valid @RequestBody RequestForgotPasswordDto requestForgotPasswordDto) {
        ApiResponse<String> response = userService.requestForgotPassword(requestForgotPasswordDto);
        return ResponseEntity.ok(response);
    }

    // Forgot password with OTP - Step 2: Reset password with OTP
    @PostMapping("/forgot-password/reset")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @Valid @RequestBody ResetPasswordDto resetPasswordDto) {
        ApiResponse<String> response = userService.resetPassword(resetPasswordDto);
        return ResponseEntity.ok(response);
    }

    // Upload avatar
    @PostMapping("/{id}/avatar")
    public ResponseEntity<ApiResponse<UserDto>> uploadAvatar(
            @PathVariable("id") Integer userId,
            @RequestParam("image") MultipartFile imageFile) {

        try {
            // 1. File validation - Check if file is empty
            if (imageFile.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("No image file provided."));
            }

            // 2. Check file type
            String contentType = imageFile.getContentType();
            if (!fileStorageService.isValidImageType(contentType)) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid file type. Only images (PNG, JPG, GIF) are allowed."));
            }

            // 3. Check file size (5MB = 5 * 1024 * 1024 bytes)
            long maxFileSize = 5 * 1024 * 1024; // 5MB
            if (imageFile.getSize() > maxFileSize) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("File size exceeds limit. Maximum 5MB allowed."));
            }

            // 4. Store file
            String imageUrl = fileStorageService.storeFile(imageFile, "avatars", userId);

            // 5. Update user in database
            ApiResponse<UserDto> response = userService.updateUserAvatar(userId, imageUrl);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Failed to upload image. Please try again later."));
        }
    }
}
