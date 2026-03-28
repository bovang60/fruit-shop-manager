# 🎯 HƯỚNG DẪN SỬ DỤNG API CLIENT - CHO NGƯỜI MỚI

## 📚 Mục đích

API Client giúp bạn gọi API dễ dàng mà không phải viết lại code fetch nhiều lần.

---

## 🚀 BƯỚC 1: Tạo Service File

### Tại sao cần Service?
- Tập trung tất cả API của 1 resource (VD: products, orders) vào 1 file
- Dễ quản lý và tái sử dụng
- Không phải viết lại code fetch

### Ví dụ: Tạo `productService.ts`

```typescript
// src/services/productService.ts

import { get, post } from '../utils/apiClient'

// Lấy danh sách sản phẩm
export async function getProducts() {
  return get('/api/products')
}

// Tạo sản phẩm mới
export async function createProduct(data) {
  return post('/api/products', data)
}
```

**Giải thích:**
- `get()` = gửi HTTP GET request
- `post()` = gửi HTTP POST request
- Không cần viết `fetch`, `headers`, `JSON.stringify` → API Client lo hết!

---

## 🎨 BƯỚC 2: Sử dụng trong Component

### Ví dụ: Hiển thị danh sách sản phẩm

```typescript
// Component.tsx

import { useState, useEffect } from 'react'
import { getProducts } from '../services/productService'

export function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    
    try {
      // Gọi function từ service
      const result = await getProducts()
      
      // Kiểm tra resultCd từ backend
      if (result.resultCd === 0) {
        setProducts(result.data)
      }
    } catch (error) {
      alert('Có lỗi!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {products.map(p => <div key={p.id}>{p.name}</div>)}
    </div>
  )
}
```

---

## 📖 CÁC HÀM CÓ SẴN TRONG API CLIENT

### 1. `get()` - Lấy dữ liệu

**Cú pháp:**
```typescript
get<ResponseType>(endpoint, queryParams?)
```

**Ví dụ:**
```typescript
// GET /api/products
const products = await get('/api/products')

// GET /api/products?page=1&limit=10
const products = await get('/api/products', { page: 1, limit: 10 })

// GET /api/products/123
const product = await get('/api/products/123')
```

---

### 2. `post()` - Tạo mới

**Cú pháp:**
```typescript
post<ResponseType>(endpoint, bodyData)
```

**Ví dụ:**
```typescript
// POST /api/products
const result = await post('/api/products', {
  name: 'Apple',
  price: 50000
})
```

---

### 3. `put()` - Cập nhật

**Cú pháp:**
```typescript
put<ResponseType>(endpoint, bodyData)
```

**Ví dụ:**
```typescript
// PUT /api/products/123
const result = await put('/api/products/123', {
  name: 'Green Apple',
  price: 60000
})
```

---

### 4. `del()` - Xóa

**Cú pháp:**
```typescript
del<ResponseType>(endpoint)
```

**Ví dụ:**
```typescript
// DELETE /api/products/123
const result = await del('/api/products/123')
```

---

## 🔄 LUỒNG HOẠT ĐỘNG ĐẦY ĐỦ

```
1. User nhấn button
   ↓
2. Component gọi function trong Service
   ↓
3. Service gọi API Client (get/post/put/del)
   ↓
4. API Client gửi HTTP request đến Backend
   ↓
5. Backend xử lý và trả về JSON
   ↓
6. API Client parse JSON
   ↓
7. Service trả kết quả về Component
   ↓
8. Component hiển thị cho User
```

---

## 📋 VÍ DỤ HOÀN CHỈNH - QUẢN LÝ SẢN PHẨM

### Bước 1: Tạo Service (`productService.ts`)

```typescript
import { get, post, put, del, ApiResponse } from '../utils/apiClient'

export interface Product {
  id: number
  name: string
  price: number
}

// Lấy danh sách
export async function getProducts() {
  return get<ApiResponse<Product[]>>('/api/products')
}

// Lấy 1 sản phẩm
export async function getProductById(id: number) {
  return get<ApiResponse<Product>>(`/api/products/${id}`)
}

// Tạo mới
export async function createProduct(data: { name: string, price: number }) {
  return post<ApiResponse<Product>>('/api/products', data)
}

// Cập nhật
export async function updateProduct(id: number, data: { name?: string, price?: number }) {
  return put<ApiResponse<Product>>(`/api/products/${id}`, data)
}

// Xóa
export async function deleteProduct(id: number) {
  return del<ApiResponse<null>>(`/api/products/${id}`)
}
```

---

### Bước 2: Tạo Component (`ProductManager.tsx`)

```typescript
import { useState, useEffect } from 'react'
import { getProducts, createProduct, deleteProduct } from '../services/productService'

export function ProductManager() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [loading, setLoading] = useState(false)

  // Load danh sách khi component mount
  useEffect(() => {
    loadProducts()
  }, [])

  // Function load danh sách
  async function loadProducts() {
    setLoading(true)
    try {
      const result = await getProducts()
      if (result.resultCd === 0) {
        setProducts(result.data)
      }
    } catch (error) {
      alert('Lỗi khi tải sản phẩm!')
    } finally {
      setLoading(false)
    }
  }

  // Function thêm sản phẩm
  async function handleCreate() {
    try {
      const result = await createProduct({ name, price })
      
      if (result.resultCd === 0) {
        alert('Tạo thành công!')
        loadProducts() // Reload danh sách
        setName('')
        setPrice(0)
      }
    } catch (error) {
      alert('Lỗi khi tạo sản phẩm!')
    }
  }

  // Function xóa sản phẩm
  async function handleDelete(id: number) {
    if (!confirm('Bạn có chắc muốn xóa?')) return
    
    try {
      const result = await deleteProduct(id)
      
      if (result.resultCd === 0) {
        alert('Xóa thành công!')
        loadProducts() // Reload danh sách
      }
    } catch (error) {
      alert('Lỗi khi xóa sản phẩm!')
    }
  }

  return (
    <div>
      <h1>Quản lý sản phẩm</h1>

      {/* Form thêm sản phẩm */}
      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên sản phẩm"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Giá"
        />
        <button onClick={handleCreate}>Thêm sản phẩm</button>
      </div>

      {/* Danh sách sản phẩm */}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <ul>
          {products.map(product => (
            <li key={product.id}>
              {product.name} - {product.price}đ
              <button onClick={() => handleDelete(product.id)}>Xóa</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

---

## 🎯 TÓM TẮT - NHỚ 3 ĐIỀU NÀY

### 1️⃣ Tạo Service file
```typescript
// productService.ts
export async function getProducts() {
  return get('/api/products')
}
```

### 2️⃣ Import vào Component  
```typescript
import { getProducts } from '../services/productService'
```

### 3️⃣ Gọi và xử lý kết quả
```typescript
const result = await getProducts()

if (result.resultCd === 0) {
  // Thành công
  setProducts(result.data)
} else {
  // Lỗi từ backend
  alert(result.message)
}
```

---

## ❓ CÂU HỎI THƯỜNG GẶP

**Q: Tôi phải import gì từ apiClient?**
```typescript
import { get, post, put, del, ApiResponse } from '../utils/apiClient'
```

**Q: Làm sao biết API endpoint là gì?**
- Xem file `FRONTEND_INTEGRATION_GUIDE.md`
- Hoặc hỏi backend developer

**Q: resultCd là gì?**
- `resultCd = 0`: Thành công
- `resultCd = 1`: Lỗi từ backend

**Q: Tôi không cần Service, gọi thẳng được không?**
```typescript
// Được, nhưng không khuyến khích
import { get } from '../utils/apiClient'

const result = await get('/api/products')
```

**Q: Có cần async/await không?**
- **CÓ!** Vì API call là asynchronous

**Q: Làm sao xử lý lỗi?**
```typescript
try {
  const result = await getProducts()
  // ...
} catch (error) {
  alert('Có lỗi xảy ra!')
}
```

---

## 📁 CẤU TRÚC THư MỤC ĐỀ XUẤT

```
src/
├── utils/
│   └── apiClient.ts         ← Đã có sẵn (không cần sửa)
│
├── services/
│   ├── authService.ts       ← Đã có sẵn (Login, Register)
│   ├── productService.ts    ← Bạn tạo thêm
│   ├── orderService.ts      ← Bạn tạo thêm
│   └── userService.ts       ← Bạn tạo thêm
│
└── components/
    ├── login/
    │   └── Login.tsx        ← Đã dùng authService
    └── products/
        └── ProductList.tsx  ← Bạn tạo, dùng productService
```

---

## 🎓 BÀI TẬP THỰC HÀNH

Hãy tạo `orderService.ts` với các function sau:

```typescript
// 1. Lấy danh sách đơn hàng của user
export async function getMyOrders() {
  return get('/api/orders/my-orders')
}

// 2. Tạo đơn hàng mới
export async function createOrder(data: {
  items: Array<{ productId: number, quantity: number }>
  address: string
}) {
  return post('/api/orders', data)
}

// 3. Lấy chi tiết đơn hàng
export async function getOrderById(orderId: number) {
  return get(`/api/orders/${orderId}`)
}
```

Sau đó tạo component `OrderList.tsx` để hiển thị danh sách đơn hàng!

---

## 🎉 KẾT LUẬN

**API Client giúp bạn:**
- ✅ Viết code ngắn hơn 70%
- ✅ Không phải nhớ cú pháp fetch phức tạp
- ✅ Code dễ đọc, dễ maintain
- ✅ Tái sử dụng được nhiều lần

**Hãy nhớ:**
1. Tạo Service cho mỗi loại API (products, orders, users...)
2. Import function từ Service vào Component
3. Gọi với `await` và xử lý `resultCd`

Chúc bạn code vui vẻ! 🚀
