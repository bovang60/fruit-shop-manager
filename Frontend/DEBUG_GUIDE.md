# 🐛 HƯỚNG DẪN DEBUG - React + Vite Project

## 🎯 Mục lục

1. [Debug bằng Console.log](#1-debug-bằng-consolelog)
2. [Debug bằng VS Code Debugger](#2-debug-bằng-vs-code-debugger)
3. [Debug bằng Browser DevTools](#3-debug-bằng-browser-devtools)
4. [Debug API Calls](#4-debug-api-calls)
5. [Troubleshooting](#5-troubleshooting)

---

## 1️⃣ Debug bằng Console.log

### ✅ Cách nhanh nhất và đơn giản nhất

### Trong Component:

```typescript
// Login.tsx
const handleSubmit = async (e: React.FormEvent) => {
  console.log('🟢 START - Form submitted')
  console.log('📝 Input values:', { email, password })
  
  try {
    const result = await login({ email, password })
    console.log('✅ SUCCESS - API response:', result)
    
    if (result.resultCd === 0) {
      console.log('🎉 Login successful!')
      console.log('👤 User data:', result.data)
    }
  } catch (error) {
    console.error('❌ ERROR:', error)
  }
}
```

### Xem Console:

1. Mở trình duyệt (Chrome/Edge/Firefox)
2. Nhấn **F12** hoặc **Ctrl + Shift + I** (Windows)
3. Chọn tab **Console**
4. Thực hiện action trong app
5. Xem logs (có màu và icon dễ nhìn)

### Tips:

```typescript
// Log với style
console.log('%c API Called', 'color: blue; font-weight: bold', data)

// Log object dạng table
console.table(users)

// Group logs
console.group('Login Flow')
console.log('Step 1: Validate')
console.log('Step 2: Call API')
console.groupEnd()

// Timer
console.time('API Call')
await callApi('/api/users/login', data)
console.timeEnd('API Call') // → API Call: 234ms
```

---

## 2️⃣ Debug bằng VS Code Debugger

### Setup (đã làm sẵn):

✅ File `.vscode/launch.json` đã được tạo

### Cách sử dụng:

#### Bước 1: Start Dev Server

```bash
npm run dev
```

#### Bước 2: Set Breakpoint

- Mở file cần debug (VD: `Login.tsx`)
- Click vào **số dòng bên trái** → Xuất hiện **chấm đỏ** (breakpoint)
- Hoặc viết `debugger;` trong code:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  debugger; // ← Code sẽ dừng ở đây
  
  console.log('Email:', email)
}
```

#### Bước 3: Start Debugging

**Cách 1:**
- Nhấn **F5**

**Cách 2:**
- Menu: **Run** > **Start Debugging**

**Cách 3:**
- Sidebar: Click icon **Run and Debug** (Ctrl+Shift+D)
- Chọn **"Launch Chrome against localhost"**
- Click nút ▶️ xanh

#### Bước 4: Debug

Khi code dừng tại breakpoint:

**VS Code UI:**
- **Variables panel** (bên trái): Xem tất cả biến
- **Watch panel**: Theo dõi biến cụ thể
- **Call Stack**: Xem function đang gọi
- **Debug Console**: Chạy code tạm thời

**Toolbar debug:**
- **Continue (F5)**: Chạy tiếp đến breakpoint kế
- **Step Over (F10)**: Chạy dòng kế
- **Step Into (F11)**: Vào trong function
- **Step Out (Shift+F11)**: Ra khỏi function
- **Restart (Ctrl+Shift+F5)**: Restart debug
- **Stop (Shift+F5)**: Dừng debug

#### Ví dụ:

```typescript
async function login(data: LoginRequest) {
  debugger; // ← Dừng ở đây
  
  const result = await callApi('/api/users/login', data);
  // ↑ Nhấn F11 để vào trong callApi()
  
  debugger; // ← Dừng ở đây sau khi API trả về
  
  if (result.resultCd === 0) {
    // ← Nhấn F10 để chạy từng dòng
    console.log('Success')
  }
}
```

---

## 3️⃣ Debug bằng Browser DevTools

### A. Network Tab - Debug API Calls

#### Mở DevTools:
- **F12** hoặc **Ctrl + Shift + I**
- Chọn tab **Network**

#### Sử dụng:

1. **Reload page**: Để bắt đầu recording
2. **Perform action**: Login, register, etc.
3. **View requests**: Danh sách request sẽ xuất hiện

#### Xem chi tiết request:

Click vào request → Xem các tab:

**Tab Headers:**
```
General:
  Request URL: http://localhost:8080/api/users/login
  Request Method: POST
  Status Code: 200 OK

Request Headers:
  Content-Type: application/json
  Accept: application/json
```

**Tab Payload:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Tab Response:**
```json
{
  "resultCd": 0,
  "message": "Login successful",
  "data": {
    "userId": 10,
    "fullName": "Nguyen Van A"
  }
}
```

**Tab Preview:** Xem response dạng tree (dễ đọc hơn)

#### Filter:

- **XHR**: Chỉ xem API calls
- **Fetch/XHR**: Xem fetch requests
- **JS**: Xem JavaScript files

### B. Sources Tab - Debug JavaScript

1. Mở **F12** > **Sources** tab
2. Tìm file: `webpack://` > `src/` > `components/` > `login/` > `Login.tsx`
3. Click số dòng để set breakpoint
4. Perform action → Code sẽ pause
5. Dùng toolbar:
   - **Step Over (F10)**
   - **Step Into (F11)**
   - **Resume (F8)**

### C. Console Tab - Run Code

Trong tab Console, bạn có thể:

```javascript
// Xem biến global
window.location.href

// Test function
JSON.stringify({ test: 'data' })

// Access React component (với React DevTools)
$r.state
$r.props
```

---

## 4️⃣ Debug API Calls

### API Client đã có debug logging:

File `src/utils/apiClient.ts` đã được update với logging:

```typescript
// Khi gọi API, sẽ tự động log:
🚀 [POST] /api/users/login { body: { email: "...", password: "..." } }
📡 [200] /api/users/login
✅ Response from /api/users/login: { resultCd: 0, data: {...} }

// Nếu lỗi:
❌ API call failed [POST] /api/users/login: Error: ...
```

### Xem logs trong Console:

1. Mở **F12** > **Console**
2. Perform action (login, register, etc.)
3. Xem logs với icon dễ phân biệt:
   - 🚀 = Request được gửi
   - 📡 = Response status
   - ✅ = Success
   - ❌ = Error

### Debug trong Component:

```typescript
// Login.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  console.log('🟢 [Login] START')
  console.log('📝 [Login] Input:', { email, password })
  
  setLoading(true)
  
  try {
    console.log('🚀 [Login] Calling API...')
    const result = await login({ email, password })
    
    console.log('✅ [Login] API Success:', result)
    
    if (result.resultCd === 0) {
      console.log('🎉 [Login] Login successful!')
      console.log('👤 [Login] User:', result.data)
      saveUserToStorage(result.data!)
    } else {
      console.warn('⚠️ [Login] Business error:', result.message)
    }
  } catch (error) {
    console.error('❌ [Login] Error:', error)
  } finally {
    console.log('🔵 [Login] END')
    setLoading(false)
  }
}
```

---

## 5️⃣ Troubleshooting

### ❓ Problem: Không thấy logs trong Console

**Solution:**
- Check filter: Đảm bảo không filter out "Info" logs
- Clear console: Click 🚫 để clear cũ
- Reload page: Ctrl+Shift+R (hard reload)

### ❓ Problem: Breakpoint không hoạt động

**Solution:**
- Đảm bảo dev server đang chạy (`npm run dev`)
- Reload browser sau khi set breakpoint
- Check source maps: Đảm bảo có trong `vite.config.ts`

### ❓ Problem: API call failed - CORS error

**Error trong Console:**
```
Access to fetch at 'http://localhost:8080/api/...' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
- Backend cần enable CORS
- Hoặc dùng proxy trong `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```

### ❓ Problem: API call failed - 404 Not Found

**Solution:**
- Check endpoint URL: `/api/users/login` (đúng không?)
- Check backend đang chạy: `http://localhost:8080`
- Check base URL trong `apiClient.ts`
- Xem Network tab để xem full URL được gọi

### ❓ Problem: State không update

**Debug:**
```typescript
const [count, setCount] = useState(0)

const handleClick = () => {
  console.log('Before:', count)
  setCount(count + 1)
  console.log('After:', count) // ← Vẫn cũ! (React batching)
}

// Xem update:
useEffect(() => {
  console.log('Count updated:', count)
}, [count])
```

---

## 🎯 Quick Reference

### Shortcuts:

| Action | Shortcut |
|--------|----------|
| Open DevTools | F12 hoặc Ctrl+Shift+I |
| Open Console | Ctrl+Shift+J |
| Start Debug (VS Code) | F5 |
| Step Over | F10 |
| Step Into | F11 |
| Step Out | Shift+F11 |
| Continue | F8 |
| Hard Reload | Ctrl+Shift+R |

### Console Methods:

```javascript
console.log()      // Log thông thường
console.error()    // Log lỗi (đỏ)
console.warn()     // Log cảnh báo (vàng)
console.table()    // Log dạng table
console.group()    // Group logs
console.time()     // Bắt đầu timer
console.timeEnd()  // Kết thúc timer
```

### React DevTools:

Install extension:
- Chrome: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- Firefox: [React DevTools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

Sau khi install:
- Tab **⚛️ Components**: Xem React component tree, props, state
- Tab **⚛️ Profiler**: Profile performance

---

## 🚀 Best Practices

1. **Luôn log request/response khi develop**
2. **Dùng meaningful log messages** với icon/prefix
3. **Remove hoặc comment out logs trước khi commit**
4. **Dùng breakpoint thay vì nhiều console.log**
5. **Check Network tab khi API không hoạt động**
6. **Dùng React DevTools để debug component state**

---

## 📚 Tài liệu thêm

- [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [React DevTools](https://react.dev/learn/react-developer-tools)

---

**Happy Debugging! 🐛🔨**
