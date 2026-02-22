package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.LoginDto;
import com.fruitshop.backend.dto.RegisterDto;
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
@CrossOrigin("*")
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

    @GetMapping
    public ResponseEntity<Page<UserDto>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) User.UserStatus status,
            @RequestParam(required = false) User.Role role,
            Pageable pageable) {
        return ResponseEntity.ok(userService.getUsers(search, status, role, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<UserDto> updateUserStatus(
            @PathVariable Integer id,
            @RequestParam User.UserStatus status) {
        return ResponseEntity.ok(userService.updateUserStatus(id, status));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateProfileDto updateProfileDto) {
        ApiResponse<UserDto> response = userService.updateProfile(id, updateProfileDto);
        return ResponseEntity.ok(response);
    }
}
