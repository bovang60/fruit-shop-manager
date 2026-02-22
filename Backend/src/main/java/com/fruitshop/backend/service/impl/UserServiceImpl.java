package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.RegisterDto;
import com.fruitshop.backend.dto.UserDto;
import com.fruitshop.backend.model.User;
import com.fruitshop.backend.repository.UserRepository;
import com.fruitshop.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public Page<UserDto> getUsers(String search, User.UserStatus status, User.Role role, Pageable pageable) {
        Page<User> users;
        if (search != null && !search.isEmpty()) {
            users = userRepository.findByFullNameContainingIgnoreCase(search, pageable);
        } else if (status != null && role != null) {
            users = userRepository.findByStatusAndRole(status, role, pageable);
        } else if (status != null) {
            users = userRepository.findByStatus(status, pageable);
        } else if (role != null) {
            users = userRepository.findByRole(role, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        return users.map(this::convertToDto);
    }

    @Override
    public UserDto getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return convertToDto(user);
    }

    @Override
    @Transactional
    public UserDto updateUserStatus(Integer id, User.UserStatus status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setStatus(status);
        return convertToDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public ApiResponse<UserDto> register(RegisterDto registerDto) {
        // Kiểm tra email đã tồn tại chưa
        if (userRepository.findByEmail(registerDto.getEmail()).isPresent()) {
            return ApiResponse.error("Email already exists");
        }

        // Tạo user mới
        User user = new User();
        user.setFullName(registerDto.getFullName());
        user.setEmail(registerDto.getEmail());
        user.setPassword(registerDto.getPassword());
        user.setPhoneNumber(registerDto.getPhoneNumber());
        user.setRole(User.Role.CUSTOMER); // Mặc định là CUSTOMER
        user.setStatus(User.UserStatus.ACTIVE); // Mặc định là ACTIVE
        user.setCreatedAt(LocalDateTime.now());

        // Lưu vào database
        User savedUser = userRepository.save(user);
        UserDto userDto = convertToDto(savedUser);
        return ApiResponse.success("User registered successfully", userDto);
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setUserId(user.getUserId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
