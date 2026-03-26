# Tóm tắt API Upload Avatar - Hướng dẫn Backend

## 🎯 Yêu cầu Backend

### **Endpoint cần implement**

```
POST /api/users/{id}/avatar
```

---

## 📋 Chi tiết nhanh

| Thông tin | Giá trị |
|-----------|---------|
| **Method** | POST |
| **URL** | `/api/users/{id}/avatar` |
| **Content-Type** | `multipart/form-data` |
| **Field name** | `image` (File) |
| **Validate** | - Kiểu file: PNG, JPG, GIF<br>- Kích thước max: 5MB<br>- User chỉ upload avatar của chính mình |
| **Response** | Trả về `UserDto` với field `image` chứa URL ảnh |

---

## 📤 Request từ Frontend

```javascript
// Frontend gửi FormData
const formData = new FormData();
formData.append("image", file); // file = File object

fetch('/api/users/123/avatar', {
  method: 'POST',
  body: formData
  // Không set Content-Type - browser tự động set với boundary
})
```

---

## 📥 Response mong đợi

### **Success (200 OK)**

```json
{
  "resultCd": 0,
  "message": "Avatar uploaded successfully",
  "data": {
    "userId": 123,
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "phoneNumber": "0912345678",
    "address": "123 Main St",
    "image": "https://domain.com/uploads/avatars/user-123-1234567890.jpg",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "createdAt": "2026-03-01T10:30:00Z"
  }
}
```

### **Error (400/401/403)**

```json
{
  "resultCd": 1,
  "message": "File size exceeds limit. Maximum 5MB allowed.",
  "data": null
}
```

---

## ✅ Validation Rules

### **File Validation**
- ✅ File type: `image/png`, `image/jpeg`, `image/gif`
- ✅ Max size: **5MB**
- ✅ File không được empty

### **Authorization**
- ✅ Kiểm tra JWT token hợp lệ
- ✅ User chỉ được upload avatar của chính mình (userId trong URL = user trong token)

### **User Validation**
- ✅ User với ID phải tồn tại trong database

---

## 💾 Database Update

### **Table: `users`**

Field `image` đã có sẵn, chỉ cần update khi upload thành công.

```sql
UPDATE users 
SET image = ?, updated_at = NOW()
WHERE user_id = ?;
```

---

## ❌ Error Messages (tiếng Việt preferred)

| HTTP Status | resultCd | Message |
|-------------|----------|---------|
| 200 | 0 | "Avatar uploaded successfully" hoặc "Cập nhật ảnh đại diện thành công" |
| 400 | 1 | "No image file provided." / "Vui lòng chọn file ảnh" |
| 400 | 1 | "Invalid file type. Only images (PNG, JPG, GIF) are allowed." |
| 400 | 1 | "File size exceeds limit. Maximum 5MB allowed." |
| 401 | 1 | "Unauthorized. Please login." |
| 403 | 1 | "Forbidden. You can only upload your own avatar." |
| 404 | 1 | "User not found." |
| 500 | 1 | "Failed to upload image. Please try again later." |

---

## 🔧 Implementation Steps

### **1. Setup File Storage**

**Option A: Local Storage**
```properties
# application.properties
file.upload-dir=/var/www/uploads
spring.servlet.multipart.max-file-size=5MB
```

**Option B: Cloud (AWS S3, Google Cloud)**
```properties
aws.s3.bucket=your-bucket-name
```

### **2. Controller Endpoint**

```java
@PostMapping("/{id}/avatar")
public ResponseEntity<ApiResponse<UserDto>> uploadAvatar(
        @PathVariable("id") Long userId,
        @RequestParam("image") MultipartFile imageFile,
        @AuthenticationPrincipal UserDetails currentUser) {
    
    // 1. Check authorization (userId = current user)
    if (!userId.equals(getCurrentUserId(currentUser))) {
        return forbidden();
    }
    
    // 2. Validate file
    if (imageFile.isEmpty() || !isValidImage(imageFile)) {
        return badRequest("Invalid file");
    }
    
    if (imageFile.getSize() > 5 * 1024 * 1024) {
        return badRequest("File too large");
    }
    
    // 3. Save file
    String imageUrl = fileStorageService.storeFile(imageFile, "avatars", userId);
    
    // 4. Update database
    UserDto user = userService.updateUserAvatar(userId, imageUrl);
    
    // 5. Return response
    return ok(new ApiResponse<>(0, "Success", user));
}
```

### **3. File Storage Service**

```java
public String storeFile(MultipartFile file, String folder, Long userId) {
    // Generate unique filename
    String filename = "user-" + userId + "-" + System.currentTimeMillis() + ".jpg";
    
    // Save file
    Path path = Paths.get(uploadDir, folder, filename);
    Files.copy(file.getInputStream(), path);
    
    // Return URL
    return baseUrl + "/uploads/" + folder + "/" + filename;
}
```

### **4. User Service Update**

```java
@Transactional
public UserDto updateUserAvatar(Long userId, String newImageUrl) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    
    // Delete old avatar (optional)
    if (user.getImage() != null) {
        fileStorageService.deleteFile(user.getImage());
    }
    
    // Update image
    user.setImage(newImageUrl);
    userRepository.save(user);
    
    return mapToDto(user);
}
```

---

## 🧪 Testing với Postman

1. **POST** `http://localhost:8080/api/users/123/avatar`
2. **Headers:**
   - `Authorization: Bearer {token}`
3. **Body:** form-data
   - Key: `image`, Type: File
   - Value: chọn file ảnh (PNG/JPG)
4. **Expected:** Status 200, response có `data.image` với URL

---

## 📝 Các điểm quan trọng

### **⚠️ Lưu ý**

1. **Field name là `image`** (không phải `avatar`)
   - Database: `image`
   - Frontend tự map: `image` → `avatar` trong UI

2. **URL phải accessible**
   - Frontend cần fetch ảnh từ URL trả về
   - Configure CORS nếu cần
   - Serve static files từ `/uploads/**`

3. **Clean up old avatar**
   - Khi user upload ảnh mới, nên xóa ảnh cũ (tiết kiệm storage)

4. **Image optimization (khuyến nghị)**
   - Resize về 512x512 hoặc nhỏ hơn
   - Giảm chất lượng để tiết kiệm bandwidth
   - Strip EXIF data (bảo mật)

### **✅ Checklist**

- [ ] Setup file upload directory
- [ ] Configure max file size (5MB)
- [ ] Implement `POST /api/users/{id}/avatar` endpoint
- [ ] Validate file type & size
- [ ] Check authorization (user ownership)
- [ ] Save file to storage (local hoặc S3)
- [ ] Update `users.image` in database
- [ ] Return `UserDto` với field `image`
- [ ] Test với Postman
- [ ] Test integration với Frontend
- [ ] Configure CORS nếu cần
- [ ] Setup static file serving

---

## 📂 Files liên quan

### **Frontend (✅ Đã hoàn thành)**
- `src/services/profileService.ts` - API call
- `src/components/profile/Profile.tsx` - Upload logic
- `src/components/profile/ProfileView.tsx` - UI component
- `src/components/profile/Profile.types.ts` - TypeScript types

### **Backend (❌ Cần implement)**
- Controller: `UserController.uploadAvatar()`
- Service: `FileStorageService.storeFile()`
- Service: `UserService.updateUserAvatar()`
- Config: `application.properties` (file upload settings)
- Config: `WebMvcConfig` (static file serving)

---

## 🔗 Tài liệu đầy đủ

Xem file [`AVATAR_UPLOAD_API_SPEC.md`](AVATAR_UPLOAD_API_SPEC.md) để có:
- Code examples chi tiết (Java Spring Boot)
- Security considerations
- Error handling đầy đủ
- Testing guide
- Deployment checklist

---

**Cập nhật:** 22/03/2026  
**Trạng thái:** Frontend hoàn thành - Chờ Backend implement
