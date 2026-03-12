package com.fruitshop.backend.service;

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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    ApiResponse<Page<UserDto>> getUsers(String search, User.UserStatus status, User.Role role, Pageable pageable);

    ApiResponse<UserDto> getUserById(Integer id);

    ApiResponse<UserDto> updateUserStatus(Integer id, User.UserStatus status);

    ApiResponse<String> requestRegister(RegisterDto registerDto);

    ApiResponse<UserDto> verifyOtpAndRegister(VerifyOtpDto verifyOtpDto);

    ApiResponse<String> verifyEmail(String token);

    ApiResponse<UserDto> login(LoginDto loginDto);

    ApiResponse<UserDto> updateProfile(Integer userId, UpdateProfileDto updateProfileDto);

    ApiResponse<String> changePassword(Integer userId, ChangePasswordDto changePasswordDto);

    // Forgot password (2 steps with OTP verification)
    ApiResponse<String> requestForgotPassword(RequestForgotPasswordDto requestForgotPasswordDto);

    ApiResponse<String> resetPassword(ResetPasswordDto resetPasswordDto);
}
