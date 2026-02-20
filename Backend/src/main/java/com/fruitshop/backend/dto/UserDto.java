package com.fruitshop.backend.dto;

import com.fruitshop.backend.model.User;
import lombok.Data;

@Data
public class UserDto {
    private Integer id;
    private String username;
    private String fullname;
    private String email;
    private String phone;
    private String address;
    private User.Role role;
    private User.UserStatus status;
}
