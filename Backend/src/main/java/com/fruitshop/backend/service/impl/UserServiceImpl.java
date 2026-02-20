package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.UserDto;
import com.fruitshop.backend.model.User;
import com.fruitshop.backend.repository.UserRepository;
import com.fruitshop.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public Page<UserDto> getUsers(String search, User.UserStatus status, User.Role role, Pageable pageable) {
        Page<User> users;
        if (search != null && !search.isEmpty()) {
            users = userRepository.findByFullnameContainingIgnoreCase(search, pageable);
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
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDto(user);
    }

    @Override
    public UserDto updateUserStatus(Integer id, User.UserStatus status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        return convertToDto(userRepository.save(user));
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullname(user.getFullname());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        return dto;
    }
}
