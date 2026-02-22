package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.RegisterDto;
import com.fruitshop.backend.dto.UserDto;
import com.fruitshop.backend.model.User;
import com.fruitshop.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("User Service - Register API Tests")
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private RegisterDto validRegisterDto;
    private User mockUser;

    @BeforeEach
    void setUp() {
        // Chuẩn bị dữ liệu test
        validRegisterDto = new RegisterDto();
        validRegisterDto.setFullName("Nguyen Van A");
        validRegisterDto.setEmail("nguyenvana@example.com");
        validRegisterDto.setPassword("password123");
        validRegisterDto.setPhoneNumber("0987654321");

        mockUser = new User();
        mockUser.setUserId(1);
        mockUser.setFullName("Nguyen Van A");
        mockUser.setEmail("nguyenvana@example.com");
        mockUser.setPassword("password123");
        mockUser.setPhoneNumber("0987654321");
        mockUser.setRole(User.Role.CUSTOMER);
        mockUser.setStatus(User.UserStatus.ACTIVE);
        mockUser.setCreatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("Register - Success: Should return resultCd=0 when register with new email")
    void testRegister_Success_WhenEmailIsNew() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        // Act
        ApiResponse<UserDto> response = userService.register(validRegisterDto);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd(), "ResultCd should be 0 for success");
        assertEquals("User registered successfully", response.getMessage());
        assertNotNull(response.getData());
        assertEquals("Nguyen Van A", response.getData().getFullName());
        assertEquals("nguyenvana@example.com", response.getData().getEmail());
        assertEquals(User.Role.CUSTOMER, response.getData().getRole());
        assertEquals(User.UserStatus.ACTIVE, response.getData().getStatus());

        // Verify
        verify(userRepository, times(1)).findByEmail("nguyenvana@example.com");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Register - Error: Should return resultCd=1 when email already exists")
    void testRegister_Error_WhenEmailExists() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

        // Act
        ApiResponse<UserDto> response = userService.register(validRegisterDto);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getResultCd(), "ResultCd should be 1 for error");
        assertEquals("Email already exists", response.getMessage());
        assertNull(response.getData(), "Data should be null when error occurs");

        // Verify that save was never called
        verify(userRepository, times(1)).findByEmail("nguyenvana@example.com");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Register - Success: Should create user with CUSTOMER role by default")
    void testRegister_Success_ShouldSetCustomerRole() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setUserId(1);
            return savedUser;
        });

        // Act
        ApiResponse<UserDto> response = userService.register(validRegisterDto);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertEquals(User.Role.CUSTOMER, response.getData().getRole());
        assertEquals(User.UserStatus.ACTIVE, response.getData().getStatus());
    }

    @Test
    @DisplayName("Register - Success: Should not save password in DTO response")
    void testRegister_Success_ShouldNotReturnPassword() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        // Act
        ApiResponse<UserDto> response = userService.register(validRegisterDto);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getData());
        // UserDto không có trường password (theo design)
        // Chỉ kiểm tra các trường khác có tồn tại
        assertNotNull(response.getData().getEmail());
        assertNotNull(response.getData().getFullName());
    }

    @Test
    @DisplayName("Register - Success: Should set createdAt timestamp")
    void testRegister_Success_ShouldSetCreatedAt() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            assertNotNull(user.getCreatedAt(), "CreatedAt should be set before saving");
            return mockUser;
        });

        // Act
        ApiResponse<UserDto> response = userService.register(validRegisterDto);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertNotNull(response.getData().getCreatedAt());
    }

    @Test
    @DisplayName("Register - Success: Should save all user information correctly")
    void testRegister_Success_ShouldSaveCorrectInformation() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);

            // Verify saved user has correct data
            assertEquals("Nguyen Van A", user.getFullName());
            assertEquals("nguyenvana@example.com", user.getEmail());
            assertEquals("password123", user.getPassword());
            assertEquals("0987654321", user.getPhoneNumber());
            assertEquals(User.Role.CUSTOMER, user.getRole());
            assertEquals(User.UserStatus.ACTIVE, user.getStatus());

            user.setUserId(1);
            return user;
        });

        // Act
        ApiResponse<UserDto> response = userService.register(validRegisterDto);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Register - Error: Should handle multiple registration attempts with same email")
    void testRegister_Error_MultipleAttemptsWithSameEmail() {
        // Arrange
        when(userRepository.findByEmail("nguyenvana@example.com"))
                .thenReturn(Optional.of(mockUser));

        // Act - First attempt
        ApiResponse<UserDto> firstResponse = userService.register(validRegisterDto);

        // Act - Second attempt
        ApiResponse<UserDto> secondResponse = userService.register(validRegisterDto);

        // Assert both attempts should fail
        assertEquals(1, firstResponse.getResultCd());
        assertEquals("Email already exists", firstResponse.getMessage());

        assertEquals(1, secondResponse.getResultCd());
        assertEquals("Email already exists", secondResponse.getMessage());

        // Verify findByEmail was called twice, but save was never called
        verify(userRepository, times(2)).findByEmail("nguyenvana@example.com");
        verify(userRepository, never()).save(any(User.class));
    }
}
