package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(nullable = false)
    @Convert(converter = RoleConverter.class)
    private Role role;

    @Convert(converter = UserStatusConverter.class)
    private UserStatus status = UserStatus.ACTIVE;

    @Converter
    public static class RoleConverter implements AttributeConverter<Role, String> {
        @Override
        public String convertToDatabaseColumn(Role role) {
            return role != null ? role.name() : null;
        }

        @Override
        public Role convertToEntityAttribute(String dbData) {
            return dbData != null ? Role.fromString(dbData) : null;
        }
    }

    @Converter
    public static class UserStatusConverter implements AttributeConverter<UserStatus, String> {
        @Override
        public String convertToDatabaseColumn(UserStatus status) {
            return status != null ? status.name() : null;
        }

        @Override
        public UserStatus convertToEntityAttribute(String dbData) {
            return dbData != null ? UserStatus.fromString(dbData) : null;
        }
    }

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "email_verified")
    private Boolean emailVerified = false;

    @Column(name = "email_verification_token")
    private String emailVerificationToken;

    @Column(name = "token_expiry_date")
    private LocalDateTime tokenExpiryDate;

    public enum Role {
        CUSTOMER, SELLER, ADMIN;

        public static Role fromString(String value) {
            for (Role role : Role.values()) {
                if (role.name().equalsIgnoreCase(value)) {
                    return role;
                }
            }
            throw new IllegalArgumentException("No enum constant " + Role.class.getCanonicalName() + "." + value);
        }
    }

    public enum UserStatus {
        ACTIVE, INACTIVE, BANNED;

        public static UserStatus fromString(String value) {
            for (UserStatus status : UserStatus.values()) {
                if (status.name().equalsIgnoreCase(value)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("No enum constant " + UserStatus.class.getCanonicalName() + "." + value);
        }
    }
}
