package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pending_registrations")
public class PendingRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pending_id")
    private Integer pendingId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "otp_code", nullable = false, length = 6)
    private String otpCode;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;

    @Column(name = "is_verified")
    private Boolean isVerified = false;
}
