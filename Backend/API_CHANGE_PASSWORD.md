# API Change Password - Frontend Integration Guide

## 📌 Tổng quan

API để user thay đổi mật khẩu khi đã đăng nhập. User cần cung cấp mật khẩu hiện tại để xác thực.

---

## 🔐 Change Password

### **HTTP Method:** PUT

### **URL:** 
```
http://localhost:8080/api/users/{userId}/change-password
```

### **Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | Integer | Yes | ID của user đang login |

### **Request Headers:**
```http
Content-Type: application/json
```

### **Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

### **Request Body Fields:**

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| currentPassword | String | Yes | Not blank | Mật khẩu hiện tại của user |
| newPassword | String | Yes | 6-50 characters | Mật khẩu mới |
| confirmPassword | String | Yes | Not blank | Xác nhận mật khẩu mới (phải giống newPassword) |

---

## 📤 Response Format

### **Success Response (200 OK):**
```json
{
  "resultCd": 0,
  "message": "Password changed successfully",
  "data": null
}
```

### **Error Responses:**

#### 1. Current password incorrect:
```json
{
  "resultCd": 1,
  "message": "Current password is incorrect",
  "data": null
}
```

#### 2. New password and confirm password do not match:
```json
{
  "resultCd": 1,
  "message": "New password and confirm password do not match",
  "data": null
}
```

#### 3. New password same as current password:
```json
{
  "resultCd": 1,
  "message": "New password must be different from current password",
  "data": null
}
```

#### 4. User not found:
```json
{
  "resultCd": 1,
  "message": "User not found",
  "data": null
}
```

#### 5. Validation error (400 Bad Request):
```json
{
  "resultCd": 1,
  "message": "New password must be between 6 and 50 characters",
  "data": null
}
```

---

## 🔄 Flow Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ PUT /api/users/{userId}/change-password
       │ Body: { currentPassword, newPassword, confirmPassword }
       ↓
┌──────────────────────────────────────┐
│  Backend Processing                  │
│  ✓ Check user exists                 │
│  ✓ Verify current password           │
│  ✓ Check new = confirm               │
│  ✓ Check new ≠ current               │
│  ✓ Update password immediately       │
└──────┬───────────────────────────────┘
       │
       ├─── Success
       │    └─> "Password changed successfully"
       │
       └─── Error
            └─> Show error message
```

---

## 💻 Frontend Implementation Examples

### **React Example:**

```jsx
import { useState } from 'react';
import axios from 'axios';

function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem('userId');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.newPassword.length < 6 || formData.newPassword.length > 50) {
      setError('New password must be between 6 and 50 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    if (formData.newPassword === formData.currentPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:8080/api/users/${userId}/change-password`,
        formData
      );

      if (response.data.resultCd === 0) {
        setSuccess(response.data.message);
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password">
      <h2>Change Password</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Password:</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password (6-50 characters)"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
```

---

### **Vue 3 + Composition API:**

```vue
<template>
  <div class="change-password">
    <h2>Change Password</h2>
    
    <div v-if="error" class="alert alert-error">{{ error }}</div>
    <div v-if="success" class="alert alert-success">{{ success }}</div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Current Password:</label>
        <input
          type="password"
          v-model="formData.currentPassword"
          placeholder="Enter current password"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label>New Password:</label>
        <input
          type="password"
          v-model="formData.newPassword"
          placeholder="Enter new password (6-50 characters)"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label>Confirm New Password:</label>
        <input
          type="password"
          v-model="formData.confirmPassword"
          placeholder="Confirm new password"
          :disabled="loading"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Changing...' : 'Change Password' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';

const formData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const error = ref('');
const success = ref('');
const loading = ref(false);

const userId = localStorage.getItem('userId');

const handleSubmit = async () => {
  // Validation
  if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
    error.value = 'All fields are required';
    return;
  }

  if (formData.newPassword.length < 6 || formData.newPassword.length > 50) {
    error.value = 'New password must be between 6 and 50 characters';
    return;
  }

  if (formData.newPassword !== formData.confirmPassword) {
    error.value = 'New password and confirm password do not match';
    return;
  }

  if (formData.newPassword === formData.currentPassword) {
    error.value = 'New password must be different from current password';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const response = await axios.put(
      `http://localhost:8080/api/users/${userId}/change-password`,
      formData
    );

    if (response.data.resultCd === 0) {
      success.value = response.data.message;
      // Clear form
      formData.currentPassword = '';
      formData.newPassword = '';
      formData.confirmPassword = '';
    } else {
      error.value = response.data.message;
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to change password';
  } finally {
    loading.value = false;
  }
};
</script>
```

---

### **JavaScript (Vanilla) + Fetch API:**

```javascript
// changePassword.js

const API_BASE_URL = 'http://localhost:8080/api';

// Lấy userId từ localStorage
const userId = localStorage.getItem('userId');

// Form elements
const form = document.getElementById('changePasswordForm');
const currentPasswordInput = document.getElementById('currentPassword');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const errorDiv = document.getElementById('error');
const successDiv = document.getElementById('success');
const submitBtn = document.getElementById('submitBtn');

// Validation
function validateForm(formData) {
  // Check all fields
  if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
    return { valid: false, message: 'All fields are required' };
  }

  // Check length
  if (formData.newPassword.length < 6 || formData.newPassword.length > 50) {
    return { valid: false, message: 'New password must be between 6 and 50 characters' };
  }

  // Check match
  if (formData.newPassword !== formData.confirmPassword) {
    return { valid: false, message: 'New password and confirm password do not match' };
  }

  // Check different
  if (formData.newPassword === formData.currentPassword) {
    return { valid: false, message: 'New password must be different from current password' };
  }

  return { valid: true };
}

// Show error
function showError(message) {
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  successDiv.style.display = 'none';
}

// Show success
function showSuccess(message) {
  successDiv.textContent = message;
  successDiv.style.display = 'block';
  errorDiv.style.display = 'none';
}

// Handle submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    currentPassword: currentPasswordInput.value,
    newPassword: newPasswordInput.value,
    confirmPassword: confirmPasswordInput.value
  };

  // Validate
  const validation = validateForm(formData);
  if (!validation.valid) {
    showError(validation.message);
    return;
  }

  // Disable button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Changing...';

  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
        // Add Authorization if needed
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.resultCd === 0) {
      showSuccess(data.message);
      // Clear form
      form.reset();
      
      // Optional: Redirect after 2 seconds
      setTimeout(() => {
        // window.location.href = '/profile.html';
      }, 2000);
    } else {
      showError(data.message);
    }
  } catch (error) {
    showError('Network error. Please try again.');
    console.error('Error:', error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Change Password';
  }
});

// Clear error on input
[currentPasswordInput, newPasswordInput, confirmPasswordInput].forEach(input => {
  input.addEventListener('input', () => {
    errorDiv.style.display = 'none';
  });
});
```

**HTML:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Change Password</title>
  <style>
    .alert { padding: 10px; margin: 10px 0; border-radius: 4px; }
    .alert-error { background: #fee; color: #c00; border: 1px solid #fcc; }
    .alert-success { background: #efe; color: #0a0; border: 1px solid #cfc; }
    .form-group { margin: 15px 0; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ccc; cursor: not-allowed; }
  </style>
</head>
<body>
  <div class="change-password-form">
    <h2>Change Password</h2>
    
    <div id="error" class="alert alert-error" style="display: none;"></div>
    <div id="success" class="alert alert-success" style="display: none;"></div>

    <form id="changePasswordForm">
      <div class="form-group">
        <label for="currentPassword">Current Password:</label>
        <input type="password" id="currentPassword" required />
      </div>

      <div class="form-group">
        <label for="newPassword">New Password:</label>
        <input type="password" id="newPassword" required />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm New Password:</label>
        <input type="password" id="confirmPassword" required />
      </div>

      <button type="submit" id="submitBtn">Change Password</button>
    </form>
  </div>

  <script src="changePassword.js"></script>
</body>
</html>
```

---

## ✅ Frontend Validation Checklist

Trước khi gọi API, Frontend nên validate:

- [ ] `currentPassword` không được rỗng
- [ ] `newPassword` không được rỗng
- [ ] `newPassword` có độ dài 6-50 ký tự
- [ ] `confirmPassword` không được rỗng
- [ ] `newPassword` === `confirmPassword`
- [ ] `newPassword` !== `currentPassword`

---

## 🎯 Best Practices

### 1. **Security:**
- Không log password ra console
- Clear form sau khi success
- Không lưu password vào localStorage
- Sử dụng HTTPS trong production

### 2. **UX:**
- Show/hide password toggle
- Real-time validation feedback
- Password strength indicator
- Disable submit button while loading
- Clear error khi user chỉnh sửa input

### 3. **Error Handling:**
- Hiển thị error message rõ ràng
- Phân biệt lỗi network vs business logic
- Retry mechanism cho network error

---

## 🧪 Test Cases

### Frontend nên test:

1. ✅ Submit với all fields empty
2. ✅ Submit với new password < 6 characters
3. ✅ Submit với new password > 50 characters
4. ✅ Submit với new password ≠ confirm password
5. ✅ Submit với new password = current password
6. ✅ Submit với current password sai
7. ✅ Submit với data hợp lệ
8. ✅ Network error handling

---

## 📞 Support

Nếu có vấn đề với API, liên hệ Backend team hoặc check:
- Backend logs
- Network tab trong DevTools
- API response format
- CORS settings

---

**Last Updated:** March 1, 2026
