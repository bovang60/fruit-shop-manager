# Hướng dẫn Viết Unit Test & Integration Test - Fruit Shop Manager

## 📌 Mục đích
Tài liệu này giúp AI tự động viết test case (TC) đầy đủ và chính xác cho các API trong dự án. Khi user chat tên API, AI sẽ tự động tạo:
1. **Unit Test** cho Service Layer (business logic)
2. **Integration Test** cho Controller Layer (API endpoint)

## 🏗 Cấu trúc Testing

### Phân loại Test
```
src/test/java/com/fruitshop/backend/
├── service/
│   └── impl/
│       └── [ServiceName]ImplTest.java    # Unit Test cho Service
└── controller/
    └── [ControllerName]IntegrationTest.java # Integration Test cho Controller
```

### Quy tắc đặt tên
- **Unit Test**: `{ServiceName}ImplTest.java` (ví dụ: `UserServiceImplTest.java`)
- **Integration Test**: `{ControllerName}IntegrationTest.java` (ví dụ: `UserControllerIntegrationTest.java`)
- **Class Test Name**: Khớp với tên file
- **Method Test Name**: `test{Action}_{Expected}_{Condition}()` 
  - Ví dụ: `testRegister_Success_WhenEmailIsNew()`
  - Ví dụ: `testRegister_Error_WhenEmailExists()`

---

## 🎯 Response Pattern - ApiResponse với resultCd

### Quy tắc Response
Project sử dụng pattern `ApiResponse<T>` với **resultCd**:
- `resultCd = 0`: Success (thành công)
- `resultCd = 1`: Error (lỗi business logic, validation)
- HTTP Status: Luôn trả về **200 OK** cho business logic
- HTTP Status: **400 Bad Request** cho validation errors (@Valid annotation)

### Structure of ApiResponse
```java
{
    "resultCd": 0 hoặc 1,
    "message": "Success/Error message",
    "data": T hoặc null
}
```

### Kiểm tra trong Test
**Success:**
```java
assertEquals(0, response.getResultCd());
assertNotNull(response.getData());
```

**Error:**
```java
assertEquals(1, response.getResultCd());
assertNull(response.getData());
```

---

## 📘 Template: UNIT TEST cho Service Layer

### Dependencies cần import
```java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
```

### Template Structure
```java
@ExtendWith(MockitoExtension.class)
@DisplayName("{Service Name} - {API Name} Tests")
class {ServiceName}ImplTest {

    @Mock
    private {Repository}Repository {repository}Repository;
    
    @Mock
    private {OtherDependency} {otherDependency}; // Nếu có dependency khác

    @InjectMocks
    private {ServiceName}Impl {service}Service;

    private {RequestDto} valid{RequestDto};
    private {Entity} mock{Entity};

    @BeforeEach
    void setUp() {
        // Chuẩn bị dữ liệu test hợp lệ
        valid{RequestDto} = new {RequestDto}();
        // Set các field cần thiết...

        // Chuẩn bị mock entity
        mock{Entity} = new {Entity}();
        // Set các field cần thiết...
    }

    @Test
    @DisplayName("{Action} - Success: Should return resultCd=0 when {condition}")
    void test{Action}_Success_When{Condition}() {
        // Arrange
        when({repository}Repository.{method}(any())).thenReturn({expectedValue});

        // Act
        ApiResponse<{ResponseDto}> response = {service}Service.{method}(valid{RequestDto});

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd(), "ResultCd should be 0 for success");
        assertEquals("{expected message}", response.getMessage());
        assertNotNull(response.getData());
        // Assert các field trong data...

        // Verify
        verify({repository}Repository, times(1)).{method}(any());
    }

    @Test
    @DisplayName("{Action} - Error: Should return resultCd=1 when {error condition}")
    void test{Action}_Error_When{ErrorCondition}() {
        // Arrange
        when({repository}Repository.{method}(any())).thenReturn({errorValue});

        // Act
        ApiResponse<{ResponseDto}> response = {service}Service.{method}(valid{RequestDto});

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getResultCd(), "ResultCd should be 1 for error");
        assertEquals("{expected error message}", response.getMessage());
        assertNull(response.getData(), "Data should be null when error occurs");

        // Verify
        verify({repository}Repository, times(1)).{method}(any());
        verify({repository}Repository, never()).save(any()); // Nếu không nên save
    }

    // Thêm các test case khác...
}
```

### Các Test Cases thường gặp cho Service Layer
1. **Success Case**: Đầu vào hợp lệ, trả về resultCd=0 với data đầy đủ
2. **Business Logic Error**: Vi phạm rule nghiệp vụ, trả về resultCd=1 (email exists, insufficient balance, etc.)
3. **Default Values**: Kiểm tra các giá trị mặc định (role, status, timestamps)
4. **Data Transformation**: Kiểm tra mapping từ Entity sang DTO
5. **Security**: Kiểm tra password không trả về trong response
6. **Edge Cases**: Null values, empty strings, boundary values

---

## 📗 Template: INTEGRATION TEST cho Controller Layer

### Dependencies cần import
```java
import com.fasterxml.jackson.databind.ObjectMapper;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
```

### Template Structure
```java
@SpringBootTest
@AutoConfigureMockMvc
@Transactional // Tự động rollback sau mỗi test
@DisplayName("{Controller Name} - {API Name} Integration Tests")
class {ControllerName}IntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private {Repository}Repository {repository}Repository;
    
    // Thêm các repository khác nếu cần...

    private {RequestDto} valid{RequestDto};

    @BeforeEach
    void setUp() {
        // Clear database trước mỗi test (nếu cần)
        {repository}Repository.deleteAll();

        // Chuẩn bị dữ liệu test
        valid{RequestDto} = new {RequestDto}();
        // Set các field cần thiết...
    }

    @Test
    @DisplayName("{HTTP_METHOD} {endpoint} - Success: Should return 200 with resultCd=0")
    void test{Action}_Success_ShouldReturn200WithResultCd0() throws Exception {
        // Act & Assert
        mockMvc.perform({httpMethod}("{endpoint}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(valid{RequestDto})))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.message").value("{expected message}"))
                .andExpect(jsonPath("$.data").isNotEmpty())
                .andExpect(jsonPath("$.data.{field1}").value("{expectedValue1}"))
                .andExpect(jsonPath("$.data.{field2}").value("{expectedValue2}"))
                .andExpect(jsonPath("$.data.{idField}").exists())
                .andExpect(jsonPath("$.data.{timestampField}").exists());
    }

    @Test
    @DisplayName("{HTTP_METHOD} {endpoint} - Error: Should return 200 with resultCd=1 when {condition}")
    void test{Action}_Error_ShouldReturn200WithResultCd1When{Condition}() throws Exception {
        // Arrange - Tạo điều kiện lỗi (ví dụ: dữ liệu đã tồn tại)
        {Entity} existing{Entity} = new {Entity}();
        // Set fields...
        {repository}Repository.save(existing{Entity});

        // Act & Assert
        mockMvc.perform({httpMethod}("{endpoint}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(valid{RequestDto})))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value("{expected error message}"))
                .andExpect(jsonPath("$.data").isEmpty());
    }

    @Test
    @DisplayName("{HTTP_METHOD} {endpoint} - Validation: Should return 400 when {field} is {invalid}")
    void test{Action}_Validation_ShouldReturn400When{Field}Is{Invalid}() throws Exception {
        // Arrange
        valid{RequestDto}.set{Field}({invalidValue});

        // Act & Assert
        mockMvc.perform({httpMethod}("{endpoint}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(valid{RequestDto})))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("{HTTP_METHOD} {endpoint} - Database: Should persist data correctly")
    void test{Action}_Database_ShouldPersistDataCorrectly() throws Exception {
        // Act
        mockMvc.perform({httpMethod}("{endpoint}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(valid{RequestDto})))
                .andExpect(status().isOk());

        // Assert - Kiểm tra database
        {Entity} saved{Entity} = {repository}Repository.findBy{Field}(valid{RequestDto}.get{Field}()).orElse(null);
        assertNotNull(saved{Entity});
        assertEquals(valid{RequestDto}.get{Field1}(), saved{Entity}.get{Field1}());
        assertEquals(valid{RequestDto}.get{Field2}(), saved{Entity}.get{Field2}());
        // Assert các field khác...
    }

    // Thêm các test case khác...
}
```

### Các Test Cases thường gặp cho Controller Layer
1. **Success - HTTP 200 + resultCd=0**: Request hợp lệ, xử lý thành công
2. **Business Error - HTTP 200 + resultCd=1**: Lỗi nghiệp vụ (duplicate data, insufficient permission, etc.)
3. **Validation Errors - HTTP 400**: Các field validation failed (@NotBlank, @Email, @Size, etc.)
4. **Database Persistence**: Kiểm tra dữ liệu đã lưu vào database đúng chưa
5. **Response Structure**: Kiểm tra tất cả field trong response có đầy đủ không
6. **Optional Fields**: Test với/không có các field optional (phoneNumber, address, etc.)
7. **Authentication** (nếu có): Test với/without token, với role khác nhau

---

## 📋 Checklist: Test Cases cần viết cho mỗi API

### Cho Unit Test (Service Layer)
- [ ] ✅ Test success case với dữ liệu hợp lệ (resultCd=0)
- [ ] ✅ Test các business logic errors (resultCd=1)
  - [ ] Duplicate data (email exists, username exists, etc.)
  - [ ] Insufficient resources (balance, stock, etc.)
  - [ ] Invalid state transitions (status changes)
- [ ] ✅ Test default values được set đúng (role, status, timestamps)
- [ ] ✅ Test data transformation (Entity → DTO mapping)
- [ ] ✅ Test sensitive data không trả về (password, token)
- [ ] ✅ Test repository method được gọi đúng (verify)
- [ ] ✅ Test edge cases (null, empty, boundary values)

### Cho Integration Test (Controller Layer)
- [ ] ✅ Test HTTP 200 + resultCd=0 cho success case
- [ ] ✅ Test HTTP 200 + resultCd=1 cho business logic errors
- [ ] ✅ Test HTTP 400 cho validation errors
  - [ ] Empty/null required fields (@NotBlank, @NotNull)
  - [ ] Invalid format (@Email, @Pattern)
  - [ ] Size constraints (@Size, @Min, @Max)
- [ ] ✅ Test response structure đầy đủ (tất cả fields)
- [ ] ✅ Test database persistence (data saved correctly)
- [ ] ✅ Test với optional fields (present/absent)
- [ ] ✅ Test với authentication/authorization (nếu có)

---

## 📝 Ví dụ cụ thể: User Register API

### Giả sử user chat: "register"
AI sẽ tự động hiểu cần tạo test cho API đăng ký (`/api/users/register`) và tạo 2 file:

### 1. UserServiceImplTest.java (Unit Test)
```java
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
    @DisplayName("Register - Security: Should not return password in response")
    void testRegister_Security_ShouldNotReturnPassword() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        // Act
        ApiResponse<UserDto> response = userService.register(validRegisterDto);

        // Assert
        assertNotNull(response.getData());
        assertNull(response.getData().getPassword(), "Password should not be in response");
    }

    @Test
    @DisplayName("Register - Success: Should set createdAt timestamp")
    void testRegister_Success_ShouldSetCreatedAt() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        // Act
        ApiResponse<UserDto> response = userService.register(validRegisterDto);

        // Assert
        assertNotNull(response.getData().getCreatedAt());
    }

    @Test
    @DisplayName("Register - Success: Should save correct user information")
    void testRegister_Success_ShouldSaveCorrectInformation() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            assertEquals("Nguyen Van A", savedUser.getFullName());
            assertEquals("nguyenvana@example.com", savedUser.getEmail());
            assertEquals("0987654321", savedUser.getPhoneNumber());
            assertEquals(User.Role.CUSTOMER, savedUser.getRole());
            assertEquals(User.UserStatus.ACTIVE, savedUser.getStatus());
            savedUser.setUserId(1);
            return savedUser;
        });

        // Act
        ApiResponse<UserDto> response = userService.register(validRegisterDto);

        // Assert
        assertEquals(0, response.getResultCd());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Register - Error: Should handle multiple registration attempts with same email")
    void testRegister_Error_MultipleAttemptsWithSameEmail() {
        // Arrange
        when(userRepository.findByEmail("nguyenvana@example.com"))
            .thenReturn(Optional.empty())
            .thenReturn(Optional.of(mockUser));
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        // Act
        ApiResponse<UserDto> firstResponse = userService.register(validRegisterDto);
        ApiResponse<UserDto> secondResponse = userService.register(validRegisterDto);

        // Assert
        assertEquals(0, firstResponse.getResultCd(), "First registration should succeed");
        assertEquals(1, secondResponse.getResultCd(), "Second registration should fail");
        assertEquals("Email already exists", secondResponse.getMessage());
    }
}
```

### 2. UserControllerIntegrationTest.java (Integration Test)
```java
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
        userRepository.deleteAll();

        validRegisterDto = new RegisterDto();
        validRegisterDto.setFullName("Nguyen Thi B");
        validRegisterDto.setEmail("nguyenthib@example.com");
        validRegisterDto.setPassword("password123");
        validRegisterDto.setPhoneNumber("0912345678");
    }

    @Test
    @DisplayName("POST /api/users/register - Success: Should return 200 with resultCd=0")
    void testRegister_Success_ShouldReturn200WithResultCd0() throws Exception {
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
        // Arrange
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
        validRegisterDto.setFullName("");

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterDto)))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/users/register - Validation: Should return 400 when email is invalid")
    void testRegister_Validation_ShouldReturn400WhenEmailInvalid() throws Exception {
        validRegisterDto.setEmail("invalid-email");

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterDto)))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/users/register - Validation: Should return 400 when password is too short")
    void testRegister_Validation_ShouldReturn400WhenPasswordTooShort() throws Exception {
        validRegisterDto.setPassword("123");

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterDto)))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/users/register - Database: Should persist user correctly in database")
    void testRegister_Database_ShouldPersistUserCorrectly() throws Exception {
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterDto)))
                .andExpect(status().isOk());

        User savedUser = userRepository.findByEmail("nguyenthib@example.com").orElse(null);
        assertNotNull(savedUser);
        assertEquals("Nguyen Thi B", savedUser.getFullName());
        assertEquals("nguyenthib@example.com", savedUser.getEmail());
        assertEquals("0912345678", savedUser.getPhoneNumber());
        assertEquals(User.Role.CUSTOMER, savedUser.getRole());
        assertEquals(User.UserStatus.ACTIVE, savedUser.getStatus());
        assertNotNull(savedUser.getCreatedAt());
    }

    @Test
    @DisplayName("POST /api/users/register - Optional: Should work without phoneNumber")
    void testRegister_Optional_ShouldWorkWithoutPhoneNumber() throws Exception {
        validRegisterDto.setPhoneNumber(null);

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterDto)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.data.phoneNumber").isEmpty());
    }

    @Test
    @DisplayName("POST /api/users/register - Security: Should not return password in response")
    void testRegister_Security_ShouldNotReturnPassword() throws Exception {
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterDto)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.password").doesNotExist());
    }
}
```

---

## 🔧 Tools & Annotations Cheatsheet

### Unit Test Annotations
```java
@ExtendWith(MockitoExtension.class)  // Enable Mockito
@DisplayName("Description")          // Tên hiển thị trong test report
@Mock                                // Tạo mock object
@InjectMocks                         // Inject mock vào class được test
@BeforeEach                          // Chạy trước mỗi test
@Test                                // Đánh dấu method là test case
```

### Integration Test Annotations
```java
@SpringBootTest                      // Load full Spring context
@AutoConfigureMockMvc                // Enable MockMvc
@Transactional                       // Auto rollback sau mỗi test
@Autowired                           // Inject real Spring beans
@BeforeEach                          // Setup trước mỗi test
@Test                                // Test case
```

### Mockito Methods
```java
when(...).thenReturn(...)            // Mock return value
when(...).thenThrow(...)             // Mock exception
verify(..., times(n))                // Verify method called n times
verify(..., never())                 // Verify method never called
any(), anyString(), anyLong()        // Argument matchers
```

### MockMvc Methods
```java
mockMvc.perform(...)                 // Thực hiện request
  .post("/api/...")                  // HTTP POST
  .get("/api/...")                   // HTTP GET
  .contentType(MediaType.APPLICATION_JSON)
  .content(json)                     // Request body
  .andDo(print())                    // Print request/response
  .andExpect(status().isOk())        // Expect HTTP 200
  .andExpect(jsonPath("$.field").value("value"))
```

### Assertions
```java
assertEquals(expected, actual)       // So sánh bằng
assertNotNull(value)                 // Không null
assertNull(value)                    // Là null
assertTrue(condition)                // Điều kiện đúng
assertFalse(condition)               // Điều kiện sai
```

---

## 🚀 Workflow: AI tự động viết test

### Khi user chat tên API (ví dụ: "login", "createProduct", "updateOrder")

**Bước 1**: AI xác định thông tin API
- Tìm Controller method tương ứng
- Xác định endpoint (POST /api/users/login)
- Xác định Service method được gọi
- Xác định Request DTO và Response DTO
- Xác định các validation rules (@Valid, @NotBlank, etc.)

**Bước 2**: AI tạo Unit Test cho Service
- Tạo file `{ServiceName}ImplTest.java`
- Mock tất cả dependencies (Repository, other Services)
- Viết test cho:
  - Success case (resultCd=0)
  - Business logic errors (resultCd=1)
  - Default values
  - Data transformation
  - Security (password not in response)
  - Edge cases

**Bước 3**: AI tạo Integration Test cho Controller
- Tạo file `{ControllerName}IntegrationTest.java`
- Setup database cleanup trong @BeforeEach
- Viết test cho:
  - Success case (HTTP 200 + resultCd=0)
  - Business errors (HTTP 200 + resultCd=1)
  - Validation errors (HTTP 400)
  - Response structure
  - Database persistence
  - Optional fields
  - Security

**Bước 4**: AI verify test coverage
- Đảm bảo tất cả branches được cover
- Đảm bảo tất cả validation rules được test
- Đảm bảo error cases được handle

---

## 📌 Lưu ý quan trọng

### 1. Response Pattern
- **LUÔN** kiểm tra `resultCd` thay vì chỉ HTTP status
- Success: `resultCd = 0`, HTTP 200
- Business Error: `resultCd = 1`, HTTP 200
- Validation Error: HTTP 400

### 2. Database trong Integration Test
- Dùng `@Transactional` để auto rollback
- Hoặc `deleteAll()` trong `@BeforeEach`
- Test với database thật (không mock)

### 3. Security
- **KHÔNG BAO GIỜ** trả về password trong response
- Kiểm tra `jsonPath("$.data.password").doesNotExist()`

### 4. Naming Convention
- Test method: `test{Action}_{Expected}_{Condition}`
- DisplayName: Mô tả rõ ràng bằng tiếng Anh
- File name: `{ClassName}Test.java` hoặc `{ClassName}IntegrationTest.java`

### 5. Test Data
- Dùng dữ liệu realistic (tên tiếng Việt, email hợp lệ, số điện thoại Việt Nam)
- Setup trong `@BeforeEach` để reuse
- Clear/reset database giữa các tests

### 6. Verification
- **Unit Test**: Verify repository methods được gọi đúng
- **Integration Test**: Verify data trong database

---

## ✅ Example: Nếu user chat "createProduct"

AI sẽ tự động:
1. Tìm `ProductController.createProduct()` method
2. Tìm `ProductService.createProduct()` method
3. Xác định `ProductRequestDto` và `ProductResponseDto`
4. Tạo `ProductServiceImplTest.java` với test cases:
   - Success with valid data
   - Error when product name exists
   - Error when category not found
   - Default values (status, timestamps)
   - Price validation
   - Stock validation
5. Tạo `ProductControllerIntegrationTest.java` với test cases:
   - POST /api/products - Success (200 + resultCd=0)
   - POST /api/products - Duplicate name (200 + resultCd=1)
   - POST /api/products - Invalid category (200 + resultCd=1)
   - POST /api/products - Empty name (400)
   - POST /api/products - Invalid price (400)
   - POST /api/products - Database persistence
   - POST /api/products - Optional fields (description, image)

---

**🎯 Mục tiêu cuối cùng**: User chỉ cần chat tên API, AI sẽ tự động tạo đầy đủ Unit Test và Integration Test theo đúng chuẩn của dự án!
