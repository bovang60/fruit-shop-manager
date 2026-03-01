# API Client Usage Guide

## 📦 Overview

Hệ thống API Client cung cấp một cách tiếp cận thống nhất và dễ sử dụng để gọi API trong toàn bộ ứng dụng.

**File:** `src/utils/apiClient.ts`

---

## 🤖 Integration Guide for AI Agents

### Cách tích hợp một API endpoint mới vào hệ thống

**⚠️ QUAN TRỌNG:** KHÔNG sửa trực tiếp vào file `src/utils/apiClient.ts`. File này là core utility và đã hoàn thiện.

### 📁 Folder Structure

```
Frontend/
├── src/
│   ├── utils/
│   │   └── apiClient.ts              ❌ KHÔNG SỬA - Core API client (đã hoàn thiện)
│   │
│   ├── services/                      ✅ THÊM CODE VÀO ĐÂY
│   │   ├── authService.ts            ← Authentication APIs
│   │   ├── productService.ts         ← Product APIs (example)
│   │   ├── orderService.ts           ← Order APIs (example)
│   │   └── [yourFeature]Service.ts   ← Tạo file service mới ở đây
│   │
│   └── components/
│       └── [feature-name]/           ✅ THÊM COMPONENT CODE VÀO ĐÂY
│           ├── [Feature].tsx         ← Container component (logic + API calls)
│           ├── [Feature]View.tsx     ← Presentation component (UI only)
│           ├── [Feature].css         ← Styles
│           └── API_[FEATURE].md      ← API documentation (optional)
```

---

### 🔄 Integration Workflow

#### **BƯỚC 1: Tạo Service File**

**Location:** `src/services/[feature]Service.ts`

**Template:**

```typescript
// src/services/productService.ts
import { get, post, put, del } from '../utils/apiClient'
import type { ApiResponse } from '../utils/apiClient'

// ============= Types =============
export interface Product {
  id: number
  name: string
  price: number
  // ... other fields
}

export interface CreateProductDto {
  name: string
  price: number
  // ... other fields
}

// ============= API Functions =============

/**
 * Get all products with pagination
 */
export async function getProducts(page: number, limit: number): Promise<ApiResponse<Product[]>> {
  return get<ApiResponse<Product[]>>('/api/products', { page, limit })
}

/**
 * Get product by ID
 */
export async function getProductById(id: number): Promise<ApiResponse<Product>> {
  return get<ApiResponse<Product>>(`/api/products/${id}`)
}

/**
 * Create new product
 */
export async function createProduct(data: CreateProductDto): Promise<ApiResponse<Product>> {
  return post<ApiResponse<Product>>('/api/products', data)
}

/**
 * Update existing product
 */
export async function updateProduct(id: number, data: Partial<CreateProductDto>): Promise<ApiResponse<Product>> {
  return put<ApiResponse<Product>>(`/api/products/${id}`, data)
}

/**
 * Delete product
 */
export async function deleteProduct(id: number): Promise<ApiResponse<null>> {
  return del<ApiResponse<null>>(`/api/products/${id}`)
}

// ============= Helper Functions (Optional) =============

/**
 * Get user-friendly error message
 */
export function getProductErrorMessage(message: string): string {
  const ERROR_MESSAGES: Record<string, string> = {
    "Product not found": "Không tìm thấy sản phẩm",
    "Product already exists": "Sản phẩm đã tồn tại",
    // ... add more mappings
  }
  return ERROR_MESSAGES[message] || message
}
```

---

#### **BƯỚC 2: Tạo Container Component**

**Location:** `src/components/[feature]/[Feature].tsx`

**Template:**

```typescript
// src/components/product-list/ProductList.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductListView from './ProductListView'
import { getProducts, getProductErrorMessage } from '../../services/productService'
import type { Product } from '../../services/productService'

export default function ProductList() {
  const navigate = useNavigate()
  
  // State management
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [page, setPage] = useState(1)

  // Load products
  useEffect(() => {
    loadProducts()
  }, [page])

  const loadProducts = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await getProducts(page, 10)

      if (result.resultCd === 0 && result.data) {
        setProducts(result.data)
      } else {
        setError(getProductErrorMessage(result.message || 'Unknown error'))
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`)
  }

  return (
    <ProductListView
      products={products}
      loading={loading}
      error={error}
      onProductClick={handleProductClick}
      onPageChange={setPage}
    />
  )
}
```

---

#### **BƯỚC 3: Tạo View Component**

**Location:** `src/components/[feature]/[Feature]View.tsx`

```typescript
// src/components/product-list/ProductListView.tsx
import './ProductList.css'
import type { Product } from '../../services/productService'

export type Props = {
  products: Product[]
  loading: boolean
  error: string
  onProductClick: (id: number) => void
  onPageChange: (page: number) => void
}

export default function ProductListView(props: Props) {
  if (props.loading) {
    return <div className="loading">Loading...</div>
  }

  if (props.error) {
    return <div className="error">{props.error}</div>
  }

  return (
    <div className="product-list">
      {props.products.map(product => (
        <div 
          key={product.id} 
          className="product-card"
          onClick={() => props.onProductClick(product.id)}
        >
          <h3>{product.name}</h3>
          <p className="price">${product.price}</p>
        </div>
      ))}
    </div>
  )
}
```

---

### 📋 Quick Checklist for AI Agents

Khi tích hợp API mới, check các bước sau:

- [ ] **BƯỚC 1:** Tạo file `src/services/[feature]Service.ts`
  - [ ] Import `get, post, put, del` từ `../utils/apiClient`
  - [ ] Import `type { ApiResponse }` từ `../utils/apiClient`
  - [ ] Định nghĩa TypeScript interfaces cho data types
  - [ ] Viết API functions với proper type annotations
  - [ ] Thêm JSDoc comments cho mỗi function
  - [ ] (Optional) Thêm helper functions cho error messages

- [ ] **BƯỚC 2:** Tạo Container Component `src/components/[feature]/[Feature].tsx`
  - [ ] Import service functions từ `../../services/[feature]Service`
  - [ ] Setup state management (useState, useEffect)
  - [ ] Implement API calls trong async functions
  - [ ] Handle loading, success, và error states
  - [ ] Validate data trước khi gọi API
  - [ ] Pass data và callbacks xuống View component

- [ ] **BƯỚC 3:** Tạo View Component `src/components/[feature]/[Feature]View.tsx`
  - [ ] Define Props type với tất cả required fields
  - [ ] Render UI based on props (pure presentation)
  - [ ] KHÔNG gọi API trực tiếp trong View component
  - [ ] KHÔNG có logic xử lý data trong View component

- [ ] **BƯỚC 4:** (Optional) Tạo documentation `src/components/[feature]/API_[FEATURE].md`
  - [ ] Document API endpoints
  - [ ] Request/Response examples
  - [ ] Error codes và messages
  - [ ] Flow diagrams

---

### 🎯 API Method Reference

Available methods from `apiClient.ts` (SỬ DỤNG, KHÔNG SỬA):

```typescript
// Import these from apiClient
import { get, post, put, del, patch } from '../utils/apiClient'
import type { ApiResponse } from '../utils/apiClient'

// GET request
get<T>(url: string, params?: object, headers?: object): Promise<T>

// POST request
post<T>(url: string, body?: object, headers?: object): Promise<T>

// PUT request
put<T>(url: string, body?: object, headers?: object): Promise<T>

// DELETE request
del<T>(url: string, headers?: object): Promise<T>

// PATCH request
patch<T>(url: string, body?: object, headers?: object): Promise<T>
```

**Response format từ backend:**

```typescript
interface ApiResponse<T> {
  resultCd: number      // 0 = success, 1 = error
  message?: string      // Success/error message
  data: T | null       // Response data
}
```

---

### ⚠️ Common Mistakes to Avoid

1. **❌ ĐỪNG sửa `src/utils/apiClient.ts`**
   - File này là core utility, đã hoàn thiện
   - Chỉ import và sử dụng

2. **❌ ĐỪNG gọi API trong View component**
   ```typescript
   // ❌ SAI
   function ProductView() {
     const [data, setData] = useState([])
     useEffect(() => {
       getProducts().then(setData)  // ĐỪNG làm thế này!
     }, [])
   }
   
   // ✅ ĐÚNG - Gọi API trong Container
   function Product() {
     const [data, setData] = useState([])
     useEffect(() => {
       loadData()
     }, [])
     return <ProductView data={data} />
   }
   ```

3. **❌ ĐỪNG hardcode API URLs**
   ```typescript
   // ❌ SAI
   const result = await get('http://localhost:8080/api/users')
   
   // ✅ ĐÚNG
   const result = await get('/api/users')  // apiClient tự động thêm base URL
   ```

4. **❌ ĐỪNG quên handle errors**
   ```typescript
   // ❌ SAI
   const result = await getProducts()
   setProducts(result.data)  // Crash nếu result.data = null
   
   // ✅ ĐÚNG
   if (result.resultCd === 0 && result.data) {
     setProducts(result.data)
   } else {
     setError(result.message || 'Error occurred')
   }
   ```

---

### 📚 Real Examples in Codebase

**Tham khảo các file đã implement:**

1. **Authentication APIs:**
   - Service: `src/services/authService.ts`
   - Components: 
     - `src/components/login/Login.tsx` (Container)
     - `src/components/login/LoginView.tsx` (View)
     - `src/components/register/Register.tsx` (Container)
     - `src/components/forgot-password/ForgotPassword.tsx` (Container)

2. **Pattern đã proven:**
   - ✅ Separation of concerns (Container vs View)
   - ✅ Type safety với TypeScript
   - ✅ Error handling consistency
   - ✅ Loading states
   - ✅ Vietnamese error messages via `getDisplayMessage()`

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
