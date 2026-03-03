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
import com.fruitshop.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

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
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestParam String token) {
        ApiResponse<String> response = userService.verifyEmail(token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) User.UserStatus status,
            @RequestParam(required = false) User.Role role,
            Pageable pageable) {
        ApiResponse<Page<UserDto>> response = userService.getUsers(search, status, role, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUser(@PathVariable Integer id) {
        ApiResponse<UserDto> response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(
            @PathVariable Integer id,
            @RequestParam User.UserStatus status) {
        ApiResponse<UserDto> response = userService.updateUserStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateProfileDto updateProfileDto) {
        ApiResponse<UserDto> response = userService.updateProfile(id, updateProfileDto);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @PathVariable Integer id,
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
}
