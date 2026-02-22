# Hướng dẫn cấu hình Email Verification

## 📧 Tính năng Email Verification đã được thêm vào

Khi user đăng ký tài khoản mới, hệ thống sẽ:
1. Tạo token xác nhận (UUID) hết hạn sau 24 giờ
2. Set user status = INACTIVE và emailVerified = false
3. Gửi email chứa link xác nhận đến email của user
4. User click vào link để verify email
5. Sau khi verify thành công, status chuyển sang ACTIVE

## 🔧 Cấu hình Email (Gmail)

### Bước 1: Tạo App Password cho Gmail

1. Đăng nhập vào tài khoản Gmail của bạn
2. Vào **Google Account Settings** → **Security**
3. Bật **2-Step Verification** (bắt buộc)
4. Tìm **App passwords** trong phần Security
5. Chọn **Mail** và **Other (Custom name)**
6. Nhập tên: "Fruit Shop Backend"
7. Click **Generate** và copy mật khẩu 16 ký tự

### Bước 2: Cấu hình trong application.properties

Mở file `src/main/resources/application.properties` và thay đổi:

```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com          # Thay bằng email thực của bạn
spring.mail.password=your-16-digit-app-password   # Thay bằng App Password vừa tạo
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

# Application Email Settings
app.mail.from=noreply@fruitshop.com               # Email hiển thị trong From field
app.base-url=http://localhost:8080                # URL của backend (production: https://yourdomain.com)
```

### Bước 3: Test Email Service

Sau khi cấu hình, chạy application và test API register:

**Request:**
```bash
POST http://localhost:8080/api/users/register
Content-Type: application/json

{
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phoneNumber": "0987654321"
}
```

**Response:**
```json
{
  "resultCd": 0,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "userId": 1,
    "fullName": "Test User",
    "email": "test@example.com",
    "phoneNumber": "0987654321",
    "role": "CUSTOMER",
    "status": "INACTIVE",
    "createdAt": "2026-02-22T10:30:00"
  }
}
```

User sẽ nhận email với link dạng:
```
http://localhost:8080/api/users/verify-email?token=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Bước 4: Verify Email

Khi user click vào link (hoặc gọi API):

**Request:**
```bash
GET http://localhost:8080/api/users/verify-email?token=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Response (Success):**
```json
{
  "resultCd": 0,
  "message": "Email verified successfully. Your account is now active.",
  "data": null
}
```

**Response (Token expired):**
```json
{
  "resultCd": 1,
  "message": "Verification token has expired",
  "data": null
}
```

**Response (Invalid token):**
```json
{
  "resultCd": 1,
  "message": "Invalid verification token",
  "data": null
}
```

**Response (Already verified):**
```json
{
  "resultCd": 1,
  "message": "Email already verified",
  "data": null
}
```

## 🗄️ Database Changes

Đã thêm các cột mới vào bảng `users`:

```sql
ALTER TABLE users
ADD email_verified BIT DEFAULT 0,
    email_verification_token NVARCHAR(255),
    token_expiry_date DATETIME;
```

## 📊 Email Logging

Mọi email được gửi sẽ được log vào bảng `email_logs` với thông tin:
- User nhận email
- Loại email (REGISTRATION_VERIFICATION)
- Subject
- Trạng thái (SENT/FAILED)
- Thời gian gửi

## 🔐 Security Notes

1. **KHÔNG BAO GIỜ** commit App Password vào Git
2. Sử dụng environment variables trong production:
   ```bash
   export MAIL_USERNAME=your-email@gmail.com
   export MAIL_PASSWORD=your-app-password
   ```
3. Token hết hạn sau 24 giờ để bảo mật
4. Token bị xóa sau khi verify thành công

## 🚀 Production Deployment

Khi deploy production, cập nhật:

```properties
app.base-url=https://api.fruitshop.com
app.mail.from=noreply@fruitshop.com
```

Và sử dụng SMTP server chuyên nghiệp như:
- **SendGrid** (free 100 emails/day)
- **Amazon SES** (cheap và reliable)
- **Mailgun** (free 5000 emails/month)

## 🧪 Testing với Mailtrap (Development)

Nếu không muốn dùng Gmail thật, dùng **Mailtrap** để test:

1. Đăng ký tài khoản tại https://mailtrap.io
2. Lấy SMTP credentials
3. Cấu hình:

```properties
spring.mail.host=sandbox.smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=your-mailtrap-username
spring.mail.password=your-mailtrap-password
```

## ❓ Troubleshooting

### Email không gửi được

**Lỗi: Authentication failed**
- Kiểm tra lại username/password
- Đảm bảo đã bật 2-Step Verification và tạo App Password
- Không dùng password thường của Gmail

**Lỗi: Connection timeout**
- Kiểm tra firewall/antivirus
- Thử port 465 với SSL thay vì 587 với TLS:
  ```properties
  spring.mail.port=465
  spring.mail.properties.mail.smtp.ssl.enable=true
  ```

**Email vào Spam**
- Trong production, cần cấu hình SPF, DKIM, DMARC records
- Sử dụng domain email chính thức (không dùng @gmail.com trong production)

## 📝 TODO

- [ ] Implement resend verification email API
- [ ] Add email templates với HTML/CSS đẹp
- [ ] Queue system cho email (RabbitMQ/Redis) để không block request
- [ ] Rate limiting để tránh spam email
