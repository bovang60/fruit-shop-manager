package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.RegisterDto;
import com.fruitshop.backend.dto.UserDto;
import com.fruitshop.backend.dto.VerifyOtpDto;
import com.fruitshop.backend.model.PendingRegistration;
import com.fruitshop.backend.model.User;
import com.fruitshop.backend.repository.PendingRegistrationRepository;
import com.fruitshop.backend.repository.UserRepository;
import com.fruitshop.backend.service.EmailService;
import com.fruitshop.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PendingRegistrationRepository pendingRegistrationRepository;
    private final EmailService emailService;

    @Override
    public Page<UserDto> getUsers(String search, User.UserStatus status, User.Role role, Pageable pageable) {
        Page<User> users;
        if (search != null && !search.isEmpty()) {
            users = userRepository.findByFullNameContainingIgnoreCase(search, pageable);
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return convertToDto(user);
    }

    @Override
    @Transactional
    public UserDto updateUserStatus(Integer id, User.UserStatus status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setStatus(status);
        return convertToDto(userRepository.save(user));
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

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setUserId(user.getUserId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
