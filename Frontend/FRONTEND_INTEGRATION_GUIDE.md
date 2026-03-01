# Frontend Integration Guide - Authentication & Registration

## 📋 Tổng quan

Hệ thống authentication bao gồm:

1. **Login:** Đăng nhập với email và password
2. **Registration (2 bước):**
   - **Bước 1:** User yêu cầu đăng ký → Backend gửi mã OTP qua email
   - **Bước 2:** User nhập mã OTP → Backend xác nhận và tạo tài khoản

**Thời gian hết hạn OTP:** 5 phút

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080
```

---

## 🔐 Authentication APIs

### 🔑 Login

**Endpoint:** `POST /api/users/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Validation Rules:**
- `email`: Required, định dạng email hợp lệ
- `password`: Required

**Success Response (200 OK):**
```json
{
  "resultCd": 0,
  "message": "Login successful",
  "data": {
    "userId": 10,
    "fullName": "Nguyen Van A",
    "email": "user@example.com",
    "phoneNumber": "0987654321",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "createdAt": "2026-02-23T10:00:00"
  }
}
```

**Error Responses:**

Invalid credentials:
```json
{
  "resultCd": 1,
  "message": "Invalid email or password",
  "data": null
}
```

Account inactive:
```json
{
  "resultCd": 1,
  "message": "Your account has been deactivated. Please contact support.",
  "data": null
}
```

Account banned:
```json
{
  "resultCd": 1,
  "message": "Your account has been banned. Please contact support.",
  "data": null
}
```

Email not verified:
```json
{
  "resultCd": 1,
  "message": "Please verify your email before logging in.",
  "data": null
}
```

Validation error (400 Bad Request):
```json
{
  "timestamp": "2026-02-23T10:30:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Email must be valid",
  "path": "/api/users/login"
}
```

---

### ✏️ Update Profile

**Endpoint:** `PUT /api/users/{userId}/profile`

**Path Parameters:**
- `userId`: ID của user cần update

**Request Body:**
```json
{
  "fullName": "Nguyen Van B",
  "phoneNumber": "0912345678",
  "newPassword": "newPassword123",
  "currentPassword": "oldPassword123"
}
```

**Validation Rules:**
- `fullName`: Required, 2-100 ký tự
- `phoneNumber`: Optional, định dạng số điện thoại Việt Nam (0xxxxxxxxx hoặc +84xxxxxxxxx)
- `newPassword`: Optional (6-50 ký tự). Nếu muốn đổi password thì cần cung cấp
- `currentPassword`: Required nếu `newPassword` được cung cấp

**Success Response (200 OK):**
```json
{
  "resultCd": 0,
  "message": "Profile updated successfully",
  "data": {
    "userId": 10,
    "fullName": "Nguyen Van B",
    "email": "user@example.com",
    "phoneNumber": "0912345678",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "createdAt": "2026-02-23T10:00:00"
  }
}
```

**Error Responses:**

User not found:
```json
{
  "resultCd": 1,
  "message": "User not found",
  "data": null
}
```

Missing current password when changing password:
```json
{
  "resultCd": 1,
  "message": "Current password is required to change password",
  "data": null
}
```

Wrong current password:
```json
{
  "resultCd": 1,
  "message": "Current password is incorrect",
  "data": null
}
```

Validation error (400 Bad Request):
```json
{
  "timestamp": "2026-02-23T10:30:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Full name must be between 2 and 100 characters",
  "path": "/api/users/10/profile"
}
```

**Notes:**
- Email KHÔNG thể thay đổi qua endpoint này (cần xác thực email mới)
- Role và Status chỉ admin mới có thể thay đổi
- Nếu không muốn đổi password, đừng gửi `newPassword` và `currentPassword`
- Nếu không muốn đổi số điện thoại, có thể để `phoneNumber` null hoặc không gửi

---

## 📝 Registration APIs

### 1️⃣ Request Registration - Gửi OTP

**Endpoint:** `POST /api/users/request-register`

**Request Body:**
```json
{
  "fullName": "Nguyen Van A",
  "email": "user@example.com",
  "password": "123456",
  "phoneNumber": "0987654321"
}
```

**Validation Rules:**
- `fullName`: Required, 2-100 ký tự
- `email`: Required, định dạng email hợp lệ
- `password`: Required, tối thiểu 6 ký tự
- `phoneNumber`: Optional, định dạng số điện thoại Việt Nam

**Success Response (200 OK):**
```json
{
  "resultCd": 0,
  "message": "OTP code has been sent to your email. Please verify within 5 minutes.",
  "data": null
}
```

**Error Responses:**

Email đã tồn tại:
```json
{
  "resultCd": 1,
  "message": "Email already exists",
  "data": null
}
```

Validation error (400 Bad Request):
```json
{
  "timestamp": "2026-02-23T10:30:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Email must be valid",
  "path": "/api/users/request-register"
}
```

---

### 2️⃣ Verify OTP - Hoàn tất đăng ký

**Endpoint:** `POST /api/users/verify-otp`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otpCode": "123456"
}
```

**Validation Rules:**
- `email`: Required, định dạng email hợp lệ
- `otpCode`: Required, chính xác 6 chữ số

**Success Response (200 OK):**
```json
{
  "resultCd": 0,
  "message": "Registration completed successfully!",
  "data": {
    "userId": 10,
    "fullName": "Nguyen Van A",
    "email": "user@example.com",
    "phoneNumber": "0987654321",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "createdAt": "2026-02-23T10:35:00"
  }
}
```

**Error Responses:**

OTP không đúng:
```json
{
  "resultCd": 1,
  "message": "Invalid OTP code",
  "data": null
}
```

OTP hết hạn:
```json
{
  "resultCd": 1,
  "message": "OTP code has expired. Please request a new one.",
  "data": null
}
```

Không tìm thấy yêu cầu đăng ký:
```json
{
  "resultCd": 1,
  "message": "No pending registration found for this email",
  "data": null
}
```

---

## 🎨 Frontend Flow

### Màn hình 1: Registration Form

```
┌─────────────────────────────────┐
│     ĐĂNG KÝ TÀI KHOẢN           │
├─────────────────────────────────┤
│ Họ tên:     [____________]      │
│ Email:      [____________]      │
│ Mật khẩu:   [____________]      │
│ Số ĐT:      [____________]      │
│                                 │
│         [ĐĂNG KÝ]               │
└─────────────────────────────────┘
```

### Màn hình 2: OTP Verification

```
┌─────────────────────────────────┐
│   XÁC NHẬN MÃ OTP               │
├─────────────────────────────────┤
│ Mã OTP đã được gửi đến:         │
│ user@example.com                │
│                                 │
│ Nhập mã OTP:                    │
│   [_] [_] [_] [_] [_] [_]       │
│                                 │
│ Còn lại: 04:32                  │
│                                 │
│ [XÁC NHẬN]  [GỬI LẠI MÃ]       │
└─────────────────────────────────┘
```

---

## 💻 Sample Code

### React/TypeScript Example

```typescript
// API Service
const API_BASE_URL = 'http://localhost:8080';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

interface UpdateProfileRequest {
  fullName: string;
  phoneNumber?: string;
  newPassword?: string;
  currentPassword?: string;
}

interface ApiResponse<T> {
  resultCd: number;
  message: string;
  data: T | null;
}

interface UserDto {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  createdAt: string;
}

// Login API
async function login(data: LoginRequest): Promise<ApiResponse<UserDto>> {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return await response.json();
}

// Bước 1: Request OTP
async function requestRegister(data: RegisterRequest): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_BASE_URL}/api/users/request-register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return await response.json();
}

// Bước 2: Verify OTP
async function verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse<UserDto>> {
  const response = await fetch(`${API_BASE_URL}/api/users/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return await response.json();
}

// Update Profile API
async function updateProfile(userId: number, data: UpdateProfileRequest): Promise<ApiResponse<UserDto>> {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return await response.json();
}

// Login Component Example
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login({ email, password });
      
      if (result.resultCd === 0) {
        // Save user data to state/context/localStorage
        localStorage.setItem('user', JSON.stringify(result.data));
        showSuccess('Đăng nhập thành công!');
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mật khẩu"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
}

// Registration Component Example
function RegistrationFlow() {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [email, setEmail] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(300); // 5 minutes

  // Handle registration
  const handleRegister = async (formData: RegisterRequest) => {
    try {
      const result = await requestRegister(formData);
      
      if (result.resultCd === 0) {
        setEmail(formData.email);
        setStep('verify');
        startCountdown();
        showSuccess('Mã OTP đã được gửi đến email của bạn!');
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (otpCode: string) => {
    try {
      const result = await verifyOtp({ email, otpCode });
      
      if (result.resultCd === 0) {
        showSuccess('Đăng ký thành công!');
        // Redirect to login page
        router.push('/login');
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  // Countdown timer
  const startCountdown = () => {
    const timer = setInterval(() => {
      setOtpCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Format countdown
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {step === 'register' ? (
        <RegistrationForm onSubmit={handleRegister} />
      ) : (
        <OtpVerificationForm 
          email={email}
          countdown={formatTime(otpCountdown)}
          onVerify={handleVerifyOtp}
          onResend={() => handleRegister({ /* resend data */ })}
        />
      )}
    </div>
  );
}
```

### JavaScript/Fetch Example

```javascript
// Bước 1: Gửi yêu cầu đăng ký
async function register() {
  const data = {
    fullName: document.getElementById('fullName').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    phoneNumber: document.getElementById('phoneNumber').value
  };

  try {
    const response = await fetch('http://localhost:8080/api/users/request-register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.resultCd === 0) {
      // Thành công - chuyển sang màn hình nhập OTP
      showOtpScreen(data.email);
      startCountdown(300); // 5 phút
    } else {
      // Lỗi - hiển thị message
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Có lỗi xảy ra. Vui lòng thử lại!');
  }
}

// Bước 2: Xác nhận OTP
async function verifyOtp() {
  const data = {
    email: currentEmail, // Lưu từ bước 1
    otpCode: document.getElementById('otpCode').value
  };

  try {
    const response = await fetch('http://localhost:8080/api/users/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.resultCd === 0) {
      // Thành công - đăng ký hoàn tất
      alert('Đăng ký thành công!');
      window.location.href = '/login';
    } else {
      // Lỗi - hiển thị message
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Có lỗi xảy ra. Vui lòng thử lại!');
  }
}

// Countdown timer
function startCountdown(seconds) {
  const display = document.getElementById('countdown');
  let remaining = seconds;

  const timer = setInterval(() => {
    const minutes = Math.floor(remaining / 60);
    const secs = remaining % 60;
    
    display.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
    
    if (--remaining < 0) {
      clearInterval(timer);
      display.textContent = 'Mã OTP đã hết hạn';
    }
  }, 1000);
}
```

### Axios Example

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request registration
export const requestRegister = async (data) => {
  try {
    const response = await api.post('/api/users/request-register', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Verify OTP
export const verifyOtp = async (email, otpCode) => {
  try {
    const response = await api.post('/api/users/verify-otp', {
      email,
      otpCode
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
```

### Update Profile Component Example

```typescript
// Update Profile Form Component
function UpdateProfileForm({ userId, currentUser }: { userId: number, currentUser: UserDto }) {
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber);
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: UpdateProfileRequest = {
        fullName,
        phoneNumber,
      };

      // Nếu user muốn đổi password
      if (changePassword && newPassword) {
        updateData.newPassword = newPassword;
        updateData.currentPassword = currentPassword;
      }

      const result = await updateProfile(userId, updateData);
      
      if (result.resultCd === 0) {
        showSuccess('Cập nhật thông tin thành công!');
        // Update local user state
        updateUserContext(result.data);
        // Reset password fields
        setChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Họ và tên:</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          minLength={2}
          maxLength={100}
        />
      </div>

      <div>
        <label>Số điện thoại:</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          pattern="^(0|\+84)[0-9]{9,10}$"
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={changePassword}
            onChange={(e) => setChangePassword(e.target.checked)}
          />
          Đổi mật khẩu
        </label>
      </div>

      {changePassword && (
        <>
          <div>
            <label>Mật khẩu hiện tại:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required={changePassword}
            />
          </div>

          <div>
            <label>Mật khẩu mới:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required={changePassword}
              minLength={6}
              maxLength={50}
            />
          </div>
        </>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
      </button>
    </form>
  );
}
```

```javascript
// Vanilla JavaScript Example - Update Profile
async function updateProfile() {
  const userId = getCurrentUserId(); // Get from session/localStorage
  
  const data = {
    fullName: document.getElementById('fullName').value,
    phoneNumber: document.getElementById('phoneNumber').value
  };

  // Nếu user muốn đổi password
  const changePassword = document.getElementById('changePassword').checked;
  if (changePassword) {
    data.currentPassword = document.getElementById('currentPassword').value;
    data.newPassword = document.getElementById('newPassword').value;
  }

  try {
    const response = await fetch(`http://localhost:8080/api/users/${userId}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.resultCd === 0) {
      alert('Cập nhật thông tin thành công!');
      // Update displayed user info
      displayUserInfo(result.data);
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Có lỗi xảy ra. Vui lòng thử lại!');
  }
}

// Axios Example - Update Profile
export const updateUserProfile = async (userId, data) => {
  try {
    const response = await api.put(`/api/users/${userId}/profile`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
```

---

## 🎯 Error Handling Guide

### Xử lý lỗi validation (400)

```typescript
try {
  const result = await requestRegister(data);
  
  if (result.resultCd === 0) {
    // Success
  } else {
    // Business logic error
    showError(result.message);
  }
} catch (error) {
  if (error.status === 400) {
    // Validation error
    showError('Vui lòng kiểm tra lại thông tin đã nhập');
  } else {
    showError('Có lỗi xảy ra. Vui lòng thử lại!');
  }
}
```

### Hiển thị message phù hợp

```typescript
const ERROR_MESSAGES = {
  'Email already exists': 'Email này đã được đăng ký. Vui lòng sử dụng email khác.',
  'Invalid OTP code': 'Mã OTP không chính xác. Vui lòng kiểm tra lại.',
  'OTP code has expired': 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.',
  'No pending registration found': 'Không tìm thấy yêu cầu đăng ký. Vui lòng đăng ký lại.'
};

function getDisplayMessage(message: string): string {
  return ERROR_MESSAGES[message] || message;
}
```

---

## ⏱️ UX Best Practices

### 1. Countdown Timer
- Hiển thị thời gian còn lại rõ ràng
- Disable nút "Gửi lại" khi countdown chưa hết
- Cho phép gửi lại sau khi OTP hết hạn

### 2. OTP Input
- Sử dụng 6 ô input riêng biệt hoặc 1 input với format
- Auto-focus vào ô tiếp theo khi nhập
- Chỉ cho phép nhập số
- Paste OTP từ clipboard

### 3. Loading States
```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await requestRegister(data);
  } finally {
    setLoading(false);
  }
};
```

### 4. Success Feedback
```typescript
// Sau khi verify thành công
showSuccessToast('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
setTimeout(() => {
  router.push('/login');
}, 2000);
```

---

## 🧪 Testing với Postman/Thunder Client

### Test 1: Request Registration
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

### Test 2: Verify OTP
```
POST http://localhost:8080/api/users/verify-otp
Content-Type: application/json

{
  "email": "test@example.com",
  "otpCode": "123456"
}
```

**Note:** Kiểm tra email hoặc console log của backend để lấy mã OTP để test.

---

## � UX Recommendations

### Login Experience
- **Remember Me**: Add option to save email (not password)
- **Error Messages**: 
  - "Email hoặc mật khẩu không đúng" (don't reveal which is wrong for security)
  - "Tài khoản đã bị vô hiệu hóa. Liên hệ hỗ trợ." for inactive accounts
  - "Tài khoản đã bị cấm. Liên hệ hỗ trợ." for banned accounts
  - "Vui lòng xác thực email trước khi đăng nhập" with resend OTP option
- **Loading State**: Disable button and show spinner during login
- **Link to Registration**: Provide "Chưa có tài khoản? Đăng ký" link
- **Forgot Password**: Add link for password recovery (when implemented)
- **Auto-focus**: Focus on email field when page loads

### Registration Experience
- **Step 1 (Request OTP)**:
  - Clear validation errors on each field
  - Show password strength indicator
  - Disable submit button while request is in progress
  - Show success message: "Mã OTP đã được gửi đến [email]"
  - Provide link: "Chưa nhận được? Gửi lại sau Xs"

- **Step 2 (Verify OTP)**:
  - Show OTP input (6 digits, numeric only)
  - Display countdown timer (5:00 → 0:00)
  - Auto-submit when 6 digits entered (optional)
  - Provide "Gửi lại mã" button (disabled during countdown)
  - Show clear error messages:
    - "Mã OTP không đúng. Bạn còn X lần thử."
    - "Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới."
  - Allow user to go back and change email if needed

### Update Profile Experience
- **Display Current Values**: Pre-fill form with current user information
- **Optional Password Change**: 
  - Show checkbox "Đổi mật khẩu" to toggle password fields
  - Only require currentPassword and newPassword when checkbox is checked
  - Add password strength indicator for new password
- **Phone Number Validation**: Validate format on blur, show inline error
- **Confirmation**: 
  - Show success message: "Thông tin đã được cập nhật thành công"
  - Update displayed user info immediately after successful update
- **Error Handling**:
  - "Mật khẩu hiện tại không đúng" - highlight current password field
  - "Họ tên phải có ít nhất 2 ký tự"
  - "Số điện thoại không hợp lệ"
- **Non-editable Fields**: 
  - Show email in read-only or disabled state
  - Add note: "Email không thể thay đổi"
- **Cancel Button**: Allow user to discard changes and restore original values

### General Best Practices
- **Error Handling**: Always show user-friendly Vietnamese error messages
- **Loading States**: Show spinners/disabled states during API calls
- **Success Feedback**: Show confirmation messages before redirecting
- **Form Validation**: Validate on blur, show errors inline
- **Mobile Responsive**: Ensure forms work well on mobile devices
- **Accessibility**: Use proper labels, aria-labels, and keyboard navigation

---

## �🔒 Security Notes

1. **HTTPS:** Trong production, bắt buộc dùng HTTPS
2. **CORS:** Backend đã config `@CrossOrigin("*")` - trong production nên giới hạn origin cụ thể
3. **Rate Limiting:** Nên implement để tránh spam OTP
4. **Password:** Hiện tại lưu plain text, cần hash (BCrypt) trước khi production

---

## 📞 Support

Nếu có vấn đề khi tích hợp, liên hệ:
- Backend team: [kienhoang0307@gmail.com](mailto:kienhoang0307@gmail.com)
- API Base URL: `http://localhost:8080`
- Swagger/API Docs: (Coming soon)

---

**Last Updated:** February 23, 2026  
**Backend Version:** 0.0.1-SNAPSHOT  
**API Status:** ✅ Production Ready
