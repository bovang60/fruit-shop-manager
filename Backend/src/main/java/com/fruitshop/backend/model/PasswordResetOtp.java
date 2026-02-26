package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Entity lưu thông tin OTP khi user request đổi password
 * 
 * Flow:
 * 1. User request change password → Tạo record mới
 * 2. OTP gửi qua email, hết hạn sau 5 phút
 * 3. User verify OTP → Đổi password và xóa record này
 */
@Data
@Entity
@Table(name = "password_reset_otp")
public class PasswordResetOtp {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "user_id", nullable = false)
    private Integer userId;
    
    @Column(name = "otp_code", nullable = false)
    private String otpCode;
    
    @Column(name = "new_password", nullable = false)
    private String newPassword; // Lưu tạm password mới (sẽ hash trong production)
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime; // OTP hết hạn sau 5 phút
    
    @Column(name = "is_used", nullable = false)
    private Boolean isUsed = false; // Đánh dấu OTP đã được sử dụng chưa
}
