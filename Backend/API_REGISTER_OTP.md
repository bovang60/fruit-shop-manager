# API Đăng ký với OTP Verification

## 🔄 Luồng đăng ký mới (OTP Flow)

### Flow tổng quan:
1. **User điền form đăng ký** → Backend tạo OTP và gửi email
2. **User nhận OTP qua email** (mã 6 số, hết hạn sau 5 phút)
3. **User nhập OTP** → Backend verify và tạo tài khoản

---

## 📌 API Endpoints

### 1. Request Register (Gửi OTP)

**Endpoint:** `POST /api/users/request-register`

**Request Body:**
```json
{
  "fullName": "Nguyen Van A",
  "email": "nguyenvana@gmail.com",
  "password": "password123",
  "phoneNumber": "0987654321"
}
```

**Response (Success - resultCd = 0):**
```json
{
  "resultCd": 0,
  "message": "OTP code has been sent to your email. Please verify within 5 minutes.",
  "data": null
}
```

**Response (Error - Email exists):**
```json
{
  "resultCd": 1,
  "message": "Email already exists",
  "data": null
}
```

**Backend xử lý:**
1. ✅ Kiểm tra email đã tồn tại trong `users` table chưa
2. ✅ Tạo mã OTP 6 số ngẫu nhiên (ví dụ: `123456`)
3. ✅ Lưu thông tin tạm vào bảng `pending_registrations`:
   - fullName, email, password, phoneNumber
   - otpCode (6 số)
   - expiryTime (now + 5 phút)
   - isVerified = false
4. ✅ Gửi email chứa OTP đến user
5. ✅ Trả về response thành công

**Email nhận được:**
```
Subject: Mã xác nhận đăng ký tài khoản - Fruit Shop

Xin chào Nguyen Van A,

Cảm ơn bạn đã đăng ký tài khoản tại Fruit Shop!

Mã xác nhận của bạn là:

123456

Vui lòng nhập mã này để hoàn tất đăng ký.
Mã này sẽ hết hạn sau 5 phút.

Trân trọng,
Fruit Shop Team
```

---

### 2. Verify OTP (Hoàn tất đăng ký)

**Endpoint:** `POST /api/users/verify-otp`

**Request Body:**
```json
{
  "email": "nguyenvana@gmail.com",
  "otpCode": "123456"
}
```

**Response (Success - resultCd = 0):**
```json
{
  "resultCd": 0,
  "message": "Registration completed successfully!",
  "data": {
    "userId": 5,
    "fullName": "Nguyen Van A",
    "email": "nguyenvana@gmail.com",
    "phoneNumber": "0987654321",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "emailVerified": true,
    "createdAt": "2026-02-22T10:30:00"
  }
}
```

**Response (Error - Invalid OTP):**
```json
{
  "resultCd": 1,
  "message": "Invalid OTP code",
  "data": null
}
```

**Response (Error - OTP Expired):**
```json
{
  "resultCd": 1,
  "message": "OTP code has expired. Please request a new one.",
  "data": null
}
```

**Response (Error - No pending registration):**
```json
{
  "resultCd": 1,
  "message": "No pending registration found for this email",
  "data": null
}
```

**Backend xử lý:**
1. ✅ Tìm pending registration theo email (chưa verify)
2. ✅ Kiểm tra OTP chưa hết hạn (< 5 phút)
3. ✅ So sánh OTP code
4. ✅ Nếu đúng:
   - Tạo User mới với status = ACTIVE, emailVerified = true
   - Lưu vào `users` table
   - Xóa record trong `pending_registrations`
5. ✅ Trả về thông tin user đã tạo

---

## 🗄️ Database Schema

### Bảng `pending_registrations` (Mới)
```sql
CREATE TABLE pending_registrations (
    pending_id INT PRIMARY KEY IDENTITY(1,1),
    full_name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    otp_code VARCHAR(6) NOT NULL,
    created_at DATETIME NOT NULL,
    expiry_time DATETIME NOT NULL,
    is_verified BIT DEFAULT 0
);
```

### Bảng `users` (Cập nhật)
- User chỉ được tạo sau khi verify OTP thành công
- `status = ACTIVE` ngay từ đầu (vì đã verify OTP)
- `emailVerified = true`

---

## 📊 Sơ đồ luồng (Sequence Diagram)

```
Frontend          Backend          Database          Email Service
    |                |                 |                    |
    | POST /request-register           |                    |
    |--------------->|                 |                    |
    |                | Check email     |                    |
    |                |---------------->|                    |
    |                | Email not exist |                    |
    |                |<----------------|                    |
    |                | Generate OTP    |                    |
    |                | (123456)        |                    |
    |                |                 |                    |
    |                | Save pending    |                    |
    |                | registration    |                    |
    |                |---------------->|                    |
    |                |                 |                    |
    |                | Send OTP email  |                    |
    |                |------------------------------>|
    |                |                 |            Send email
    |                |                 |            to user
    |   200 OK       |                 |                    |
    |   resultCd=0   |                 |                    |
    |<---------------|                 |                    |
    |                |                 |                    |
    | User nhận email & nhập OTP       |                    |
    |                |                 |                    |
    | POST /verify-otp                 |                    |
    | { email, otpCode }               |                    |
    |--------------->|                 |                    |
    |                | Find pending    |                    |
    |                |---------------->|                    |
    |                | Check OTP valid |                    |
    |                | & not expired   |                    |
    |                |                 |                    |
    |                | Create User     |                    |
    |                | (ACTIVE)        |                    |
    |                |---------------->|                    |
    |                |                 |                    |
    |                | Delete pending  |                    |
    |                |---------------->|                    |
    |                |                 |                    |
    |   200 OK       |                 |                    |
    |   resultCd=0   |                 |                    |
    |   User data    |                 |                    |
    |<---------------|                 |                    |
```

---

## ⚙️ Validation Rules

### RegisterDto
- `fullName`: Required, không được rỗng
- `email`: Required, phải đúng format email
- `password`: Required, tối thiểu 6 ký tự
- `phoneNumber`: Optional, nếu có phải đúng format số điện thoại VN

### VerifyOtpDto
- `email`: Required, phải đúng format email
- `otpCode`: Required, phải đúng 6 chữ số

---

## 🔐 Security Features

1. **OTP có thời hạn**: 5 phút (có thể config)
2. **OTP chỉ dùng 1 lần**: Sau khi verify thành công, pending registration bị xóa
3. **Giới hạn số lần thử**: (TODO) Nên implement rate limiting
4. **Email verification**: Chỉ gửi OTP đến email hợp lệ
5. **Password hashing**: TODO - Nên hash password trước khi lưu

---

## 🎨 Frontend Implementation

### Page 1: Register Form
```javascript
// Submit form đăng ký
async function requestRegister() {
  const response = await fetch('http://localhost:8080/api/users/request-register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: "Nguyen Van A",
      email: "nguyenvana@gmail.com",
      password: "password123",
      phoneNumber: "0987654321"
    })
  });
  
  const result = await response.json();
  
  if (result.resultCd === 0) {
    // Hiển thị form nhập OTP
    showOtpForm();
    // Bắt đầu đếm ngược 5 phút
    startCountdown(300); // 300 seconds
  } else {
    // Hiển thị lỗi (email đã tồn tại, v.v.)
    showError(result.message);
  }
}
```

### Page 2: OTP Verification Form
```javascript
// Submit OTP
async function verifyOtp() {
  const response = await fetch('http://localhost:8080/api/users/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: "nguyenvana@gmail.com",
      otpCode: "123456"
    })
  });
  
  const result = await response.json();
  
  if (result.resultCd === 0) {
    // Đăng ký thành công
    showSuccess("Đăng ký thành công!");
    // Chuyển đến trang login hoặc auto login
    redirectToLogin();
  } else {
    // OTP sai hoặc hết hạn
    showError(result.message);
  }
}
```

### UI Flow
```
┌──────────────────────┐
│  Register Form       │
│  - Full Name         │
│  - Email             │
│  - Password          │
│  - Phone (optional)  │
│  [Submit]            │
└──────┬───────────────┘
       │ Click Submit
       ▼
┌──────────────────────┐
│  Loading...          │
│  Sending OTP...      │
└──────┬───────────────┘
       │ Success
       ▼
┌──────────────────────┐
│  OTP Verification    │
│  Email: nguyen...    │
│  [_][_][_][_][_][_]  │ ← 6 input boxes
│  Time left: 4:32     │
│  [Verify]            │
│  [Resend OTP]        │
└──────┬───────────────┘
       │ Verify success
       ▼
┌──────────────────────┐
│  Success!            │
│  Redirecting...      │
└──────────────────────┘
```

---

## 🧪 Testing với Postman

### Step 1: Request Register
```
POST http://localhost:8080/api/users/request-register
Content-Type: application/json

{
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "123456",
  "phoneNumber": "0987654321"
}
```

### Step 2: Kiểm tra email
- Mở email inbox
- Copy mã OTP 6 số

### Step 3: Verify OTP
```
POST http://localhost:8080/api/users/verify-otp
Content-Type: application/json

{
  "email": "test@example.com",
  "otpCode": "123456"
}
```

---

## ⚠️ Edge Cases cần xử lý

1. **User request OTP nhiều lần**: 
   - Pending registration cũ bị xóa
   - Tạo OTP mới

2. **OTP hết hạn**:
   - User phải request lại từ đầu
   - Có thể implement "Resend OTP" button

3. **Database có pending registrations cũ**:
   - Implement job cleanup pending records hết hạn
   - Chạy hàng ngày hoặc định kỳ

4. **Email gửi thất bại**:
   - Trả về lỗi cho user
   - Log để admin theo dõi

---

## 🔧 Configuration

### application.properties
```properties
# Email config (bắt buộc)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

# OTP config (có thể customize)
app.otp.expiry-minutes=5
app.otp.length=6
```

---

## 🚀 Production Checklist

- [ ] Configure email SMTP (Gmail App Password hoặc SendGrid)
- [ ] Implement rate limiting (giới hạn request OTP)
- [ ] Add CAPTCHA trước khi gửi OTP
- [ ] Hash password trước khi lưu
- [ ] Scheduled job cleanup expired pending registrations
- [ ] Monitoring email delivery rate
- [ ] Add "Resend OTP" feature
- [ ] Log tất cả registration attempts
