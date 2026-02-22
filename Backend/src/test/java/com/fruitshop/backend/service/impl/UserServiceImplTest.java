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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PendingRegistrationRepository pendingRegistrationRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserServiceImpl userService;

    private RegisterDto registerDto;
    private VerifyOtpDto verifyOtpDto;
    private PendingRegistration pendingRegistration;
    private User user;

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

        // Setup PendingRegistration
        pendingRegistration = new PendingRegistration();
        pendingRegistration.setPendingId(1);
        pendingRegistration.setFullName("Test User");
        pendingRegistration.setEmail("test@example.com");
        pendingRegistration.setPassword("password123");
        pendingRegistration.setPhoneNumber("0987654321");
        pendingRegistration.setOtpCode("123456");
        pendingRegistration.setCreatedAt(LocalDateTime.now());
        pendingRegistration.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        pendingRegistration.setIsVerified(false);

        // Setup User
        user = new User();
        user.setUserId(1);
        user.setFullName("Test User");
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setPhoneNumber("0987654321");
        user.setRole(User.Role.CUSTOMER);
        user.setStatus(User.UserStatus.ACTIVE);
        user.setEmailVerified(true);
        user.setCreatedAt(LocalDateTime.now());
    }

    // ==================== REQUEST REGISTER TESTS ====================

    @Test
    void requestRegister_Success() {
        // Given
        when(userRepository.findByEmail(registerDto.getEmail())).thenReturn(Optional.empty());
        when(pendingRegistrationRepository.findByEmailAndIsVerifiedFalse(registerDto.getEmail()))
                .thenReturn(Optional.empty());
        when(pendingRegistrationRepository.save(any(PendingRegistration.class)))
                .thenReturn(pendingRegistration);
        doNothing().when(emailService).sendOtpEmail(anyString(), anyString(), anyString());

        // When
        ApiResponse<String> response = userService.requestRegister(registerDto);

        // Then
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertTrue(response.getMessage().contains("OTP"));
        assertNull(response.getData());

        verify(userRepository, times(1)).findByEmail(registerDto.getEmail());
        verify(pendingRegistrationRepository, times(1)).save(any(PendingRegistration.class));
        verify(emailService, times(1)).sendOtpEmail(anyString(), anyString(), anyString());
    }

    @Test
    void requestRegister_EmailAlreadyExists() {
        // Given
        when(userRepository.findByEmail(registerDto.getEmail())).thenReturn(Optional.of(user));

        // When
        ApiResponse<String> response = userService.requestRegister(registerDto);

        // Then
        assertNotNull(response);
        assertEquals(1, response.getResultCd());
        assertEquals("Email already exists", response.getMessage());
        assertNull(response.getData());

        verify(userRepository, times(1)).findByEmail(registerDto.getEmail());
        verify(pendingRegistrationRepository, never()).save(any());
        verify(emailService, never()).sendOtpEmail(anyString(), anyString(), anyString());
    }

    @Test
    void requestRegister_DeleteOldPendingRegistration() {
        // Given
        PendingRegistration oldPending = new PendingRegistration();
        oldPending.setPendingId(999);
        oldPending.setEmail(registerDto.getEmail());

        when(userRepository.findByEmail(registerDto.getEmail())).thenReturn(Optional.empty());
        when(pendingRegistrationRepository.findByEmailAndIsVerifiedFalse(registerDto.getEmail()))
                .thenReturn(Optional.of(oldPending));
        when(pendingRegistrationRepository.save(any(PendingRegistration.class)))
                .thenReturn(pendingRegistration);
        doNothing().when(emailService).sendOtpEmail(anyString(), anyString(), anyString());

        // When
        ApiResponse<String> response = userService.requestRegister(registerDto);

        // Then
        assertNotNull(response);
        assertEquals(0, response.getResultCd());

        verify(pendingRegistrationRepository, times(1)).delete(oldPending);
        verify(pendingRegistrationRepository, times(1)).save(any(PendingRegistration.class));
    }

    @Test
    void requestRegister_EmailSendingFails() {
        // Given
        when(userRepository.findByEmail(registerDto.getEmail())).thenReturn(Optional.empty());
        when(pendingRegistrationRepository.findByEmailAndIsVerifiedFalse(registerDto.getEmail()))
                .thenReturn(Optional.empty());
        when(pendingRegistrationRepository.save(any(PendingRegistration.class)))
                .thenReturn(pendingRegistration);
        doThrow(new RuntimeException("Email service error"))
                .when(emailService).sendOtpEmail(anyString(), anyString(), anyString());

        // When
        ApiResponse<String> response = userService.requestRegister(registerDto);

        // Then
        assertNotNull(response);
        assertEquals(1, response.getResultCd());
        assertTrue(response.getMessage().contains("Failed to send OTP email"));

        verify(emailService, times(1)).sendOtpEmail(anyString(), anyString(), anyString());
    }

    // ==================== VERIFY OTP TESTS ====================

    @Test
    void verifyOtpAndRegister_Success() {
        // Given
        when(pendingRegistrationRepository.findByEmailAndIsVerifiedFalse(verifyOtpDto.getEmail()))
                .thenReturn(Optional.of(pendingRegistration));
        when(userRepository.findByEmail(pendingRegistration.getEmail()))
                .thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);

        // When
        ApiResponse<UserDto> response = userService.verifyOtpAndRegister(verifyOtpDto);

        // Then
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertTrue(response.getMessage().contains("successfully"));
        assertNotNull(response.getData());
        assertEquals("test@example.com", response.getData().getEmail());
        assertEquals(User.Role.CUSTOMER, response.getData().getRole());
        assertEquals(User.UserStatus.ACTIVE, response.getData().getStatus());

        verify(userRepository, times(1)).save(any(User.class));
        verify(pendingRegistrationRepository, times(1)).delete(pendingRegistration);
    }

    @Test
    void verifyOtpAndRegister_NoPendingRegistrationFound() {
        // Given
        when(pendingRegistrationRepository.findByEmailAndIsVerifiedFalse(verifyOtpDto.getEmail()))
                .thenReturn(Optional.empty());

        // When
        ApiResponse<UserDto> response = userService.verifyOtpAndRegister(verifyOtpDto);

        // Then
        assertNotNull(response);
        assertEquals(1, response.getResultCd());
        assertEquals("No pending registration found for this email", response.getMessage());
        assertNull(response.getData());

        verify(userRepository, never()).save(any());
        verify(pendingRegistrationRepository, never()).delete(any());
    }

    @Test
    void verifyOtpAndRegister_OtpExpired() {
        // Given
        pendingRegistration.setExpiryTime(LocalDateTime.now().minusMinutes(10)); // Expired
        when(pendingRegistrationRepository.findByEmailAndIsVerifiedFalse(verifyOtpDto.getEmail()))
                .thenReturn(Optional.of(pendingRegistration));

        // When
        ApiResponse<UserDto> response = userService.verifyOtpAndRegister(verifyOtpDto);

        // Then
        assertNotNull(response);
        assertEquals(1, response.getResultCd());
        assertTrue(response.getMessage().contains("expired"));
        assertNull(response.getData());

        verify(pendingRegistrationRepository, times(1)).delete(pendingRegistration);
        verify(userRepository, never()).save(any());
    }

    @Test
    void verifyOtpAndRegister_InvalidOtpCode() {
        // Given
        verifyOtpDto.setOtpCode("999999"); // Wrong OTP
        when(pendingRegistrationRepository.findByEmailAndIsVerifiedFalse(verifyOtpDto.getEmail()))
                .thenReturn(Optional.of(pendingRegistration));

        // When
        ApiResponse<UserDto> response = userService.verifyOtpAndRegister(verifyOtpDto);

        // Then
        assertNotNull(response);
        assertEquals(1, response.getResultCd());
        assertEquals("Invalid OTP code", response.getMessage());
        assertNull(response.getData());

        verify(userRepository, never()).save(any());
        verify(pendingRegistrationRepository, never()).delete(any());
    }

    @Test
    void verifyOtpAndRegister_EmailAlreadyExists() {
        // Given
        when(pendingRegistrationRepository.findByEmailAndIsVerifiedFalse(verifyOtpDto.getEmail()))
                .thenReturn(Optional.of(pendingRegistration));
        when(userRepository.findByEmail(pendingRegistration.getEmail()))
                .thenReturn(Optional.of(user)); // Email already exists

        // When
        ApiResponse<UserDto> response = userService.verifyOtpAndRegister(verifyOtpDto);

        // Then
        assertNotNull(response);
        assertEquals(1, response.getResultCd());
        assertEquals("Email already exists", response.getMessage());
        assertNull(response.getData());

        verify(pendingRegistrationRepository, times(1)).delete(pendingRegistration);
        verify(userRepository, never()).save(any());
    }

    // ==================== HELPER METHOD TESTS ====================

    @Test
    void generateOtpCode_ReturnsSixDigits() {
        // This test uses reflection to access private method
        // Or you can test indirectly through requestRegister

        // When - Call requestRegister which uses generateOtpCode internally
        when(userRepository.findByEmail(registerDto.getEmail())).thenReturn(Optional.empty());
        when(pendingRegistrationRepository.findByEmailAndIsVerifiedFalse(registerDto.getEmail()))
                .thenReturn(Optional.empty());
        when(pendingRegistrationRepository.save(any(PendingRegistration.class)))
                .thenAnswer(invocation -> {
                    PendingRegistration saved = invocation.getArgument(0);
                    // Verify OTP is 6 digits
                    assertTrue(saved.getOtpCode().matches("\\d{6}"));
                    return saved;
                });
        doNothing().when(emailService).sendOtpEmail(anyString(), anyString(), anyString());

        // When
        userService.requestRegister(registerDto);

        // Then - Verified in the Answer above
        verify(pendingRegistrationRepository, times(1)).save(any(PendingRegistration.class));
    }

    @Test
    void convertToDto_Success() {
        // When - Call getUserById which uses convertToDto
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        // When
        UserDto result = userService.getUserById(1);

        // Then
        assertNotNull(result);
        assertEquals(user.getUserId(), result.getUserId());
        assertEquals(user.getFullName(), result.getFullName());
        assertEquals(user.getEmail(), result.getEmail());
        assertEquals(user.getPhoneNumber(), result.getPhoneNumber());
        assertEquals(user.getRole(), result.getRole());
        assertEquals(user.getStatus(), result.getStatus());
        assertEquals(user.getCreatedAt(), result.getCreatedAt());
    }
}
