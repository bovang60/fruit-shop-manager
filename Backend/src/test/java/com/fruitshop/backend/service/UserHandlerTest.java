package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.UserDto;
import com.fruitshop.backend.model.User;
import com.fruitshop.backend.repository.UserRepository;
import com.fruitshop.backend.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserHandlerTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * Thành công - Khóa tài khoản người dùng
     * Chuyển trạng thái từ ACTIVE sang BANNED
     */
    @Test
    void testUpdateUserStatus_UTCID01_Banned_Success() {
        Integer userId = 1;
        User existingUser = new User();
        existingUser.setUserId(userId);
        existingUser.setFullName("Nguyễn Văn A");
        existingUser.setStatus(User.UserStatus.ACTIVE);

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ApiResponse<UserDto> response = userService.updateUserStatus(userId, User.UserStatus.BANNED);
        UserDto result = response.getData();

        assertNotNull(result);
        assertEquals(0, response.getResultCd());
        assertEquals(User.UserStatus.BANNED, result.getStatus());
        verify(userRepository, times(1)).save(any(User.class));
    }

    /**
     * Thành công - Mở khóa tài khoản người dùng
     * Chuyển trạng thái từ BANNED sang ACTIVE
     */
    @Test
    void testUpdateUserStatus_UTCID02_Active_Success() {
        Integer userId = 2;
        User existingUser = new User();
        existingUser.setUserId(userId);
        existingUser.setFullName("Trần Thị B");
        existingUser.setStatus(User.UserStatus.BANNED);

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ApiResponse<UserDto> response = userService.updateUserStatus(userId, User.UserStatus.ACTIVE);
        UserDto result = response.getData();

        assertNotNull(result);
        assertEquals(0, response.getResultCd());
        assertEquals(User.UserStatus.ACTIVE, result.getStatus());
        verify(userRepository, times(1)).save(any(User.class));
    }

    /**
     * Lỗi - Người dùng không tồn tại
     * Thử cập nhật trạng thái cho một ID không có trong database
     */
    @Test
    void testUpdateUserStatus_UTCID03_UserNotFound_Error() {
        Integer userId = 999;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        ApiResponse<UserDto> response = userService.updateUserStatus(userId, User.UserStatus.ACTIVE);

        assertEquals(1, response.getResultCd());
        assertEquals("User not found", response.getMessage());
        assertNull(response.getData());
        verify(userRepository, never()).save(any());
    }
}
