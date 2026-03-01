# API Client Usage Guide

## 📦 Overview

Hệ thống API Client cung cấp một cách tiếp cận thống nhất và dễ sử dụng để gọi API trong toàn bộ ứng dụng.

**File:** `src/utils/apiClient.ts`

---

## 🚀 Quick Start

### Import

```typescript
import { apiRequest, get, post, put, del, patch } from '@/utils/apiClient'
import type { ApiResponse } from '@/utils/apiClient'
```

---

## 📋 Basic Usage

### 1. Method Wrappers (Recommended)

#### GET Request

```typescript
// Basic GET
const users = await get<User[]>('/api/users')

// GET with query params
const products = await get<Product[]>('/api/products', {
  page: 1,
  limit: 10,
  category: 'fruits'
})
// → /api/products?page=1&limit=10&category=fruits

// GET with custom headers
const data = await get<Data>('/api/data', undefined, {
  'X-Custom-Header': 'value'
})
```

#### POST Request

```typescript
// Create user
const result = await post<ApiResponse<User>>('/api/users', {
  name: 'John Doe',
  email: 'john@example.com'
})

// Login
const loginResult = await post<ApiResponse<UserDto>>('/api/users/login', {
  email: 'user@example.com',
  password: '123456'
})
```

#### PUT Request

```typescript
// Update user
const updated = await put<ApiResponse<User>>(`/api/users/${userId}`, {
  name: 'Jane Doe',
  email: 'jane@example.com'
})
```

#### DELETE Request

```typescript
// Delete user
const result = await del<ApiResponse<null>>(`/api/users/${userId}`)
```

#### PATCH Request

```typescript
// Partial update
const result = await patch<ApiResponse<User>>(`/api/users/${userId}`, {
  status: 'active'
})
```

### 2. Generic apiRequest (Advanced)

Cho các use cases phức tạp hơn:

```typescript
// Full control
const result = await apiRequest<ApiResponse<Data>>('/api/endpoint', {
  method: 'POST',
  body: { key: 'value' },
  headers: { 'X-Custom': 'header' },
  params: { filter: 'active', sort: 'desc' }
})
```

---

## 🏗️ Real World Examples

### Authentication Service

```typescript
// authService.ts
import { post, put, type ApiResponse } from '../utils/apiClient'

export async function login(data: LoginRequest): Promise<ApiResponse<UserDto>> {
  return post<ApiResponse<UserDto>>('/api/users/login', data)
}

export async function register(data: RegisterRequest): Promise<ApiResponse<null>> {
  return post<ApiResponse<null>>('/api/users/request-register', data)
}

export async function updateProfile(
  userId: number, 
  data: UpdateProfileRequest
): Promise<ApiResponse<UserDto>> {
  return put<ApiResponse<UserDto>>(`/api/users/${userId}/profile`, data)
}

// Forgot Password - Step 1: Request OTP
export async function requestPasswordReset(
  data: ForgotPasswordRequestData
): Promise<ApiResponse<null>> {
  return post<ApiResponse<null>>('/api/users/forgot-password/request', data)
}

// Forgot Password - Step 2: Reset password with OTP
export async function resetPasswordWithOtp(
  data: ResetPasswordRequest
): Promise<ApiResponse<null>> {
  return post<ApiResponse<null>>('/api/users/forgot-password/reset', data)
}
```

### Forgot Password Flow (2-Step OTP Verification)

```typescript
// authService.ts - Forgot Password Types & Functions
export interface ForgotPasswordRequestData {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  otpCode: string
  newPassword: string
  confirmPassword: string
}

// Step 1: Request OTP via email
export async function requestPasswordReset(
  data: ForgotPasswordRequestData
): Promise<ApiResponse<null>> {
  return post<ApiResponse<null>>('/api/users/forgot-password/request', data)
}

// Step 2: Reset password with OTP
export async function resetPasswordWithOtp(
  data: ResetPasswordRequest
): Promise<ApiResponse<null>> {
  return post<ApiResponse<null>>('/api/users/forgot-password/reset', data)
}

// Usage Example in Component:
const handleRequestOtp = async () => {
  const result = await requestPasswordReset({ email: 'user@example.com' })
  
  if (result.resultCd === 0) {
    // OTP sent successfully
    console.log(result.message)
    // Show OTP input form
  } else {
    // Handle error
    console.error(result.message)
  }
}

const handleResetPassword = async () => {
  const result = await resetPasswordWithOtp({
    email: 'user@example.com',
    otpCode: '123456',
    newPassword: 'newPass123',
    confirmPassword: 'newPass123'
  })
  
  if (result.resultCd === 0) {
    // Password reset successful
    console.log('Password reset! Redirecting to login...')
    navigate('/login')
  } else {
    // Handle error (invalid OTP, expired, etc.)
    console.error(result.message)
  }
}
```

### Product Service

```typescript
// productService.ts
import { get, post, put, del, type ApiResponse } from '../utils/apiClient'

// Get all products with pagination
export async function getProducts(page: number, limit: number) {
  return get<ApiResponse<Product[]>>('/api/products', { page, limit })
}

// Get product by ID
export async function getProductById(id: number) {
  return get<ApiResponse<Product>>(`/api/products/${id}`)
}

// Create product
export async function createProduct(data: CreateProductDto) {
  return post<ApiResponse<Product>>('/api/products', data)
}

// Update product
export async function updateProduct(id: number, data: UpdateProductDto) {
  return put<ApiResponse<Product>>(`/api/products/${id}`, data)
}

// Delete product
export async function deleteProduct(id: number) {
  return del<ApiResponse<null>>(`/api/products/${id}`)
}

// Search products
export async function searchProducts(query: string, category?: string) {
  return get<ApiResponse<Product[]>>('/api/products/search', {
    q: query,
    ...(category && { category })
  })
}
```

### Order Service

```typescript
// orderService.ts
import { get, post, type ApiResponse } from '../utils/apiClient'

export interface CreateOrderDto {
  items: Array<{ productId: number; quantity: number }>
  deliveryAddress: string
  paymentMethod: string
}

// Get user orders
export async function getMyOrders(status?: string) {
  return get<ApiResponse<Order[]>>('/api/orders/my-orders', {
    ...(status && { status })
  })
}

// Create order
export async function createOrder(data: CreateOrderDto) {
  return post<ApiResponse<Order>>('/api/orders', data)
}

// Get order details
export async function getOrderById(orderId: number) {
  return get<ApiResponse<Order>>(`/api/orders/${orderId}`)
}
```

---

## 🎯 Component Usage

### In React Component

```typescript
// ProductList.tsx
import { useEffect, useState } from 'react'
import { getProducts } from '@/services/productService'
import type { Product } from '@/types'

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      setError('')
      
      try {
        const result = await getProducts(1, 10)
        
        if (result.resultCd === 0 && result.data) {
          setProducts(result.data)
        } else {
          setError(result.message)
        }
      } catch (err) {
        setError('Có lỗi xảy ra. Vui lòng thử lại!')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

### Form Submission

```typescript
// CreateProductForm.tsx
import { useState } from 'react'
import { createProduct } from '@/services/productService'

export function CreateProductForm() {
  const [formData, setFormData] = useState({ name: '', price: 0 })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createProduct(formData)
      
      if (result.resultCd === 0) {
        alert('Tạo sản phẩm thành công!')
        // Reset form hoặc redirect
      } else {
        alert(result.message)
      }
    } catch (error) {
      alert('Có lỗi xảy ra!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Đang tạo...' : 'Tạo sản phẩm'}
      </button>
    </form>
  )
}
```

---

## ⚙️ Configuration

### Environment Variables

Tạo file `.env` để config API base URL:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Production:
```env
VITE_API_BASE_URL=https://api.yourapp.com
```

API Client sẽ tự động sử dụng đúng URL theo environment.

---

## 🔒 Authentication Headers

Nếu API yêu cầu authentication token:

```typescript
import { authHeader, saveAuthToken, getAuthToken } from '@/utils/apiClient'

// Sau khi login thành công, lưu token
const loginResult = await login({ email, password })
if (loginResult.resultCd === 0 && loginResult.data.token) {
  saveAuthToken(loginResult.data.token)
}

// Gọi API với auth header
const token = getAuthToken()
if (token) {
  const result = await get<ApiResponse<User>>('/api/profile', undefined, authHeader(token))
}
```

---

## 🛠️ Advanced Features

### Custom Headers

```typescript
const result = await post<ApiResponse<Data>>('/api/endpoint', data, {
  'Authorization': `Bearer ${token}`,
  'X-Custom-Header': 'value',
  'X-Request-ID': crypto.randomUUID()
})
```

### Query Parameters

```typescript
// Simple params
const users = await get<User[]>('/api/users', {
  page: 1,
  limit: 20,
  active: true
})

// Complex filtering
const products = await get<Product[]>('/api/products', {
  category: 'fruits',
  minPrice: 100,
  maxPrice: 500,
  sort: 'price',
  order: 'asc'
})
```

### Error Handling

```typescript
try {
  const result = await post<ApiResponse<User>>('/api/users', userData)
  
  if (result.resultCd === 0) {
    // Success
    console.log('User created:', result.data)
  } else {
    // Business logic error
    console.error('Error:', result.message)
  }
} catch (error) {
  // Network error, server error, etc.
  console.error('Request failed:', error)
  // Show user friendly message
  alert('Không thể kết nối đến server. Vui lòng thử lại!')
}
```

---

## 📝 Type Safety

Always define interfaces for your API responses:

```typescript
// types/product.ts
export interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
}

export interface CreateProductDto {
  name: string
  price: number
  category: string
}

// services/productService.ts
import type { ApiResponse } from '@/utils/apiClient'
import type { Product, CreateProductDto } from '@/types/product'

export async function createProduct(
  data: CreateProductDto
): Promise<ApiResponse<Product>> {
  return post<ApiResponse<Product>>('/api/products', data)
}
```

Type safety giúp:
- IDE autocomplete
- Compile-time error checking
- Better documentation
- Easier refactoring

---

## ✅ Best Practices

1. **Tạo dedicated service file cho mỗi resource**
   ```
   src/services/
     ├── authService.ts
     ├── productService.ts
     ├── orderService.ts
     └── userService.ts
   ```

2. **Sử dụng type safety**
   - Định nghĩa interfaces cho tất cả API requests/responses
   - Sử dụng TypeScript generics

3. **Error handling nhất quán**
   ```typescript
   // Check resultCd từ backend
   if (result.resultCd === 0) {
     // Success
   } else {
     // Business error
   }
   ```

4. **Không hardcode URLs**
   - Sử dụng environment variables
   - Centralize base URL trong apiClient

5. **Loading và error states**
   - Luôn hiển thị loading state
   - Handle errors gracefully
   - Show user-friendly messages

---

## 🧪 Testing

Example với Jest:

```typescript
// productService.test.ts
import { createProduct } from './productService'
import * as apiClient from '@/utils/apiClient'

jest.mock('@/utils/apiClient')

describe('productService', () => {
  it('should create product successfully', async () => {
    const mockResponse = {
      resultCd: 0,
      message: 'Success',
      data: { id: 1, name: 'Apple', price: 50 }
    }
    
    jest.spyOn(apiClient, 'post').mockResolvedValue(mockResponse)
    
    const result = await createProduct({ name: 'Apple', price: 50 })
    
    expect(result.resultCd).toBe(0)
    expect(result.data?.name).toBe('Apple')
  })
})
```

---

## � Complete Example: Forgot Password Flow

Đây là ví dụ đầy đủ về cách implement forgot password với 2-step OTP verification:

```typescript
// ForgotPassword.tsx - Container Component
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestPasswordReset, resetPasswordWithOtp, getDisplayMessage } from '@/services/authService'
import ForgotPasswordView from './ForgotPasswordView'

type Step = 'request' | 'reset'

export default function ForgotPassword() {
  const navigate = useNavigate()
  
  // State management
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setErrors({ email: 'Email is required' })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const result = await requestPasswordReset({ email })

      if (result.resultCd === 0) {
        // Success - OTP sent
        setStep('reset')
        alert(getDisplayMessage(result.message || '') || 'OTP sent to your email!')
      } else {
        // Error
        setErrors({ 
          general: getDisplayMessage(result.message || '') || 'Failed to send OTP' 
        })
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Reset Password with OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!otpCode || otpCode.length !== 6) {
      setErrors({ otpCode: 'OTP must be 6 digits' })
      return
    }
    
    if (newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters' })
      return
    }
    
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const result = await resetPasswordWithOtp({
        email,
        otpCode,
        newPassword,
        confirmPassword
      })

      if (result.resultCd === 0) {
        // Success
        setSuccess(true)
        alert(getDisplayMessage(result.message || '') || 'Password reset successfully!')
        
        // Redirect to login after 2 seconds
        setTimeout(() => navigate('/login'), 2000)
      } else {
        // Error (invalid OTP, expired, etc.)
        setErrors({ 
          general: getDisplayMessage(result.message || '') || 'Failed to reset password' 
        })
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    setLoading(true)
    try {
      const result = await requestPasswordReset({ email })
      if (result.resultCd === 0) {
        alert('OTP resent successfully!')
      }
    } catch (error) {
      alert('Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ForgotPasswordView
      step={step}
      email={email}
      otpCode={otpCode}
      newPassword={newPassword}
      confirmPassword={confirmPassword}
      errors={errors}
      loading={loading}
      success={success}
      onEmailChange={setEmail}
      onOtpChange={(v) => setOtpCode(v.replace(/\D/g, '').slice(0, 6))}
      onNewPasswordChange={setNewPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onSubmit={step === 'request' ? handleRequestOtp : handleResetPassword}
      onResendOtp={handleResendOtp}
      onGoToLogin={() => navigate('/login')}
    />
  )
}
```

**Key Points:**
- ✅ 2-step flow: Request OTP → Reset with OTP
- ✅ Proper validation for each step
- ✅ User-friendly Vietnamese error messages via `getDisplayMessage()`
- ✅ Loading states and error handling
- ✅ Auto-redirect after success
- ✅ OTP resend functionality
- ✅ Type-safe with TypeScript

---

## 🧪 Testing

Example với Jest:

```typescript
// productService.test.ts
import { createProduct } from './productService'
import * as apiClient from '@/utils/apiClient'

jest.mock('@/utils/apiClient')

describe('productService', () => {
  it('should create product successfully', async () => {
    const mockResponse = {
      resultCd: 0,
      message: 'Success',
      data: { id: 1, name: 'Apple', price: 50 }
    }
    
    jest.spyOn(apiClient, 'post').mockResolvedValue(mockResponse)
    
    const result = await createProduct({ name: 'Apple', price: 50 })
    
    expect(result.resultCd).toBe(0)
    expect(result.data?.name).toBe('Apple')
  })
})
```

---

## �📚 Summary

**API Client** cung cấp:
- ✅ Centralized API handling
- ✅ Type-safe requests
- ✅ Consistent error handling
- ✅ Easy to use wrappers (get, post, put, del, patch)
- ✅ Query params support
- ✅ Custom headers support
- ✅ Environment-based configuration
- ✅ Clean and maintainable code

**Next Steps:**
- Tạo service files cho các resources khác (products, orders, etc.)
- Implement token-based authentication nếu cần
- Add request/response interceptors nếu cần (logging, error tracking)
- Consider adding retry logic cho network failures
