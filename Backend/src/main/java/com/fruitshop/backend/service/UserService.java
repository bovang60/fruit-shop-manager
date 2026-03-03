package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ChangePasswordDto;
import com.fruitshop.backend.dto.ConfirmChangePasswordDto;
import com.fruitshop.backend.dto.LoginDto;
import com.fruitshop.backend.dto.RegisterDto;
import com.fruitshop.backend.dto.RequestChangePasswordDto;
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

    // Change password without OTP (direct change)
    ApiResponse<String> changePasswordDirect(Integer userId, ChangePasswordDto changePasswordDto);

    // Change password with OTP verification (2 steps)
    ApiResponse<String> requestChangePassword(Integer userId, RequestChangePasswordDto requestChangePasswordDto);

    ApiResponse<String> confirmChangePassword(Integer userId, ConfirmChangePasswordDto confirmChangePasswordDto);
}
