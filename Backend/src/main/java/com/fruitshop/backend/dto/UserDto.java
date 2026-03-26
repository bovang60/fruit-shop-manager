package com.fruitshop.backend.dto;

import com.fruitshop.backend.model.User;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDto {
    private Integer userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private User.Role role;
    private User.UserStatus status;
    private LocalDateTime createdAt;
    private Integer shopId;
}

