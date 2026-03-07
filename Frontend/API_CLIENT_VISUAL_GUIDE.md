# 🎨 VISUAL GUIDE - API CLIENT FLOW

## 📊 Sơ đồ tổng quan

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND APPLICATION                          │
│                                                                  │
│  ┌────────────┐     ┌──────────────┐     ┌─────────────┐      │
│  │            │     │              │     │             │       │
│  │ Component  │────>│   Service    │────>│ API Client  │───┐   │
│  │ (UI Logic) │     │  (Business)  │     │  (HTTP)     │   │   │
│  │            │<────│              │<────│             │<──┘   │
│  └────────────┘     └──────────────┘     └─────────────┘       │
│                                                  │               │
└──────────────────────────────────────────────────┼──────────────┘
                                                   │
                                                   │ HTTP
                                                   │
                                        ┌──────────▼────────┐
                                        │                   │
                                        │  BACKEND SERVER   │
                                        │  (Spring Boot)    │
                                        │                   │
                                        └───────────────────┘
```

---

## 🔄 Chi tiết từng bước (Ví dụ: Lấy danh sách sản phẩm)

### BƯỚC 1: User click button "Tải sản phẩm"

```typescript
// ProductList.tsx (Component)
function ProductList() {
  async function loadProducts() {
    const result = await getProducts()  // ← Gọi Service
  }
  
  return <button onClick={loadProducts}>Tải sản phẩm</button>
}
```

**→ Component GỌI Service**

---

### BƯỚC 2: Service xử lý request

```typescript
// productService.ts (Service)
export async function getProducts() {
  return get('/api/products')  // ← Gọi API Client
}
```

**→ Service GỌI API Client**

---

### BƯỚC 3: API Client gửi HTTP request

```typescript
// apiClient.ts
export async function get(endpoint) {
  const url = 'http://localhost:8080' + endpoint
  // → http://localhost:8080/api/products
  
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  
  return await response.json()
}
```

**→ API Client GỬI REQUEST đến Backend**

---

### BƯỚC 4: Backend xử lý

```java
// ProductController.java (Backend)
@GetMapping("/api/products")
public ApiResponse<List<Product>> getProducts() {
  List<Product> products = productService.getAllProducts();
  return ApiResponse.success(products);
}
```

**→ Backend TRẢ VỀ JSON:**

```json
{
  "resultCd": 0,
  "message": "Success",
  "data": [
    { "id": 1, "name": "Apple", "price": 50000 },
    { "id": 2, "name": "Orange", "price": 40000 }
  ]
}
```

---

### BƯỚC 5-7: Data quay ngược lại Component

```
Backend → API Client → Service → Component
```

```typescript
// Component nhận được result
{
  resultCd: 0,
  message: "Success",
  data: [
    { id: 1, name: "Apple", price: 50000 },
    { id: 2, name: "Orange", price: 40000 }
  ]
}

// Hiển thị cho user
if (result.resultCd === 0) {
  setProducts(result.data)
}
```

---

## 📝 So sánh với cách cũ

### ❌ CÁCH CŨ - Không dùng API Client

```typescript
// ProductList.tsx - Phải viết TOÀN BỘ trong component
function ProductList() {
  async function loadProducts() {
    try {
      // Viết dài dòng, lặp lại nhiều lần
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      
      if (result.resultCd === 0) {
        setProducts(result.data)
      }
    } catch (error) {
      console.error(error)
    }
  }
}

// OrderList.tsx - Phải VIẾT LẠI TƯƠNG TỰ
function OrderList() {
  async function loadOrders() {
    try {
      // COPY-PASTE code tương tự ở trên
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      
      if (result.resultCd === 0) {
        setOrders(result.data)
      }
    } catch (error) {
      console.error(error)
    }
  }
}
```

**Vấn đề:**
- 😢 Code dài dòng, lặp lại
- 😢 Khó maintain (sửa ở 10 chỗ khác nhau)
- 😢 Dễ quên xử lý error
- 😢 Khó test

---

### ✅ CÁCH MỚI - Dùng API Client

**Bước 1: Tạo Service 1 lần**
```typescript
// productService.ts
export async function getProducts() {
  return get('/api/products')  // Ngắn gọn!
}

// orderService.ts
export async function getOrders() {
  return get('/api/orders')  // Ngắn gọn!
}
```

**Bước 2: Dùng ở mọi Component**
```typescript
// ProductList.tsx
const result = await getProducts()

// OrderList.tsx
const result = await getOrders()

// Dashboard.tsx
const products = await getProducts()
const orders = await getOrders()
```

**Ưu điểm:**
- 😊 Code ngắn gọn
- 😊 Tái sử dụng được
- 😊 Dễ maintain (chỉ sửa 1 chỗ)
- 😊 Type-safe với TypeScript
- 😊 Dễ test

---

## 🎯 CÁC LOẠI HTTP METHODS

```
┌────────────┬──────────┬─────────────────────────────────────┐
│ Method     │ Function │ Mục đích                            │
├────────────┼──────────┼─────────────────────────────────────┤
│ GET        │ get()    │ LẤY dữ liệu (đọc)                   │
│ POST       │ post()   │ TẠO MỚI dữ liệu                     │
│ PUT        │ put()    │ CẬP NHẬT toàn bộ                    │
│ PATCH      │ patch()  │ CẬP NHẬT 1 phần                     │
│ DELETE     │ del()    │ XÓA dữ liệu                         │
└────────────┴──────────┴─────────────────────────────────────┘
```

### Ví dụ với Products:

```typescript
// GET - Lấy danh sách
const products = await get('/api/products')

// POST - Tạo sản phẩm mới
const result = await post('/api/products', {
  name: 'Apple',
  price: 50000
})

// PUT - Cập nhật toàn bộ sản phẩm
const result = await put('/api/products/1', {
  name: 'Green Apple',
  price: 60000,
  description: 'Fresh green apple'
})

// PATCH - Chỉ cập nhật giá
const result = await patch('/api/products/1', {
  price: 65000
})

// DELETE - Xóa sản phẩm
const result = await del('/api/products/1')
```

---

## 🔢 Ví dụ với Query Parameters

```typescript
// Không có params
await get('/api/products')
// → http://localhost:8080/api/products

// Có params
await get('/api/products', { page: 1, limit: 10 })
// → http://localhost:8080/api/products?page=1&limit=10

// Nhiều params
await get('/api/products', {
  page: 1,
  limit: 10,
  category: 'fruits',
  minPrice: 10000,
  maxPrice: 50000
})
// → http://localhost:8080/api/products?page=1&limit=10&category=fruits&minPrice=10000&maxPrice=50000
```

**API Client tự động:**
- ✅ Chuyển object thành query string
- ✅ Encode các ký tự đặc biệt
- ✅ Bỏ qua các giá trị undefined/null

---

## 📦 Ví dụ với Request Body

```typescript
// POST - Body data tự động JSON.stringify
await post('/api/products', {
  name: 'Apple',
  price: 50000,
  category: 'fruits',
  stock: 100
})

// Backend nhận được:
{
  "name": "Apple",
  "price": 50000,
  "category": "fruits",
  "stock": 100
}
```

**API Client tự động:**
- ✅ JSON.stringify(body)
- ✅ Set header `Content-Type: application/json`
- ✅ Encode body đúng format

---

## 🎨 Visual: Component sử dụng nhiều API

```
┌─────────────────────────────────────────────────┐
│           Dashboard Component                    │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  componentDidMount() {                   │  │
│  │    this.loadData()                       │  │
│  │  }                                       │  │
│  │                                          │  │
│  │  async loadData() {                      │  │
│  │    ┌────────────────────────┐           │  │
│  │    │ getProducts()          │───┐       │  │
│  │    └────────────────────────┘   │       │  │
│  │    ┌────────────────────────┐   │       │  │
│  │    │ getOrders()            │───┼───┐   │  │
│  │    └────────────────────────┘   │   │   │  │
│  │    ┌────────────────────────┐   │   │   │  │
│  │    │ getProfile()           │───┼───┼─┐ │  │
│  │    └────────────────────────┘   │   │ │ │  │
│  │         │         │         │    │   │ │ │  │
│  │         ▼         ▼         ▼    ▼   ▼ ▼ │  │
│  │    ┌─────────────────────────────────┐  │  │
│  │    │      API Client                 │  │  │
│  │    │  (Gửi 3 requests song song)    │  │  │
│  │    └─────────────────────────────────┘  │  │
│  │         │         │         │            │  │
│  │         ▼         ▼         ▼            │  │
│  │    products   orders    profile         │  │
│  │                                          │  │
│  │    this.setState({ products, ... })     │  │
│  │  }                                       │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 🎓 Tóm tắt key points

1. **API Client = Tool để gọi API dễ dàng**
   - Không cần viết fetch thủ công
   - Có sẵn các hàm: get, post, put, del

2. **Service = Tập hợp các API của 1 resource**
   - productService: tất cả API về products
   - orderService: tất cả API về orders
   - authService: tất cả API về authentication

3. **Component = UI, gọi Service**
   - Import function từ Service
   - Gọi với await
   - Xử lý kết quả (resultCd = 0 là success)

4. **Flow: Component → Service → API Client → Backend**

5. **Mỗi Service dùng API Client để:**
   - GET: Lấy dữ liệu
   - POST: Tạo mới
   - PUT: Cập nhật
   - DELETE: Xóa

---

Hiểu rồi chứ? 🎉
