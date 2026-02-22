package com.fruitshop.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.LoginDto;
import com.fruitshop.backend.dto.RegisterDto;
import com.fruitshop.backend.dto.UpdateProfileDto;
import com.fruitshop.backend.dto.UserDto;
import com.fruitshop.backend.dto.VerifyOtpDto;
import com.fruitshop.backend.model.User;
import com.fruitshop.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    private RegisterDto registerDto;
    private VerifyOtpDto verifyOtpDto;
    private LoginDto loginDto;
    private UpdateProfileDto updateProfileDto;
    private UserDto userDto;

    @BeforeEach
    void setUp() {
        // Setup RegisterDto
        registerDto = new RegisterDto();
        registerDto.setFullName("Test User");
        registerDto.setEmail("test@example.com");
        registerDto.setPassword("password123");
        registerDto.setPhoneNumber("0987654321");

        // Setup VerifyOtpDto
        verifyOtpDto = new VerifyOtpDto();
        verifyOtpDto.setEmail("test@example.com");
        verifyOtpDto.setOtpCode("123456");

        // Setup LoginDto
        loginDto = new LoginDto();
        loginDto.setEmail("test@example.com");
        loginDto.setPassword("password123");

        // Setup UpdateProfileDto
        updateProfileDto = new UpdateProfileDto();
        updateProfileDto.setFullName("Updated Name");
        updateProfileDto.setPhoneNumber("0912345678");

        // Setup UserDto
        userDto = new UserDto();
        userDto.setUserId(1);
        userDto.setFullName("Test User");
        userDto.setEmail("test@example.com");
        userDto.setPhoneNumber("0987654321");
        userDto.setRole(User.Role.CUSTOMER);
        userDto.setStatus(User.UserStatus.ACTIVE);
        userDto.setCreatedAt(LocalDateTime.now());
    }

    // ==================== REQUEST REGISTER TESTS ====================

    @Test
    void requestRegister_Success() throws Exception {
        // Given
        ApiResponse<String> response = ApiResponse.success(
                "OTP code has been sent to your email. Please verify within 5 minutes.",
                null);
        when(userService.requestRegister(any(RegisterDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/users/request-register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.message")
                        .value("OTP code has been sent to your email. Please verify within 5 minutes."))
                .andExpect(jsonPath("$.data").isEmpty());

        verify(userService, times(1)).requestRegister(any(RegisterDto.class));
    }

    @Test
    void requestRegister_EmailAlreadyExists() throws Exception {
        // Given
        ApiResponse<String> response = ApiResponse.error("Email already exists");
        when(userService.requestRegister(any(RegisterDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/users/request-register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value("Email already exists"));

        verify(userService, times(1)).requestRegister(any(RegisterDto.class));
    }

    @Test
    void requestRegister_InvalidEmail() throws Exception {
        // Given
        registerDto.setEmail("invalid-email");

        // When & Then
        mockMvc.perform(post("/api/users/request-register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).requestRegister(any(RegisterDto.class));
    }

    @Test
    void requestRegister_MissingFullName() throws Exception {
        // Given
        registerDto.setFullName(null);

        // When & Then
        mockMvc.perform(post("/api/users/request-register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).requestRegister(any(RegisterDto.class));
    }

    @Test
    void requestRegister_MissingEmail() throws Exception {
        // Given
        registerDto.setEmail(null);

        // When & Then
        mockMvc.perform(post("/api/users/request-register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).requestRegister(any(RegisterDto.class));
    }

    @Test
    void requestRegister_ShortPassword() throws Exception {
        // Given
        registerDto.setPassword("123"); // Less than 6 characters

        // When & Then
        mockMvc.perform(post("/api/users/request-register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).requestRegister(any(RegisterDto.class));
    }

    @Test
    void requestRegister_InvalidPhoneNumber() throws Exception {
        // Given
        registerDto.setPhoneNumber("123"); // Invalid Vietnamese phone number

        // When & Then
        mockMvc.perform(post("/api/users/request-register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).requestRegister(any(RegisterDto.class));
    }

    // ==================== VERIFY OTP TESTS ====================

    @Test
    void verifyOtp_Success() throws Exception {
        // Given
        ApiResponse<UserDto> response = ApiResponse.success(
                "Registration completed successfully!",
                userDto);
        when(userService.verifyOtpAndRegister(any(VerifyOtpDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/users/verify-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verifyOtpDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.message").value("Registration completed successfully!"))
                .andExpect(jsonPath("$.data.userId").value(1))
                .andExpect(jsonPath("$.data.fullName").value("Test User"))
                .andExpect(jsonPath("$.data.email").value("test@example.com"))
                .andExpect(jsonPath("$.data.role").value("CUSTOMER"))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"));

        verify(userService, times(1)).verifyOtpAndRegister(any(VerifyOtpDto.class));
    }

    @Test
    void verifyOtp_InvalidOtpCode() throws Exception {
        // Given
        ApiResponse<UserDto> response = ApiResponse.error("Invalid OTP code");
        when(userService.verifyOtpAndRegister(any(VerifyOtpDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/users/verify-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verifyOtpDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value("Invalid OTP code"))
                .andExpect(jsonPath("$.data").isEmpty());

        verify(userService, times(1)).verifyOtpAndRegister(any(VerifyOtpDto.class));
    }

    @Test
    void verifyOtp_OtpExpired() throws Exception {
        // Given
        ApiResponse<UserDto> response = ApiResponse.error("OTP code has expired. Please request a new one.");
        when(userService.verifyOtpAndRegister(any(VerifyOtpDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/users/verify-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verifyOtpDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value("OTP code has expired. Please request a new one."));

        verify(userService, times(1)).verifyOtpAndRegister(any(VerifyOtpDto.class));
    }

    @Test
    void verifyOtp_NoPendingRegistration() throws Exception {
        // Given
        ApiResponse<UserDto> response = ApiResponse.error("No pending registration found for this email");
        when(userService.verifyOtpAndRegister(any(VerifyOtpDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/users/verify-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verifyOtpDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value("No pending registration found for this email"));

        verify(userService, times(1)).verifyOtpAndRegister(any(VerifyOtpDto.class));
    }

    @Test
    void verifyOtp_MissingEmail() throws Exception {
        // Given
        verifyOtpDto.setEmail(null);

        // When & Then
        mockMvc.perform(post("/api/users/verify-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verifyOtpDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).verifyOtpAndRegister(any(VerifyOtpDto.class));
    }

    @Test
    void verifyOtp_InvalidEmail() throws Exception {
        // Given
        verifyOtpDto.setEmail("invalid-email");

        // When & Then
        mockMvc.perform(post("/api/users/verify-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verifyOtpDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).verifyOtpAndRegister(any(VerifyOtpDto.class));
    }

    @Test
    void verifyOtp_MissingOtpCode() throws Exception {
        // Given
        verifyOtpDto.setOtpCode(null);

        // When & Then
        mockMvc.perform(post("/api/users/verify-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verifyOtpDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).verifyOtpAndRegister(any(VerifyOtpDto.class));
    }

    @Test
    void verifyOtp_InvalidOtpCodeLength() throws Exception {
        // Given
        verifyOtpDto.setOtpCode("123"); // Less than 6 digits

        // When & Then
        mockMvc.perform(post("/api/users/verify-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verifyOtpDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).verifyOtpAndRegister(any(VerifyOtpDto.class));
    }

    // ==================== OTHER ENDPOINTS TESTS ====================

    @Test
    void getUsers_Success() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/users")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(userService, times(1)).getUsers(any(), any(), any(), any());
    }

    @Test
    void getUserById_Success() throws Exception {
        // Given
        when(userService.getUserById(1)).thenReturn(userDto);

        // When & Then
        mockMvc.perform(get("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.fullName").value("Test User"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userService, times(1)).getUserById(1);
    }

    @Test
    void verifyEmail_Success() throws Exception {
        // Given
        ApiResponse<String> response = ApiResponse.success(
                "Email verified successfully. Your account is now active.",
                null);
        when(userService.verifyEmail(anyString())).thenReturn(response);

        // When & Then
        mockMvc.perform(get("/api/users/verify-email")
                .param("token", "test-token-123")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.message").value("Email verified successfully. Your account is now active."));

        verify(userService, times(1)).verifyEmail("test-token-123");
    }

    // ==================== LOGIN TESTS ====================

    @Test
    void login_Success() throws Exception {
        // Given
        ApiResponse<UserDto> response = ApiResponse.success("Login successful", userDto);
        when(userService.login(any(LoginDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.data.userId").value(1))
                .andExpect(jsonPath("$.data.email").value("test@example.com"))
                .andExpect(jsonPath("$.data.fullName").value("Test User"));

        verify(userService, times(1)).login(any(LoginDto.class));
    }

    @Test
    void login_InvalidEmailFormat() throws Exception {
        // Given
        loginDto.setEmail("invalid-email");

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).login(any(LoginDto.class));
    }

    @Test
    void login_MissingEmail() throws Exception {
        // Given
        loginDto.setEmail(null);

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).login(any(LoginDto.class));
    }

    @Test
    void login_MissingPassword() throws Exception {
        // Given
        loginDto.setPassword(null);

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).login(any(LoginDto.class));
    }

    @Test
    void login_EmptyEmail() throws Exception {
        // Given
        loginDto.setEmail("");

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).login(any(LoginDto.class));
    }

    @Test
    void login_EmptyPassword() throws Exception {
        // Given
        loginDto.setPassword("");

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).login(any(LoginDto.class));
    }

    @Test
    void login_UserNotFound() throws Exception {
        // Given
        ApiResponse<UserDto> response = ApiResponse.error("Invalid email or password");
        when(userService.login(any(LoginDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value("Invalid email or password"))
                .andExpect(jsonPath("$.data").isEmpty());

        verify(userService, times(1)).login(any(LoginDto.class));
    }

    @Test
    void login_WrongPassword() throws Exception {
        // Given
        ApiResponse<UserDto> response = ApiResponse.error("Invalid email or password");
        when(userService.login(any(LoginDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value("Invalid email or password"))
                .andExpect(jsonPath("$.data").isEmpty());

        verify(userService, times(1)).login(any(LoginDto.class));
    }

    @Test
    void login_AccountInactive() throws Exception {
        // Given
        ApiResponse<UserDto> response = ApiResponse.error("Your account has been deactivated. Please contact support.");
        when(userService.login(any(LoginDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value("Your account has been deactivated. Please contact support."))
                .andExpect(jsonPath("$.data").isEmpty());

        verify(userService, times(1)).login(any(LoginDto.class));
    }

    @Test
    void login_AccountBanned() throws Exception {
        // Given
        ApiResponse<UserDto> response = ApiResponse.error("Your account has been banned. Please contact support.");
        when(userService.login(any(LoginDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value("Your account has been banned. Please contact support."))
                .andExpect(jsonPath("$.data").isEmpty());

        verify(userService, times(1)).login(any(LoginDto.class));
    }

    @Test
    void login_EmailNotVerified() throws Exception {
        // Given
        ApiResponse<UserDto> response = ApiResponse.error("Please verify your email before logging in.");
        when(userService.login(any(LoginDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value("Please verify your email before logging in."))
                .andExpect(jsonPath("$.data").isEmpty());

        verify(userService, times(1)).login(any(LoginDto.class));
    }

    // ==================== UPDATE PROFILE TESTS ====================

    @Test
    void updateProfile_Success() throws Exception {
        // Given
        UserDto updatedUser = new UserDto();
        updatedUser.setUserId(1);
        updatedUser.setFullName("Updated Name");
        updatedUser.setEmail("test@example.com");
        updatedUser.setPhoneNumber("0912345678");
        updatedUser.setRole(User.Role.CUSTOMER);
        updatedUser.setStatus(User.UserStatus.ACTIVE);
        updatedUser.setCreatedAt(LocalDateTime.now());

        ApiResponse<UserDto> response = ApiResponse.success("Profile updated successfully", updatedUser);
        when(userService.updateProfile(eq(1), any(UpdateProfileDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(put("/api/users/1/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateProfileDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.message").value("Profile updated successfully"))
                .andExpect(jsonPath("$.data.fullName").value("Updated Name"))
                .andExpect(jsonPath("$.data.phoneNumber").value("0912345678"));

        verify(userService, times(1)).updateProfile(eq(1), any(UpdateProfileDto.class));
    }

    @Test
    void updateProfile_UserNotFound() throws Exception {
        // Given
        ApiResponse<UserDto> response = ApiResponse.error("User not found");
        when(userService.updateProfile(eq(999), any(UpdateProfileDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(put("/api/users/999/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateProfileDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value("User not found"))
                .andExpect(jsonPath("$.data").isEmpty());

        verify(userService, times(1)).updateProfile(eq(999), any(UpdateProfileDto.class));
    }

    @Test
    void updateProfile_InvalidFullName() throws Exception {
        // Given
        updateProfileDto.setFullName(""); // Empty full name

        // When & Then
        mockMvc.perform(put("/api/users/1/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateProfileDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).updateProfile(anyInt(), any(UpdateProfileDto.class));
    }

    @Test
    void updateProfile_FullNameTooShort() throws Exception {
        // Given
        updateProfileDto.setFullName("A"); // Too short (min 2 characters)

        // When & Then
        mockMvc.perform(put("/api/users/1/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateProfileDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).updateProfile(anyInt(), any(UpdateProfileDto.class));
    }

    @Test
    void updateProfile_InvalidPhoneNumber() throws Exception {
        // Given
        updateProfileDto.setPhoneNumber("123"); // Invalid phone format

        // When & Then
        mockMvc.perform(put("/api/users/1/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateProfileDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).updateProfile(anyInt(), any(UpdateProfileDto.class));
    }

    @Test
    void updateProfile_WithPasswordChange_MissingCurrentPassword() throws Exception {
        // Given
        updateProfileDto.setNewPassword("newPassword456");
        ApiResponse<UserDto> response = ApiResponse.error("Current password is required to change password");
        when(userService.updateProfile(eq(1), any(UpdateProfileDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(put("/api/users/1/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateProfileDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value("Current password is required to change password"))
                .andExpect(jsonPath("$.data").isEmpty());

        verify(userService, times(1)).updateProfile(eq(1), any(UpdateProfileDto.class));
    }

    @Test
    void updateProfile_WithPasswordChange_WrongCurrentPassword() throws Exception {
        // Given
        updateProfileDto.setCurrentPassword("wrongPassword");
        updateProfileDto.setNewPassword("newPassword456");
        ApiResponse<UserDto> response = ApiResponse.error("Current password is incorrect");
        when(userService.updateProfile(eq(1), any(UpdateProfileDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(put("/api/users/1/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateProfileDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value("Current password is incorrect"))
                .andExpect(jsonPath("$.data").isEmpty());

        verify(userService, times(1)).updateProfile(eq(1), any(UpdateProfileDto.class));
    }

    @Test
    void updateProfile_WithPasswordChange_Success() throws Exception {
        // Given
        updateProfileDto.setCurrentPassword("password123");
        updateProfileDto.setNewPassword("newPassword456");

        UserDto updatedUser = new UserDto();
        updatedUser.setUserId(1);
        updatedUser.setFullName("Updated Name");
        updatedUser.setEmail("test@example.com");
        updatedUser.setPhoneNumber("0912345678");
        updatedUser.setRole(User.Role.CUSTOMER);
        updatedUser.setStatus(User.UserStatus.ACTIVE);
        updatedUser.setCreatedAt(LocalDateTime.now());

        ApiResponse<UserDto> response = ApiResponse.success("Profile updated successfully", updatedUser);
        when(userService.updateProfile(eq(1), any(UpdateProfileDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(put("/api/users/1/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateProfileDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.message").value("Profile updated successfully"))
                .andExpect(jsonPath("$.data.userId").value(1));

        verify(userService, times(1)).updateProfile(eq(1), any(UpdateProfileDto.class));
    }

    @Test
    void updateProfile_NewPasswordTooShort() throws Exception {
        // Given
        updateProfileDto.setNewPassword("12345"); // Too short (min 6 characters)
        updateProfileDto.setCurrentPassword("password123");

        // When & Then
        mockMvc.perform(put("/api/users/1/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateProfileDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).updateProfile(anyInt(), any(UpdateProfileDto.class));
    }
}
