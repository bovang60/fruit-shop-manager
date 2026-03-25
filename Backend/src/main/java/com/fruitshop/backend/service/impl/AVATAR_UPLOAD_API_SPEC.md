# Avatar Upload API Specification

## 📋 Tổng quan

Feature cho phép user upload ảnh đại diện (avatar) trong trang Profile. Frontend đã implement UI và logic, cần Backend tích hợp API endpoint để xử lý upload file.

**Module:** User Profile Management  
**Feature:** Avatar Upload  
**Priority:** Medium  
**Status:** Frontend Completed - Pending Backend Integration  
**Date:** March 22, 2026  

---

## 🔌 API Endpoint

### **Upload Avatar**

#### **Endpoint Information**

```
POST /api/users/{id}/avatar
```

| Property | Value |
|----------|-------|
| **Method** | POST |
| **URL** | `/api/users/{id}/avatar` |
| **Content-Type** | `multipart/form-data` |
| **Authentication** | Required (JWT Token) |
| **Authorization** | User can only upload their own avatar (userId must match authenticated user) |

#### **Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `number` | Yes | User ID (must match authenticated user's ID) |

#### **Request Body (multipart/form-data)**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `image` | `File` | Yes | Image file to upload | - Type: image/png, image/jpg, image/jpeg, image/gif<br>- Max size: 5MB<br>- Dimensions: Optional (recommend max 2048x2048) |

#### **Request Headers**

```http
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data
```

---

## 📤 Request Example

### **cURL Example**

```bash
curl -X POST \
  http://localhost:8080/api/users/123/avatar \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: multipart/form-data' \
  -F 'image=@/path/to/avatar.jpg'
```

### **JavaScript/Fetch Example**

```javascript
const formData = new FormData();
formData.append('image', file); // file = File object from input

const response = await fetch('http://localhost:8080/api/users/123/avatar', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
    // Don't set Content-Type - browser will set it with boundary
  },
  body: formData
});

const result = await response.json();
```

### **Frontend Implementation (Actual)**

```typescript
// From: src/services/profileService.ts
export async function uploadAvatar(
  userId: number,
  imageFile: File,
): Promise<ApiResponse<UserDto>> {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/users/${userId}/avatar`,
      {
        method: "POST",
        body: formData,
        // Content-Type will be set automatically with boundary
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<UserDto> = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return {
      resultCd: 1,
      message: "Không thể tải ảnh lên. Vui lòng thử lại.",
      data: null,
    };
  }
}
```

---

## 📥 Response Format

### **Success Response (200 OK)**

```json
{
  "resultCd": 0,
  "message": "Avatar uploaded successfully",
  "data": {
    "userId": 123,
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "phoneNumber": "0912345678",
    "address": "123 Main St, District 1, HCMC",
    "image": "https://yourdomain.com/uploads/avatars/user-123-1679472000000.jpg",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "createdAt": "2026-03-01T10:30:00Z"
  }
}
```

#### **Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| `resultCd` | `number` | 0 = success, 1 = error |
| `message` | `string` | Success message (Vietnamese preferred) |
| `data` | `UserDto` | Updated user object with new avatar URL |
| `data.image` | `string` | **IMPORTANT:** Full URL to uploaded avatar image |

**Note:** Field name trong database là `image`, không phải `avatar`. Frontend sẽ map `image` → `avatar` trong UI.

---

## ❌ Error Responses

### **1. Unauthorized (401)**

```json
{
  "resultCd": 1,
  "message": "Unauthorized. Please login.",
  "data": null
}
```

**Trigger:** No token, invalid token, or expired token

---

### **2. Forbidden (403)**

```json
{
  "resultCd": 1,
  "message": "Forbidden. You can only upload your own avatar.",
  "data": null
}
```

**Trigger:** User trying to upload avatar for different user (userId in URL ≠ authenticated user ID)

---

### **3. Bad Request (400) - Invalid File Type**

```json
{
  "resultCd": 1,
  "message": "Invalid file type. Only images (PNG, JPG, GIF) are allowed.",
  "data": null
}
```

**Trigger:** File is not an image (e.g., PDF, TXT, etc.)

---

### **4. Bad Request (400) - File Too Large**

```json
{
  "resultCd": 1,
  "message": "File size exceeds limit. Maximum 5MB allowed.",
  "data": null
}
```

**Trigger:** File size > 5MB

---

### **5. Bad Request (400) - No File**

```json
{
  "resultCd": 1,
  "message": "No image file provided.",
  "data": null
}
```

**Trigger:** Request sent without `image` field

---

### **6. Not Found (404)**

```json
{
  "resultCd": 1,
  "message": "User not found.",
  "data": null
}
```

**Trigger:** User with given ID doesn't exist

---

### **7. Internal Server Error (500)**

```json
{
  "resultCd": 1,
  "message": "Failed to upload image. Please try again later.",
  "data": null
}
```

**Trigger:** Server error (disk full, upload service down, etc.)

---

## ✅ Validation Rules

### **File Validation**

| Rule | Value | Error Message |
|------|-------|---------------|
| Required | Yes | "No image file provided." |
| File Type | image/png, image/jpg, image/jpeg, image/gif | "Invalid file type. Only images (PNG, JPG, GIF) are allowed." |
| Max Size | 5MB (5 * 1024 * 1024 bytes) | "File size exceeds limit. Maximum 5MB allowed." |
| Min Size | 1KB (recommended) | "File is too small or corrupted." |
| Dimensions | Max 2048x2048 (recommended) | "Image dimensions exceed limit." |

### **Authorization Validation**

| Rule | Description | Error Message |
|------|-------------|---------------|
| JWT Token | Must be present and valid | "Unauthorized. Please login." |
| User Ownership | userId in URL must match authenticated user | "Forbidden. You can only upload your own avatar." |
| User Exists | User with ID must exist in database | "User not found." |

---

## 💾 Database Schema

### **Existing `users` Table**

Field `image` đã tồn tại trong database. Chỉ cần update khi upload thành công.

```sql
-- Assuming existing schema
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  address TEXT,
  image VARCHAR(500), -- Avatar URL (this field already exists)
  role ENUM('CUSTOMER', 'SELLER', 'ADMIN') DEFAULT 'CUSTOMER',
  status ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### **Update Query Example**

```sql
UPDATE users 
SET image = ?, updated_at = NOW()
WHERE user_id = ?;
```

---

## 🔧 Backend Implementation Guide

### **Step 1: Setup File Upload Service**

#### **Java Spring Boot Example**

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @PostMapping("/{id}/avatar")
    public ResponseEntity<ApiResponse<UserDto>> uploadAvatar(
            @PathVariable("id") Long userId,
            @RequestParam("image") MultipartFile imageFile,
            @AuthenticationPrincipal UserDetails currentUser) {
        
        try {
            // 1. Authorization check
            Long authenticatedUserId = getCurrentUserId(currentUser);
            if (!userId.equals(authenticatedUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse<>(1, "Forbidden. You can only upload your own avatar.", null));
            }
            
            // 2. File validation
            if (imageFile.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(1, "No image file provided.", null));
            }
            
            // Check file type
            String contentType = imageFile.getContentType();
            if (!isValidImageType(contentType)) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(1, "Invalid file type. Only images (PNG, JPG, GIF) are allowed.", null));
            }
            
            // Check file size (5MB)
            if (imageFile.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(1, "File size exceeds limit. Maximum 5MB allowed.", null));
            }
            
            // 3. Save file to storage
            String imageUrl = fileStorageService.storeFile(imageFile, "avatars", userId);
            
            // 4. Update user in database
            UserDto updatedUser = userService.updateUserAvatar(userId, imageUrl);
            
            // 5. Return success response
            return ResponseEntity.ok(
                new ApiResponse<>(0, "Avatar uploaded successfully", updatedUser)
            );
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(1, "Failed to upload image. Please try again later.", null));
        }
    }
    
    private boolean isValidImageType(String contentType) {
        return contentType != null && (
            contentType.equals("image/png") ||
            contentType.equals("image/jpeg") ||
            contentType.equals("image/jpg") ||
            contentType.equals("image/gif")
        );
    }
    
    private Long getCurrentUserId(UserDetails currentUser) {
        // Extract userId from JWT token
        return ((CustomUserDetails) currentUser).getUserId();
    }
}
```

### **Step 2: File Storage Service**

#### **Option A: Local Storage**

```java
@Service
public class FileStorageService {
    
    @Value("${file.upload-dir}")
    private String uploadDir; // e.g., /var/www/uploads
    
    @Value("${app.base-url}")
    private String baseUrl; // e.g., https://yourdomain.com
    
    public String storeFile(MultipartFile file, String subFolder, Long userId) throws IOException {
        // Create directory if not exists
        Path uploadPath = Paths.get(uploadDir, subFolder);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = "user-" + userId + "-" + System.currentTimeMillis() + extension;
        
        // Save file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Return full URL
        return baseUrl + "/uploads/" + subFolder + "/" + filename;
    }
    
    public void deleteFile(String imageUrl) {
        // Extract filename from URL and delete
        try {
            String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir, "avatars", filename);
            Files.deleteIfExists(filePath);
        } catch (Exception e) {
            log.error("Failed to delete file: " + imageUrl, e);
        }
    }
}
```

#### **Option B: Cloud Storage (AWS S3, Google Cloud, etc.)**

```java
@Service
public class S3FileStorageService {
    
    @Autowired
    private AmazonS3 s3Client;
    
    @Value("${aws.s3.bucket}")
    private String bucketName;
    
    public String storeFile(MultipartFile file, String subFolder, Long userId) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String key = subFolder + "/user-" + userId + "-" + System.currentTimeMillis() + extension;
        
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());
        
        s3Client.putObject(bucketName, key, file.getInputStream(), metadata);
        
        return s3Client.getUrl(bucketName, key).toString();
    }
}
```

### **Step 3: User Service Update**

```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Transactional
    public UserDto updateUserAvatar(Long userId, String newImageUrl) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Delete old avatar if exists
        if (user.getImage() != null && !user.getImage().isEmpty()) {
            fileStorageService.deleteFile(user.getImage());
        }
        
        // Update with new image URL
        user.setImage(newImageUrl);
        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        
        return mapToDto(savedUser);
    }
    
    private UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        dto.setUserId(user.getUserId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        dto.setImage(user.getImage()); // Important: map to 'image' field
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
```

### **Step 4: Static File Serving (if using local storage)**

#### **application.properties**

```properties
# File upload settings
file.upload-dir=/var/www/uploads
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
app.base-url=http://localhost:8080

# Serve static files
spring.web.resources.static-locations=file:/var/www/uploads/
```

#### **WebMvcConfig.java**

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    @Value("${file.upload-dir}")
    private String uploadDir;
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
```

---

## 🧪 Testing Guide

### **Test Cases**

| Test Case | Expected Result |
|-----------|----------------|
| Upload valid PNG (< 5MB) | Success, image URL returned |
| Upload valid JPG (< 5MB) | Success, image URL returned |
| Upload file > 5MB | Error 400: File size exceeds limit |
| Upload PDF file | Error 400: Invalid file type |
| Upload without authentication | Error 401: Unauthorized |
| Upload for different user | Error 403: Forbidden |
| Upload with invalid token | Error 401: Unauthorized |
| Upload to non-existent user | Error 404: User not found |

### **Manual Testing with Postman**

1. **Create POST Request**
   - Method: POST
   - URL: `http://localhost:8080/api/users/123/avatar`
   - Headers:
     - `Authorization: Bearer {your_jwt_token}`
   
2. **Add Body**
   - Select "form-data"
   - Add key: `image`, Type: File
   - Select an image file (PNG/JPG)

3. **Send Request**
   - Expected: 200 OK with updated user data
   - Check `data.image` field contains URL

4. **Verify**
   - Open the URL in browser
   - Image should be displayed
   - Check database: `SELECT image FROM users WHERE user_id = 123;`

---

## 🔐 Security Considerations

### **1. File Type Validation**
- ✅ Check MIME type: `image/png`, `image/jpeg`, `image/gif`
- ✅ Verify file extension matches MIME type
- ❌ Don't rely on extension only (can be spoofed)
- ✅ Consider using image validation libraries (e.g., Apache Commons Imaging)

### **2. File Size Validation**
- ✅ Enforce 5MB limit
- ✅ Reject empty files
- ✅ Handle out-of-disk-space errors gracefully

### **3. Authorization**
- ✅ Verify JWT token
- ✅ Check user can only upload their own avatar
- ✅ Return 403 if userId mismatch

### **4. Filename Sanitization**
- ✅ Generate unique filenames (avoid collisions)
- ✅ Don't use user-provided filenames directly
- ✅ Pattern: `user-{userId}-{timestamp}.{ext}`

### **5. Path Traversal Prevention**
- ✅ Don't allow `../` in filenames
- ✅ Save to specific directory only
- ✅ Validate resolved path is within upload directory

### **6. Image Processing (Recommended)**
- ✅ Resize large images (e.g., max 512x512 for avatars)
- ✅ Strip EXIF data (privacy)
- ✅ Re-encode images (remove potential exploits)
- ✅ Use libraries: ImageMagick, Thumbnailator, etc.

---

## 📊 Frontend Integration Status

### **Completed**

✅ **UI Components**
- Avatar display with circular border
- Camera icon button for upload
- Loading spinner during upload
- Placeholder for users without avatar

✅ **Logic**
- File selection via input
- File type validation (image/*)
- File size validation (max 5MB)
- API call to upload endpoint
- Success/error notifications (Popup system)
- State management (uploadingAvatar flag)
- Auto-update UI after successful upload

✅ **Services**
- `uploadAvatar(userId, imageFile)` in profileService.ts
- FormData construction
- Fetch API call with multipart/form-data

✅ **Types**
- `UserDto.image` field added
- Proper TypeScript typing

### **User Flow**

1. User clicks camera icon on avatar
2. File picker opens (filtered to images only)
3. User selects image file
4. Frontend validates:
   - File type must be image/*
   - File size must be ≤ 5MB
5. If invalid: Show error popup, stop
6. If valid:
   - Show loading spinner in avatar
   - Call `POST /api/users/{id}/avatar` with FormData
   - Wait for response
7. On success:
   - Update avatar URL in state
   - Show success popup: "Cập nhật ảnh đại diện thành công!"
   - Remove loading spinner
8. On error:
   - Show error popup with message
   - Remove loading spinner

---

## 🔄 Integration Checklist for Backend

### **Phase 1: Setup (Day 1)**

- [ ] Create file storage directory (if local storage)
- [ ] Configure `application.properties` (upload-dir, max-file-size)
- [ ] Setup AWS S3 (if using cloud storage)
- [ ] Add file storage dependencies

### **Phase 2: Implementation (Day 2-3)**

- [ ] Create `FileStorageService` class
- [ ] Implement `uploadAvatar` endpoint in controller
- [ ] Add file validation (type, size)
- [ ] Add authorization check (JWT, user ownership)
- [ ] Update `UserService.updateUserAvatar()` method
- [ ] Configure static file serving (if local)

### **Phase 3: Testing (Day 4)**

- [ ] Unit tests for file validation
- [ ] Integration tests for upload endpoint
- [ ] Test with Postman (all test cases)
- [ ] Test authorization scenarios
- [ ] Test error handling

### **Phase 4: Integration Testing (Day 5)**

- [ ] Test with Frontend (dev environment)
- [ ] Verify CORS settings
- [ ] Check image URLs are accessible
- [ ] Verify old avatars are deleted
- [ ] Performance testing (concurrent uploads)

### **Phase 5: Deployment**

- [ ] Configure production storage (S3/CDN)
- [ ] Setup image CDN (optional, for performance)
- [ ] Configure backup for uploaded files
- [ ] Monitor disk usage
- [ ] Setup logging for upload errors

---

## 📞 Contact & Support

### **Frontend Team**
- **Implementation Status:** ✅ Completed
- **Files Modified:**
  - `src/services/profileService.ts`
  - `src/components/profile/Profile.tsx`
  - `src/components/profile/ProfileView.tsx`
  - `src/components/profile/Profile.css`
  - `src/components/profile/Profile.types.ts`

### **Backend Team**
- **Required Tasks:**
  - Implement `POST /api/users/{id}/avatar` endpoint
  - Update existing `UserDto` to include `image` field in response
  - Ensure `GET /api/users/{id}` returns `image` field
  - Ensure `PUT /api/users/{id}/profile` preserves `image` field

### **Questions?**
- Check existing API documentation
- Test with Postman collection (TBD)
- Contact Frontend team for integration issues

---

## 📝 Notes

1. **Field Name:** Database uses `image`, not `avatar`. Frontend handles mapping.

2. **Backward Compatibility:** Endpoint should work even if `image` is null in database (for existing users without avatars).

3. **Old Avatar Cleanup:** Consider deleting old avatar file when user uploads new one (to save storage).

4. **Image Optimization:** Recommend resizing uploaded images to reasonable dimensions (e.g., 512x512) to save bandwidth and storage.

5. **CDN Integration:** For production, consider serving images via CDN for better performance.

6. **Rate Limiting:** Consider adding rate limit to prevent abuse (e.g., max 10 uploads per hour per user).

---

**Document Version:** 1.0  
**Last Updated:** March 22, 2026  
**Status:** Ready for Backend Implementation
