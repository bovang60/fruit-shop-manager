# API Client Integration Guide

## 🎯 Mục đích

Hướng dẫn AI agents cách tích hợp API endpoints mới vào hệ thống **ĐÚNG CÁCH**.

---

## ⚠️ QUY TẮC QUAN TRỌNG

### ❌ KHÔNG ĐƯỢC LÀM

1. **KHÔNG sửa file `src/utils/apiClient.ts`** - File core này đã hoàn thiện
2. **KHÔNG gọi API trong View components** - Chỉ gọi trong Container components
3. **KHÔNG hardcode URLs** - Dùng relative paths như `/api/users`
4. **KHÔNG skip error handling** - Luôn check `resultCd` và handle errors

### ✅ PHẢI LÀM

1. **Tạo Service file mới** trong `src/services/`
2. **Tạo Container + View components** trong `src/components/[feature]/`
3. **Import và sử dụng** các methods có sẵn: `get`, `post`, `put`, `del`
4. **Handle errors proper** với Vietnamese messages

---

## 📁 Folder Structure

```
src/
├── utils/
│   └── apiClient.ts              ❌ ĐỪNG SỬA - Core utility đã hoàn thiện
│
├── services/                      ✅ TẠO FILE MỚI Ở ĐÂY
│   ├── authService.ts            
│   └── [feature]Service.ts       ← Tạo service file mới
│
└── components/
    └── [feature]/                 ✅ TẠO COMPONENTS Ở ĐÂY
        ├── [Feature].tsx          ← Container: Logic + API calls
        ├── [Feature]View.tsx      ← View: UI only, nhận props
        ├── [Feature].css
        └── [Feature].types.ts     ← (Optional) Model types cho component này
```

**Ví dụ cụ thể:**
```
src/components/change-password/
├── ChangePassword.tsx          ← Container
├── ChangePasswordView.tsx      ← View
├── ChangePassword.css          ← Styles
└── ChangePassword.types.ts     ← Types/Models cho ChangePassword
```

---

## 📝 Model Types (Optional)

Nếu component cần các types/models riêng, tạo file `[Feature].types.ts` trong folder component:

**File:** `src/components/change-password/ChangePassword.types.ts`

```typescript
// Request/Response types cho API
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordResponse {
  message: string
  success: boolean
}

// Props types cho View component
export interface ChangePasswordViewProps {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  errors: Record<string, string>
  loading: boolean
  onCurrentPasswordChange: (value: string) => void
  onNewPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

// Form state type
export interface ChangePasswordFormState {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
```

**Sử dụng trong Container:**

```typescript
import { useState } from 'react'
import ChangePasswordView from './ChangePasswordView'
import { changePassword } from '../../services/authService'
import type { 
  ChangePasswordRequest, 
  ChangePasswordFormState 
} from './ChangePassword.types'

export default function ChangePassword() {
  const [formData, setFormData] = useState<ChangePasswordFormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  // ... rest of logic
}
```

**Khi nào cần tạo file `.types.ts`:**
- ✅ Component có nhiều types phức tạp (>3 interfaces)
- ✅ Types chỉ dùng trong component đó, không share với services khác
- ✅ Props types cho View component phức tạp
- ❌ Types đơn giản có thể define trực tiếp trong View component
- ❌ Types dùng chung nhiều nơi → nên đặt trong service file

---

## 🔄 3 BƯỚC TÍCH HỢP API

### BƯỚC 1: Tạo Service File

**File:** `src/services/productService.ts`

```typescript
import { get, post, put, del } from '../utils/apiClient'
import type { ApiResponse } from '../utils/apiClient'

// Types
export interface Product {
  id: number
  name: string
  price: number
}

export interface CreateProductDto {
  name: string
  price: number
}

// API Functions
export async function getProducts(page: number, limit: number): Promise<ApiResponse<Product[]>> {
  return get<ApiResponse<Product[]>>('/api/products', { page, limit })
}

export async function createProduct(data: CreateProductDto): Promise<ApiResponse<Product>> {
  return post<ApiResponse<Product>>('/api/products', data)
}

export async function updateProduct(id: number, data: Partial<CreateProductDto>): Promise<ApiResponse<Product>> {
  return put<ApiResponse<Product>>(`/api/products/${id}`, data)
}

export async function deleteProduct(id: number): Promise<ApiResponse<null>> {
  return del<ApiResponse<null>>(`/api/products/${id}`)
}

// Error messages helper (Optional)
export function getErrorMessage(message: string): string {
  const MESSAGES: Record<string, string> = {
    "Product not found": "Không tìm thấy sản phẩm",
    "Invalid data": "Dữ liệu không hợp lệ",
  }
  return MESSAGES[message] || message
}
```

---

### BƯỚC 2: Tạo Container Component

**File:** `src/components/product-list/ProductList.tsx`

```typescript
import { useState, useEffect } from 'react'
import ProductListView from './ProductListView'
import { getProducts, getErrorMessage } from '../../services/productService'
import type { Product } from '../../services/productService'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await getProducts(1, 10)

      if (result.resultCd === 0 && result.data) {
        setProducts(result.data)
      } else {
        setError(getErrorMessage(result.message || 'Unknown error'))
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProductListView
      products={products}
      loading={loading}
      error={error}
    />
  )
}
```

---

### BƯỚC 3: Tạo View Component

**File:** `src/components/product-list/ProductListView.tsx`

```typescript
import type { Product } from '../../services/productService'

export type Props = {
  products: Product[]
  loading: boolean
  error: string
}

export default function ProductListView({ products, loading, error }: Props) {
  if (loading) return <div>Loading...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="product-list">
      {products.map(p => (
        <div key={p.id} className="product-card">
          <h3>{p.name}</h3>
          <p>${p.price}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## 📚 API Methods Available

Import từ `apiClient.ts` (KHÔNG cần sửa file này):

```typescript
import { get, post, put, del, patch } from '../utils/apiClient'
import type { ApiResponse } from '../utils/apiClient'

// GET
get<T>(url: string, params?: object, headers?: object): Promise<T>

// POST
post<T>(url: string, body?: object, headers?: object): Promise<T>

// PUT
put<T>(url: string, body?: object, headers?: object): Promise<T>

// DELETE
del<T>(url: string, headers?: object): Promise<T>

// PATCH
patch<T>(url: string, body?: object, headers?: object): Promise<T>
```

**Response Format:**

```typescript
interface ApiResponse<T> {
  resultCd: number      // 0 = success, 1+ = error
  message?: string      // Message from backend
  data: T | null       // Response data
}
```

---

## ✅ Checklist

- [ ] Tạo service file trong `src/services/[feature]Service.ts`
- [ ] Import `get, post, put, del` từ `../utils/apiClient`
- [ ] Import `type { ApiResponse }` từ `../utils/apiClient`
- [ ] Define TypeScript interfaces cho data types
- [ ] Viết API functions với type annotations đúng
- [ ] (Optional) Tạo file `[Feature].types.ts` trong folder component nếu có nhiều types phức tạp
- [ ] Tạo Container component trong `src/components/[feature]/[Feature].tsx`
- [ ] Import service functions và gọi API trong Container
- [ ] Handle loading, success, error states
- [ ] Validate input trước khi gọi API
- [ ] Tạo View component nhận props từ Container
- [ ] View component KHÔNG gọi API, chỉ render UI

---

## 🎯 Examples Trong Codebase

**Tham khảo code đã có:**

1. **Auth Service:** `src/services/authService.ts`
   - Functions: `login()`, `requestRegister()`, `verifyOtp()`, `requestPasswordReset()`, `resetPasswordWithOtp()`
   - Helper: `getDisplayMessage()` - Vietnamese error messages

2. **Login Component:** `src/components/login/`
   - Container: `Login.tsx` - State management + API calls
   - View: `LoginView.tsx` - UI only

3. **Forgot Password:** `src/components/forgot-password/`
   - Container: `ForgotPassword.tsx` - 2-step flow (Request OTP → Reset Password)
   - View: `ForgotPasswordView.tsx` - Conditional rendering based on step

4. **Change Password:** `src/components/change-password/`
   - Container: `ChangePassword.tsx` - State management + validation
   - View: `ChangePasswordView.tsx` - Form UI
   - Types: `ChangePassword.types.ts` - Model types cho component (nếu cần)

---

## ⚠️ Common Mistakes

### ❌ SAI

```typescript
// 1. Gọi API trong View component
function ProductView() {
  const [data, setData] = useState([])
  useEffect(() => {
    getProducts().then(setData)  // ĐỪNG!
  }, [])
}

// 2. Hardcode URL
const result = await get('http://localhost:8080/api/users')

// 3. Không check resultCd
const result = await getProducts()
setProducts(result.data)  // Crash if data = null!

// 4. Sửa apiClient.ts
// ĐỪNG thêm code vào apiClient.ts!
```

### ✅ ĐÚNG

```typescript
// 1. Gọi API trong Container
function ProductList() {
  const [data, setData] = useState([])
  useEffect(() => { loadData() }, [])
  
  const loadData = async () => {
    const result = await getProducts(1, 10)
    if (result.resultCd === 0 && result.data) {
      setData(result.data)
    }
  }
  
  return <ProductListView data={data} />
}

// 2. Dùng relative path
const result = await get('/api/users')

// 3. Luôn check resultCd
if (result.resultCd === 0 && result.data) {
  setProducts(result.data)
} else {
  setError(result.message || 'Error')
}

// 4. Tạo service file mới
// Tạo src/services/myService.ts, import và dùng apiClient
```

---

## 🎓 Summary

**Workflow chuẩn:**
1. ✅ Tạo `src/services/[feature]Service.ts` với API functions
2. ✅ (Optional) Tạo `src/components/[feature]/[Feature].types.ts` nếu cần nhiều types phức tạp
3. ✅ Tạo `src/components/[feature]/[Feature].tsx` (Container) - gọi API
4. ✅ Tạo `src/components/[feature]/[Feature]View.tsx` (View) - render UI
5. ✅ Handle errors với Vietnamese messages
6. ✅ KHÔNG sửa `apiClient.ts`

**Response structure từ backend:**
```typescript
{
  resultCd: 0,           // 0 = success
  message: "Success",
  data: { ... }          // Your data here
}
```

**Error handling pattern:**
```typescript
if (result.resultCd === 0 && result.data) {
  // Success
} else {
  // Error - show result.message
}
```

---

**Xem thêm:**
- [authService.ts](src/services/authService.ts) - Authentication API implementation
- [Login component](src/components/login/) - Login flow example  
- [ForgotPassword component](src/components/forgot-password/) - 2-step OTP flow example
