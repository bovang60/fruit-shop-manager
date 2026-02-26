package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Integer> {
    
    /**
     * Tìm OTP chưa được sử dụng theo userId
     */
    Optional<PasswordResetOtp> findByUserIdAndIsUsedFalse(Integer userId);
    
    /**
     * Xóa tất cả OTP cũ của user (cleanup)
     */
    void deleteByUserId(Integer userId);
}
