# Database Migration - OTP Registration

## ⚠️ QUAN TRỌNG: Chạy SQL này trước khi test application!

Bảng `pending_registrations` chưa tồn tại trong database. Cần chạy SQL script sau:

## SQL Script để tạo bảng mới:

```sql
-- 1. Tạo bảng pending_registrations
CREATE TABLE pending_registrations (
    pending_id INT PRIMARY KEY IDENTITY(1,1),
    full_name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    otp_code VARCHAR(6) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    expiry_time DATETIME NOT NULL,
    is_verified BIT DEFAULT 0
);

-- 2. Tạo index cho tìm kiếm nhanh theo email
CREATE INDEX idx_pending_email ON pending_registrations(email);

-- 3. Tạo index cho cleanup expired records
CREATE INDEX idx_pending_expiry ON pending_registrations(expiry_time);

-- 4. Thêm các cột vào bảng users (nếu chưa có)
ALTER TABLE users ADD email_verified BIT DEFAULT 0;
ALTER TABLE users ADD email_verification_token NVARCHAR(255);
ALTER TABLE users ADD token_expiry_date DATETIME;
```

## Cách chạy:

### Option 1: SQL Server Management Studio (SSMS)
1. Mở SSMS
2. Connect đến database: `sql8004.site4now.net`
3. Chọn database: `db_ac5a7f_data`
4. Copy SQL script trên và Execute

### Option 2: Azure Data Studio
1. Mở Azure Data Studio
2. Connect đến database
3. New Query
4. Paste SQL và Run

### Option 3: Portal site4now.net
1. Login vào https://site4now.net
2. Vào Database Management
3. Query Editor
4. Paste SQL và Execute

## Kiểm tra sau khi chạy:

```sql
-- Kiểm tra bảng đã được tạo
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'pending_registrations';

-- Kiểm tra structure
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'pending_registrations';

-- Kiểm tra users table đã có cột mới
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' 
AND COLUMN_NAME IN ('email_verified', 'email_verification_token', 'token_expiry_date');
```

## Sau khi chạy xong:

1. Stop application hiện tại (Ctrl+C trong terminal)
2. Restart lại: `mvn spring-boot:run`
3. Test API
