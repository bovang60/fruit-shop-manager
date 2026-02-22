package com.fruitshop.backend.service;

import com.fruitshop.backend.model.User;

public interface EmailService {
    /**
     * Gửi email xác nhận đăng ký tài khoản
     * 
     * @param user  User cần xác nhận
     * @param token Token xác nhận
     */
    void sendVerificationEmail(User user, String token);

    /**
     * Gửi mã OTP qua email khi đăng ký
     * 
     * @param email    Email nhận OTP
     * @param fullName Tên người dùng
     * @param otpCode  Mã OTP 6 số
     */
    void sendOtpEmail(String email, String fullName, String otpCode);
}
