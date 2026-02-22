package com.fruitshop.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fruitshop.backend.dto.RegisterDto;
import com.fruitshop.backend.model.User;
import com.fruitshop.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("User Controller - Register API Integration Tests")
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    private RegisterDto validRegisterDto;

    @BeforeEach
    void setUp() {
        // Clear database trước mỗi test
        userRepository.deleteAll();

        // Chuẩn bị dữ liệu test
        validRegisterDto = new RegisterDto();
        validRegisterDto.setFullName("Nguyen Thi B");
        validRegisterDto.setEmail("nguyenthib@example.com");
        validRegisterDto.setPassword("password123");
        validRegisterDto.setPhoneNumber("0912345678");
    }

    @Test
    @DisplayName("POST /api/users/register - Success: Should return 200 with resultCd=0")
    void testRegister_Success_ShouldReturn200WithResultCd0() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterDto)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.data").isNotEmpty())
                .andExpect(jsonPath("$.data.fullName").value("Nguyen Thi B"))
                .andExpect(jsonPath("$.data.email").value("nguyenthib@example.com"))
                .andExpect(jsonPath("$.data.phoneNumber").value("0912345678"))
                .andExpect(jsonPath("$.data.role").value("CUSTOMER"))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"))
                .andExpect(jsonPath("$.data.userId").exists())
                .andExpect(jsonPath("$.data.createdAt").exists());
    }

    @Test
    @DisplayName("POST /api/users/register - Error: Should return 200 with resultCd=1 when email exists")
    void testRegister_Error_ShouldReturn200WithResultCd1WhenEmailExists() throws Exception {
        // Arrange - Tạo user trước
        User existingUser = new User();
        existingUser.setFullName("Existing User");
        existingUser.setEmail("nguyenthib@example.com");
        existingUser.setPassword("password");
        existingUser.setRole(User.Role.CUSTOMER);
        existingUser.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(existingUser);

        // Act & Assert
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterDto)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value("Email already exists"))
                .andExpect(jsonPath("$.data").isEmpty());
    }

    @Test
    @DisplayName("POST /api/users/register - Validation: Should return 400 when fullName is empty")
    void testRegister_Validation_ShouldReturn400WhenFullNameEmpty() throws Exception {
        // Arrange
        validRegisterDto.setFullName("");

        // Act & Assert
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterDto)))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/users/register - Validation: Should return 400 when email is invalid")
    void testRegister_Validation_ShouldReturn400WhenEmailInvalid() throws Exception {
        // Arrange
        validRegisterDto.setEmail("invalid-email");

        // Act & Assert
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterDto)))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/users/register - Validation: Should return 400 when password is too short")
    void testRegister_Validation_ShouldReturn400WhenPasswordTooShort() throws Exception {
        // Arrange
        validRegisterDto.setPassword("123");

        // Act & Assert
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterDto)))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/users/register - Success: Should save user to database")
    void testRegister_Success_ShouldSaveToDatabase() throws Exception {
        // Act
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterDto)))
                .andExpect(status().isOk());

        // Assert - Verify user exists in database
        var savedUser = userRepository.findByEmail("nguyenthib@example.com");
        assert savedUser.isPresent();
        assert savedUser.get().getFullName().equals("Nguyen Thi B");
        assert savedUser.get().getRole().equals(User.Role.CUSTOMER);
        assert savedUser.get().getStatus().equals(User.UserStatus.ACTIVE);
    }

    @Test
    @DisplayName("POST /api/users/register - Success: Should handle phone number with optional format")
    void testRegister_Success_WithPhoneNumber() throws Exception {
        // Test with different phone formats
        validRegisterDto.setPhoneNumber("0987654321");

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterDto)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.data.phoneNumber").value("0987654321"));
    }

    @Test
    @DisplayName("POST /api/users/register - Success: Should work without phone number")
    void testRegister_Success_WithoutPhoneNumber() throws Exception {
        // Arrange
        validRegisterDto.setPhoneNumber(null);

        // Act & Assert
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterDto)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0));
    }
}
