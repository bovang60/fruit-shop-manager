package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ChangePasswordDto;
import com.fruitshop.backend.dto.LoginDto;
import com.fruitshop.backend.dto.RegisterDto;
import com.fruitshop.backend.dto.RequestForgotPasswordDto;
import com.fruitshop.backend.dto.ResetPasswordDto;
import com.fruitshop.backend.dto.UpdateProfileDto;
import com.fruitshop.backend.dto.UserDto;
import com.fruitshop.backend.dto.VerifyOtpDto;
import com.fruitshop.backend.model.PasswordResetOtp;
import com.fruitshop.backend.model.PendingRegistration;
import com.fruitshop.backend.model.Shop;
import com.fruitshop.backend.model.User;
import com.fruitshop.backend.repository.PasswordResetOtpRepository;
import com.fruitshop.backend.repository.PendingRegistrationRepository;
import com.fruitshop.backend.repository.ShopRepository;
import com.fruitshop.backend.repository.UserRepository;
import com.fruitshop.backend.service.EmailService;
import com.fruitshop.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PendingRegistrationRepository pendingRegistrationRepository;
    private final PasswordResetOtpRepository passwordResetOtpRepository;
    private final ShopRepository shopRepository;
    private final EmailService emailService;

    @Override
    public ApiResponse<Page<UserDto>> getUsers(String search, User.UserStatus status, User.Role role, Pageable pageable) {
        Page<User> users;
        User.Role excludeRole = User.Role.ADMIN;

        if (search != null && !search.isEmpty()) {
            if (status != null) {
                users = userRepository.findByFullNameContainingIgnoreCaseAndStatusAndRoleNot(search, status, excludeRole, pageable);
            } else {
                users = userRepository.findByFullNameContainingIgnoreCaseAndRoleNot(search, excludeRole, pageable);
            }
        } else if (role != null) {
            if (role == User.Role.ADMIN) {
                return ApiResponse.success(Page.empty(pageable));
            }
            if (status != null) {
                users = userRepository.findByStatusAndRole(status, role, pageable);
            } else {
                users = userRepository.findByRole(role, pageable);
            }
        } else if (status != null) {
            users = userRepository.findByStatusAndRoleNot(status, excludeRole, pageable);
        } else {
            users = userRepository.findByRoleNot(excludeRole, pageable);
        }
        return ApiResponse.success(users.map(this::convertToDto));
    }

    @Override
    public ApiResponse<UserDto> getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElse(null);

        if (user == null) {
            return ApiResponse.error("User not found");
        }

        return ApiResponse.success(convertToDto(user));
    }

    @Override
    @Transactional
    public ApiResponse<UserDto> updateUserStatus(Integer id, User.UserStatus status) {
        User user = userRepository.findById(id)
                .orElse(null);

        if (user == null) {
            return ApiResponse.error("User not found");
        }

        user.setStatus(status);
        userRepository.save(user);

        return ApiResponse.success("User status updated successfully", convertToDto(user));
    }

    @Override
    @Transactional
    public ApiResponse<String> requestRegister(RegisterDto registerDto) {
        // Kiểm tra email đã tồn tại trong users chưa
        if (userRepository.findByEmail(registerDto.getEmail()).isPresent()) {
            return ApiResponse.error("Email already exists");
        }

        // Tạo mã OTP 6 số
        String otpCode = generateOtpCode();

        // Tìm pending registration cũ (nếu có)
        pendingRegistrationRepository.findByEmailAndIsVerifiedFalse(registerDto.getEmail())
                .ifPresent(pendingRegistrationRepository::delete);

        // Tạo pending registration mới
        PendingRegistration pending = new PendingRegistration();
        pending.setFullName(registerDto.getFullName());
        pending.setEmail(registerDto.getEmail());
        pending.setPassword(registerDto.getPassword()); // TODO: Hash password
        pending.setPhoneNumber(registerDto.getPhoneNumber());
        pending.setOtpCode(otpCode);
        pending.setCreatedAt(LocalDateTime.now());
        pending.setExpiryTime(LocalDateTime.now().plusMinutes(5)); // Hết hạn sau 5 phút
        pending.setIsVerified(false);

        pendingRegistrationRepository.save(pending);

        // Gửi email OTP
        try {
            emailService.sendOtpEmail(registerDto.getEmail(), registerDto.getFullName(), otpCode);
        } catch (Exception e) {
            return ApiResponse.error("Failed to send OTP email. Please try again.");
        }

        return ApiResponse.success("OTP code has been sent to your email. Please verify within 5 minutes.", null);
    }

    @Override
    @Transactional
    public ApiResponse<UserDto> verifyOtpAndRegister(VerifyOtpDto verifyOtpDto) {
        // Tìm pending registration
        PendingRegistration pending = pendingRegistrationRepository
                .findByEmailAndIsVerifiedFalse(verifyOtpDto.getEmail())
                .orElse(null);

        if (pending == null) {
            return ApiResponse.error("No pending registration found for this email");
        }

        // Kiểm tra OTP đã hết hạn chưa
        if (pending.getExpiryTime().isBefore(LocalDateTime.now())) {
            pendingRegistrationRepository.delete(pending);
            return ApiResponse.error("OTP code has expired. Please request a new one.");
        }

        // Kiểm tra OTP code
        if (!pending.getOtpCode().equals(verifyOtpDto.getOtpCode())) {
            return ApiResponse.error("Invalid OTP code");
        }

        // Kiểm tra email đã tồn tại chưa (double check)
        if (userRepository.findByEmail(pending.getEmail()).isPresent()) {
            pendingRegistrationRepository.delete(pending);
            return ApiResponse.error("Email already exists");
        }

        // Tạo user mới
        User user = new User();
        user.setFullName(pending.getFullName());
        user.setEmail(pending.getEmail());
        user.setPassword(pending.getPassword()); // TODO: Hash password
        user.setPhoneNumber(pending.getPhoneNumber());
        user.setRole(User.Role.CUSTOMER);
        user.setStatus(User.UserStatus.ACTIVE); // Active ngay vì đã verify OTP
        user.setCreatedAt(LocalDateTime.now());
        user.setEmailVerified(true); // Đã verify qua OTP

        User savedUser = userRepository.save(user);

        // Xóa pending registration
        pendingRegistrationRepository.delete(pending);

        UserDto userDto = convertToDto(savedUser);
        return ApiResponse.success("Registration completed successfully!", userDto);
    }

    private String generateOtpCode() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // Tạo số 6 chữ số
        return String.valueOf(otp);
    }

    @Override
    @Transactional
    public ApiResponse<String> verifyEmail(String token) {
        // Tìm user theo token
        User user = userRepository.findAll().stream()
                .filter(u -> token.equals(u.getEmailVerificationToken()))
                .findFirst()
                .orElse(null);

        if (user == null) {
            return ApiResponse.error("Invalid verification token");
        }

        // Kiểm tra token đã hết hạn chưa
        if (user.getTokenExpiryDate().isBefore(LocalDateTime.now())) {
            return ApiResponse.error("Verification token has expired");
        }

        // Kiểm tra đã verify chưa
        if (user.getEmailVerified()) {
            return ApiResponse.error("Email already verified");
        }

        // Xác nhận email
        user.setEmailVerified(true);
        user.setStatus(User.UserStatus.ACTIVE); // Chuyển sang ACTIVE sau khi xác nhận
        user.setEmailVerificationToken(null); // Xóa token sau khi verify
        user.setTokenExpiryDate(null);
        userRepository.save(user);

        return ApiResponse.success("Email verified successfully. Your account is now active.", null);
    }

    @Override
    public ApiResponse<UserDto> login(LoginDto loginDto) {
        // Tìm user theo email
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElse(null);

        if (user == null) {
            return ApiResponse.error("Invalid email or password");
        }

        // Kiểm tra password (TODO: Cần hash password với BCrypt trong production)
        if (!user.getPassword().equals(loginDto.getPassword())) {
            return ApiResponse.error("Invalid email or password");
        }

        // Kiểm tra status của user
        if (user.getStatus() == User.UserStatus.INACTIVE) {
            return ApiResponse.error("Your account has been deactivated. Please contact support.");
        }

        if (user.getStatus() == User.UserStatus.BANNED) {
            return ApiResponse.error("Your account has been banned. Please contact support.");
        }

        // Kiểm tra email đã verify chưa (nếu dùng email verification)
        if (!user.getEmailVerified()) {
            return ApiResponse.error("Please verify your email before logging in.");
        }

        // Login thành công - Return user info
        UserDto userDto = convertToDto(user);
        if (user.getRole() == User.Role.SELLER) {
            Shop shop = shopRepository.findByOwner_UserId(user.getUserId()).orElse(null);
            if (shop != null) {
                userDto.setShopId(shop.getShopId());
            }
        }
        return ApiResponse.success("Login successful", userDto);
    }

    @Override
    @Transactional
    public ApiResponse<UserDto> updateProfile(Integer userId, UpdateProfileDto updateProfileDto) {
        // Tìm user
        User user = userRepository.findById(userId)
                .orElse(null);

        if (user == null) {
            return ApiResponse.error("User not found");
        }

        // Update full name
        user.setFullName(updateProfileDto.getFullName());

        // Update phone number (if provided)
        if (updateProfileDto.getPhoneNumber() != null && !updateProfileDto.getPhoneNumber().isEmpty()) {
            user.setPhoneNumber(updateProfileDto.getPhoneNumber());
        }

        // Update address (if provided)
        if (updateProfileDto.getAddress() != null && !updateProfileDto.getAddress().isEmpty()) {
            user.setAddress(updateProfileDto.getAddress());
        }

        // Save changes and get updated user
        User updatedUser = userRepository.save(user);

        // Return updated user info
        UserDto userDto = convertToDto(updatedUser);
        return ApiResponse.success("Profile updated successfully", userDto);
    }

    @Override
    @Transactional
    public ApiResponse<String> changePassword(Integer userId, ChangePasswordDto changePasswordDto) {
        // Tìm user
        User user = userRepository.findById(userId)
                .orElse(null);

        if (user == null) {
            return ApiResponse.error("User not found");
        }

        // Verify current password (TODO: Cần dùng BCrypt trong production)
        if (!user.getPassword().equals(changePasswordDto.getCurrentPassword())) {
            return ApiResponse.error("Current password is incorrect");
        }

        // Kiểm tra new password và confirm password có khớp không
        if (!changePasswordDto.getNewPassword().equals(changePasswordDto.getConfirmPassword())) {
            return ApiResponse.error("New password and confirm password do not match");
        }

        // Kiểm tra password mới không được giống password cũ
        if (changePasswordDto.getNewPassword().equals(changePasswordDto.getCurrentPassword())) {
            return ApiResponse.error("New password must be different from current password");
        }

        // Update password mới (TODO: Cần hash với BCrypt trong production)
        user.setPassword(changePasswordDto.getNewPassword());
        userRepository.save(user);

        return ApiResponse.success("Password changed successfully", null);
    }

    @Override
    @Transactional
    public ApiResponse<String> requestForgotPassword(RequestForgotPasswordDto requestForgotPasswordDto) {
        // Tìm user theo email
        User user = userRepository.findByEmail(requestForgotPasswordDto.getEmail())
                .orElse(null);

        if (user == null) {
            return ApiResponse.error("No account found with this email address");
        }

        // Tạo OTP code 6 số
        String otpCode = generateOtpCode();

        // Xóa OTP cũ của user (nếu có)
        passwordResetOtpRepository.findByUserIdAndIsUsedFalse(user.getUserId())
                .ifPresent(passwordResetOtpRepository::delete);

        // Tạo OTP record mới
        PasswordResetOtp passwordResetOtp = new PasswordResetOtp();
        passwordResetOtp.setUserId(user.getUserId());
        passwordResetOtp.setOtpCode(otpCode);
        passwordResetOtp.setNewPassword(""); // Placeholder, sẽ set ở bước reset
        passwordResetOtp.setCreatedAt(LocalDateTime.now());
        passwordResetOtp.setExpiryTime(LocalDateTime.now().plusMinutes(5)); // Hết hạn sau 5 phút
        passwordResetOtp.setIsUsed(false);

        passwordResetOtpRepository.save(passwordResetOtp);

        // Gửi OTP qua email
        try {
            emailService.sendOtpEmail(user.getEmail(), user.getFullName(), otpCode);
        } catch (Exception e) {
            return ApiResponse.error("Failed to send OTP email. Please try again.");
        }

        return ApiResponse.success("OTP code has been sent to your email. Please verify within 5 minutes.", null);
    }

    @Override
    @Transactional
    public ApiResponse<String> resetPassword(ResetPasswordDto resetPasswordDto) {
        // Tìm user theo email
        User user = userRepository.findByEmail(resetPasswordDto.getEmail())
                .orElse(null);

        if (user == null) {
            return ApiResponse.error("No account found with this email address");
        }

        // Tìm OTP record
        PasswordResetOtp passwordResetOtp = passwordResetOtpRepository
                .findByUserIdAndIsUsedFalse(user.getUserId())
                .orElse(null);

        if (passwordResetOtp == null) {
            return ApiResponse.error("No password reset request found. Please request a new OTP.");
        }

        // Kiểm tra OTP đã hết hạn chưa
        if (passwordResetOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
            passwordResetOtpRepository.delete(passwordResetOtp);
            return ApiResponse.error("OTP code has expired. Please request a new one.");
        }

        // Verify OTP code
        if (!passwordResetOtp.getOtpCode().equals(resetPasswordDto.getOtpCode())) {
            return ApiResponse.error("Invalid OTP code");
        }

        // Kiểm tra new password và confirm password có khớp không
        if (!resetPasswordDto.getNewPassword().equals(resetPasswordDto.getConfirmPassword())) {
            return ApiResponse.error("New password and confirm password do not match");
        }

        // Update password mới (TODO: Cần hash với BCrypt trong production)
        user.setPassword(resetPasswordDto.getNewPassword());
        userRepository.save(user);

        // Xóa OTP record sau khi đã sử dụng
        passwordResetOtpRepository.delete(passwordResetOtp);

        return ApiResponse.success("Password has been reset successfully. You can now login with your new password.",
                null);
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setUserId(user.getUserId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}


