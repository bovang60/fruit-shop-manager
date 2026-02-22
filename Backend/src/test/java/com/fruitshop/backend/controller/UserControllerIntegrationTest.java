package com.fruitshop.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.RegisterDto;
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
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
}
