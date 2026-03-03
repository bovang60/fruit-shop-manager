package com.fruitshop.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ChangePasswordDto;
import com.fruitshop.backend.dto.LoginDto;
import com.fruitshop.backend.dto.RegisterDto;
import com.fruitshop.backend.dto.UpdateProfileDto;
import com.fruitshop.backend.dto.UserDto;
import com.fruitshop.backend.dto.VerifyOtpDto;
import com.fruitshop.backend.dto.RequestForgotPasswordDto;
import com.fruitshop.backend.dto.ResetPasswordDto;
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
        private RequestForgotPasswordDto requestForgotPasswordDto;
        private ResetPasswordDto resetPasswordDto;

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

                // Setup RequestForgotPasswordDto
                requestForgotPasswordDto = new RequestForgotPasswordDto();
                requestForgotPasswordDto.setEmail("test@example.com");

                // Setup ResetPasswordDto
                resetPasswordDto = new ResetPasswordDto();
                resetPasswordDto.setEmail("test@example.com");
                resetPasswordDto.setOtpCode("123456");
                resetPasswordDto.setNewPassword("newPassword123");
                resetPasswordDto.setConfirmPassword("newPassword123");
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
                                .andExpect(jsonPath("$.message")
                                                .value("OTP code has expired. Please request a new one."));

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
                ApiResponse<UserDto> response = ApiResponse.success("User retrieved successfully", userDto);
                when(userService.getUserById(1)).thenReturn(response);

                // When & Then
                mockMvc.perform(get("/api/users/1")
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(0))
                                .andExpect(jsonPath("$.message").value("User retrieved successfully"))
                                .andExpect(jsonPath("$.data.userId").value(1))
                                .andExpect(jsonPath("$.data.fullName").value("Test User"))
                                .andExpect(jsonPath("$.data.email").value("test@example.com"));

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
                                .andExpect(jsonPath("$.message")
                                                .value("Email verified successfully. Your account is now active."));

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
                ApiResponse<UserDto> response = ApiResponse
                                .error("Your account has been deactivated. Please contact support.");
                when(userService.login(any(LoginDto.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(post("/api/users/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(1))
                                .andExpect(jsonPath("$.message")
                                                .value("Your account has been deactivated. Please contact support."))
                                .andExpect(jsonPath("$.data").isEmpty());

                verify(userService, times(1)).login(any(LoginDto.class));
        }

        @Test
        void login_AccountBanned() throws Exception {
                // Given
                ApiResponse<UserDto> response = ApiResponse
                                .error("Your account has been banned. Please contact support.");
                when(userService.login(any(LoginDto.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(post("/api/users/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(1))
                                .andExpect(jsonPath("$.message")
                                                .value("Your account has been banned. Please contact support."))
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

        // ==================== CHANGE PASSWORD TESTS ====================

        @Test
        void changePassword_Success() throws Exception {
                // Given
                ChangePasswordDto changePasswordDto = new ChangePasswordDto();
                changePasswordDto.setCurrentPassword("oldPassword123");
                changePasswordDto.setNewPassword("newPassword456");
                changePasswordDto.setConfirmPassword("newPassword456");

                ApiResponse<String> response = ApiResponse.success("Password changed successfully", null);
                when(userService.changePassword(eq(1), any(ChangePasswordDto.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(put("/api/users/1/change-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(changePasswordDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(0))
                                .andExpect(jsonPath("$.message").value("Password changed successfully"))
                                .andExpect(jsonPath("$.data").isEmpty());

                verify(userService, times(1)).changePassword(eq(1), any(ChangePasswordDto.class));
        }

        @Test
        void changePassword_UserNotFound() throws Exception {
                // Given
                ChangePasswordDto changePasswordDto = new ChangePasswordDto();
                changePasswordDto.setCurrentPassword("oldPassword123");
                changePasswordDto.setNewPassword("newPassword456");
                changePasswordDto.setConfirmPassword("newPassword456");

                ApiResponse<String> response = ApiResponse.error("User not found");
                when(userService.changePassword(eq(999), any(ChangePasswordDto.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(put("/api/users/999/change-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(changePasswordDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(1))
                                .andExpect(jsonPath("$.message").value("User not found"))
                                .andExpect(jsonPath("$.data").isEmpty());

                verify(userService, times(1)).changePassword(eq(999), any(ChangePasswordDto.class));
        }

        @Test
        void changePassword_CurrentPasswordIncorrect() throws Exception {
                // Given
                ChangePasswordDto changePasswordDto = new ChangePasswordDto();
                changePasswordDto.setCurrentPassword("wrongPassword");
                changePasswordDto.setNewPassword("newPassword456");
                changePasswordDto.setConfirmPassword("newPassword456");

                ApiResponse<String> response = ApiResponse.error("Current password is incorrect");
                when(userService.changePassword(eq(1), any(ChangePasswordDto.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(put("/api/users/1/change-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(changePasswordDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(1))
                                .andExpect(jsonPath("$.message").value("Current password is incorrect"))
                                .andExpect(jsonPath("$.data").isEmpty());

                verify(userService, times(1)).changePassword(eq(1), any(ChangePasswordDto.class));
        }

        @Test
        void changePassword_NewPasswordAndConfirmPasswordDoNotMatch() throws Exception {
                // Given
                ChangePasswordDto changePasswordDto = new ChangePasswordDto();
                changePasswordDto.setCurrentPassword("oldPassword123");
                changePasswordDto.setNewPassword("newPassword456");
                changePasswordDto.setConfirmPassword("differentPassword789");

                ApiResponse<String> response = ApiResponse.error("New password and confirm password do not match");
                when(userService.changePassword(eq(1), any(ChangePasswordDto.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(put("/api/users/1/change-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(changePasswordDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(1))
                                .andExpect(jsonPath("$.message")
                                                .value("New password and confirm password do not match"))
                                .andExpect(jsonPath("$.data").isEmpty());

                verify(userService, times(1)).changePassword(eq(1), any(ChangePasswordDto.class));
        }

        @Test
        void changePassword_NewPasswordSameAsCurrentPassword() throws Exception {
                // Given
                ChangePasswordDto changePasswordDto = new ChangePasswordDto();
                changePasswordDto.setCurrentPassword("password123");
                changePasswordDto.setNewPassword("password123");
                changePasswordDto.setConfirmPassword("password123");

                ApiResponse<String> response = ApiResponse
                                .error("New password must be different from current password");
                when(userService.changePassword(eq(1), any(ChangePasswordDto.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(put("/api/users/1/change-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(changePasswordDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(1))
                                .andExpect(jsonPath("$.message")
                                                .value("New password must be different from current password"))
                                .andExpect(jsonPath("$.data").isEmpty());

                verify(userService, times(1)).changePassword(eq(1), any(ChangePasswordDto.class));
        }

        @Test
        void changePassword_CurrentPasswordBlank() throws Exception {
                // Given
                ChangePasswordDto changePasswordDto = new ChangePasswordDto();
                changePasswordDto.setCurrentPassword(""); // Blank
                changePasswordDto.setNewPassword("newPassword456");
                changePasswordDto.setConfirmPassword("newPassword456");

                // When & Then
                mockMvc.perform(put("/api/users/1/change-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(changePasswordDto)))
                                .andExpect(status().isBadRequest());

                verify(userService, never()).changePassword(anyInt(), any(ChangePasswordDto.class));
        }

        @Test
        void changePassword_NewPasswordBlank() throws Exception {
                // Given
                ChangePasswordDto changePasswordDto = new ChangePasswordDto();
                changePasswordDto.setCurrentPassword("oldPassword123");
                changePasswordDto.setNewPassword(""); // Blank
                changePasswordDto.setConfirmPassword("newPassword456");

                // When & Then
                mockMvc.perform(put("/api/users/1/change-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(changePasswordDto)))
                                .andExpect(status().isBadRequest());

                verify(userService, never()).changePassword(anyInt(), any(ChangePasswordDto.class));
        }

        @Test
        void changePassword_ConfirmPasswordBlank() throws Exception {
                // Given
                ChangePasswordDto changePasswordDto = new ChangePasswordDto();
                changePasswordDto.setCurrentPassword("oldPassword123");
                changePasswordDto.setNewPassword("newPassword456");
                changePasswordDto.setConfirmPassword(""); // Blank

                // When & Then
                mockMvc.perform(put("/api/users/1/change-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(changePasswordDto)))
                                .andExpect(status().isBadRequest());

                verify(userService, never()).changePassword(anyInt(), any(ChangePasswordDto.class));
        }

        @Test
        void changePassword_NewPasswordTooShort() throws Exception {
                // Given
                ChangePasswordDto changePasswordDto = new ChangePasswordDto();
                changePasswordDto.setCurrentPassword("oldPassword123");
                changePasswordDto.setNewPassword("12345"); // Too short (min 6 characters)
                changePasswordDto.setConfirmPassword("12345");

                // When & Then
                mockMvc.perform(put("/api/users/1/change-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(changePasswordDto)))
                                .andExpect(status().isBadRequest());

                verify(userService, never()).changePassword(anyInt(), any(ChangePasswordDto.class));
        }

        @Test
        void changePassword_NewPasswordTooLong() throws Exception {
                // Given
                ChangePasswordDto changePasswordDto = new ChangePasswordDto();
                changePasswordDto.setCurrentPassword("oldPassword123");
                // Create a password longer than 50 characters
                String longPassword = "a".repeat(51);
                changePasswordDto.setNewPassword(longPassword);
                changePasswordDto.setConfirmPassword(longPassword);

                // When & Then
                mockMvc.perform(put("/api/users/1/change-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(changePasswordDto)))
                                .andExpect(status().isBadRequest());

                verify(userService, never()).changePassword(anyInt(), any(ChangePasswordDto.class));
        }

        @Test
        void changePassword_AllFieldsNull() throws Exception {
                // Given
                ChangePasswordDto changePasswordDto = new ChangePasswordDto();
                // All fields are null

                // When & Then
                mockMvc.perform(put("/api/users/1/change-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(changePasswordDto)))
                                .andExpect(status().isBadRequest());

                verify(userService, never()).changePassword(anyInt(), any(ChangePasswordDto.class));
        }

        // ==================== FORGOT PASSWORD - REQUEST OTP TESTS ====================

        @Test
        void requestForgotPassword_Success() throws Exception {
                // Given
                ApiResponse<String> response = ApiResponse.success(
                                "OTP code has been sent to your email. Please verify within 5 minutes.",
                                null);
                when(userService.requestForgotPassword(any(RequestForgotPasswordDto.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/request")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestForgotPasswordDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(0))
                                .andExpect(jsonPath("$.message").value(
                                                "OTP code has been sent to your email. Please verify within 5 minutes."))
                                .andExpect(jsonPath("$.data").isEmpty());

                verify(userService, times(1)).requestForgotPassword(any(RequestForgotPasswordDto.class));
        }

        @Test
        void requestForgotPassword_EmailNotFound() throws Exception {
                // Given
                ApiResponse<String> response = ApiResponse.error("No account found with this email address");
                when(userService.requestForgotPassword(any(RequestForgotPasswordDto.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/request")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestForgotPasswordDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(1))
                                .andExpect(jsonPath("$.message").value("No account found with this email address"))
                                .andExpect(jsonPath("$.data").isEmpty());

                verify(userService, times(1)).requestForgotPassword(any(RequestForgotPasswordDto.class));
        }

        @Test
        void requestForgotPassword_EmailSendingFails() throws Exception {
                // Given
                ApiResponse<String> response = ApiResponse.error("Failed to send OTP email. Please try again.");
                when(userService.requestForgotPassword(any(RequestForgotPasswordDto.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/request")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestForgotPasswordDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(1))
                                .andExpect(jsonPath("$.message").value("Failed to send OTP email. Please try again."))
                                .andExpect(jsonPath("$.data").isEmpty());

                verify(userService, times(1)).requestForgotPassword(any(RequestForgotPasswordDto.class));
        }

        @Test
        void requestForgotPassword_EmailBlank() throws Exception {
                // Given
                requestForgotPasswordDto.setEmail("");

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/request")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestForgotPasswordDto)))
                                .andExpect(status().isBadRequest());

                verify(userService, never()).requestForgotPassword(any(RequestForgotPasswordDto.class));
        }

        @Test
        void requestForgotPassword_EmailInvalidFormat() throws Exception {
                // Given
                requestForgotPasswordDto.setEmail("invalid-email");

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/request")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestForgotPasswordDto)))
                                .andExpect(status().isBadRequest());

                verify(userService, never()).requestForgotPassword(any(RequestForgotPasswordDto.class));
        }

        // ==================== FORGOT PASSWORD - RESET PASSWORD TESTS
        // ====================

        @Test
        void resetPassword_Success() throws Exception {
                // Given
                ApiResponse<String> response = ApiResponse.success(
                                "Password has been reset successfully. You can now login with your new password.",
                                null);
                when(userService.resetPassword(any(ResetPasswordDto.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/reset")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(resetPasswordDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(0))
                                .andExpect(jsonPath("$.message").value(
                                                "Password has been reset successfully. You can now login with your new password."))
                                .andExpect(jsonPath("$.data").isEmpty());

                verify(userService, times(1)).resetPassword(any(ResetPasswordDto.class));
        }

        @Test
        void resetPassword_EmailNotFound() throws Exception {
                // Given
                ApiResponse<String> response = ApiResponse.error("No account found with this email address");
                when(userService.resetPassword(any(ResetPasswordDto.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/reset")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(resetPasswordDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(1))
                                .andExpect(jsonPath("$.message").value("No account found with this email address"))
                                .andExpect(jsonPath("$.data").isEmpty());

                verify(userService, times(1)).resetPassword(any(ResetPasswordDto.class));
        }

        @Test
        void resetPassword_OtpNotFound() throws Exception {
                // Given
                ApiResponse<String> response = ApiResponse
                                .error("No password reset request found. Please request a new OTP.");
                when(userService.resetPassword(any(ResetPasswordDto.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/reset")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(resetPasswordDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(1))
                                .andExpect(jsonPath("$.message")
                                                .value("No password reset request found. Please request a new OTP."))
                                .andExpect(jsonPath("$.data").isEmpty());

                verify(userService, times(1)).resetPassword(any(ResetPasswordDto.class));
        }

        @Test
        void resetPassword_OtpExpired() throws Exception {
                // Given
                ApiResponse<String> response = ApiResponse.error("OTP code has expired. Please request a new one.");
                when(userService.resetPassword(any(ResetPasswordDto.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/reset")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(resetPasswordDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(1))
                                .andExpect(jsonPath("$.message")
                                                .value("OTP code has expired. Please request a new one."))
                                .andExpect(jsonPath("$.data").isEmpty());

                verify(userService, times(1)).resetPassword(any(ResetPasswordDto.class));
        }

        @Test
        void resetPassword_InvalidOtpCode() throws Exception {
                // Given
                ApiResponse<String> response = ApiResponse.error("Invalid OTP code");
                when(userService.resetPassword(any(ResetPasswordDto.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/reset")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(resetPasswordDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(1))
                                .andExpect(jsonPath("$.message").value("Invalid OTP code"))
                                .andExpect(jsonPath("$.data").isEmpty());

                verify(userService, times(1)).resetPassword(any(ResetPasswordDto.class));
        }

        @Test
        void resetPassword_PasswordMismatch() throws Exception {
                // Given
                ApiResponse<String> response = ApiResponse.error("New password and confirm password do not match");
                when(userService.resetPassword(any(ResetPasswordDto.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/reset")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(resetPasswordDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resultCd").value(1))
                                .andExpect(jsonPath("$.message")
                                                .value("New password and confirm password do not match"))
                                .andExpect(jsonPath("$.data").isEmpty());

                verify(userService, times(1)).resetPassword(any(ResetPasswordDto.class));
        }

        @Test
        void resetPassword_EmailBlank() throws Exception {
                // Given
                resetPasswordDto.setEmail("");

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/reset")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(resetPasswordDto)))
                                .andExpect(status().isBadRequest());

                verify(userService, never()).resetPassword(any(ResetPasswordDto.class));
        }

        @Test
        void resetPassword_EmailInvalidFormat() throws Exception {
                // Given
                resetPasswordDto.setEmail("invalid-email");

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/reset")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(resetPasswordDto)))
                                .andExpect(status().isBadRequest());

                verify(userService, never()).resetPassword(any(ResetPasswordDto.class));
        }

        @Test
        void resetPassword_OtpCodeBlank() throws Exception {
                // Given
                resetPasswordDto.setOtpCode("");

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/reset")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(resetPasswordDto)))
                                .andExpect(status().isBadRequest());

                verify(userService, never()).resetPassword(any(ResetPasswordDto.class));
        }

        @Test
        void resetPassword_NewPasswordBlank() throws Exception {
                // Given
                resetPasswordDto.setNewPassword("");

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/reset")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(resetPasswordDto)))
                                .andExpect(status().isBadRequest());

                verify(userService, never()).resetPassword(any(ResetPasswordDto.class));
        }

        @Test
        void resetPassword_ConfirmPasswordBlank() throws Exception {
                // Given
                resetPasswordDto.setConfirmPassword("");

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/reset")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(resetPasswordDto)))
                                .andExpect(status().isBadRequest());

                verify(userService, never()).resetPassword(any(ResetPasswordDto.class));
        }

        @Test
        void resetPassword_NewPasswordTooShort() throws Exception {
                // Given
                resetPasswordDto.setNewPassword("12345"); // 5 characters
                resetPasswordDto.setConfirmPassword("12345");

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/reset")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(resetPasswordDto)))
                                .andExpect(status().isBadRequest());

                verify(userService, never()).resetPassword(any(ResetPasswordDto.class));
        }

        @Test
        void resetPassword_NewPasswordTooLong() throws Exception {
                // Given
                String longPassword = "a".repeat(51); // 51 characters
                resetPasswordDto.setNewPassword(longPassword);
                resetPasswordDto.setConfirmPassword(longPassword);

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/reset")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(resetPasswordDto)))
                                .andExpect(status().isBadRequest());

                verify(userService, never()).resetPassword(any(ResetPasswordDto.class));
        }

        @Test
        void resetPassword_AllFieldsNull() throws Exception {
                // Given
                ResetPasswordDto emptyDto = new ResetPasswordDto();
                // All fields are null

                // When & Then
                mockMvc.perform(post("/api/users/forgot-password/reset")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(emptyDto)))
                                .andExpect(status().isBadRequest());

                verify(userService, never()).resetPassword(any(ResetPasswordDto.class));
        }
}
