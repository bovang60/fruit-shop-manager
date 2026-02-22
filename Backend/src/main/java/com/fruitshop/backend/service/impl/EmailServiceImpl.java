package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.model.EmailLog;
import com.fruitshop.backend.model.User;
import com.fruitshop.backend.repository.EmailLogRepository;
import com.fruitshop.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final EmailLogRepository emailLogRepository;

    @Value("${app.mail.from:noreply@fruitshop.com}")
    private String fromEmail;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Override
    public void sendVerificationEmail(User user, String token) {
        try {
            String verificationUrl = baseUrl + "/api/users/verify-email?token=" + token;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Xác nhận đăng ký tài khoản - Fruit Shop");
            message.setText(buildEmailContent(user.getFullName(), verificationUrl));

            mailSender.send(message);

            // Log email thành công
            logEmail(user, "REGISTRATION_VERIFICATION", "Xác nhận đăng ký tài khoản", EmailLog.EmailStatus.SENT);
            log.info("Verification email sent successfully to: {}", user.getEmail());

        } catch (Exception e) {
            // Log email thất bại
            logEmail(user, "REGISTRATION_VERIFICATION", "Xác nhận đăng ký tài khoản", EmailLog.EmailStatus.FAILED);
            log.error("Failed to send verification email to: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    private String buildEmailContent(String fullName, String verificationUrl) {
        return String.format("""
                Xin chào %s,

                Cảm ơn bạn đã đăng ký tài khoản tại Fruit Shop!

                Vui lòng nhấp vào link bên dưới để xác nhận địa chỉ email của bạn:
                %s

                Link này sẽ hết hạn sau 24 giờ.

                Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email này.

                Trân trọng,
                Fruit Shop Team
                """, fullName, verificationUrl);
    }

    @Override
    public void sendOtpEmail(String email, String fullName, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Mã xác nhận đăng ký tài khoản - Fruit Shop");
            message.setText(buildOtpEmailContent(fullName, otpCode));

            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", email);

        } catch (Exception e) {
            // Log error but don't throw exception - allow registration to continue for
            // testing
            log.error("Failed to send OTP email to: {}", email, e);
            log.warn("⚠️ EMAIL NOT CONFIGURED - OTP Code for testing: {} (Email: {})", otpCode, email);
            // Don't throw exception - this allows testing without real email configuration
            // throw new RuntimeException("Failed to send OTP email", e);
        }
    }

    private String buildOtpEmailContent(String fullName, String otpCode) {
        return String.format("""
                Xin chào %s,

                Cảm ơn bạn đã đăng ký tài khoản tại Fruit Shop!

                Mã xác nhận của bạn là:

                %s

                Vui lòng nhập mã này để hoàn tất đăng ký.
                Mã này sẽ hết hạn sau 5 phút.

                Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email này.

                Trân trọng,
                Fruit Shop Team
                """, fullName, otpCode);
    }

    private void logEmail(User user, String emailType, String subject, EmailLog.EmailStatus status) {
        try {
            EmailLog emailLog = new EmailLog();
            emailLog.setUser(user);
            emailLog.setEmailType(emailType);
            emailLog.setSubject(subject);
            emailLog.setStatus(status);
            emailLog.setSentAt(LocalDateTime.now());
            emailLogRepository.save(emailLog);
        } catch (Exception e) {
            log.error("Failed to log email", e);
        }
    }
}
