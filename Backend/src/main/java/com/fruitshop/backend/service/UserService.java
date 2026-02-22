package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.RegisterDto;
import com.fruitshop.backend.dto.UserDto;
import com.fruitshop.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Page<UserDto> getUsers(String search, User.UserStatus status, User.Role role, Pageable pageable);

    UserDto getUserById(Integer id);

    UserDto updateUserStatus(Integer id, User.UserStatus status);

    ApiResponse<UserDto> register(RegisterDto registerDto);
}
