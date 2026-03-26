# GENERATOR PROMPT - Fruit Shop Manager (Updated 2026-02-26)

## Mục đích

Template này dùng để yêu cầu một AI/agent tạo màn hình React+TypeScript tuân theo quy ước dự án (container/view/css) và RULE_LAYOUT / SOURCE_RULES.

## Quy trình làm việc mới

### Bước 1: Chuẩn bị Design File

1. User nhận file HTML/design từ tool design (Figma, v2, etc.)
2. Copy file design vào thư mục component: `src/components/{{kebab-screen}}/design.md`
3. File design có thể chứa:
   - HTML markup
   - CSS styles
   - Mô tả layout
   - Screenshot/reference images

### Bước 2: Gửi lệnh Generate

Format lệnh:
```
Design: [đường dẫn tới file design]
Gen: [Tên màn hình]
```

Ví dụ:
```
Design: G:\SWP391\fruit-shop-manager\Frontend\src\components\home-page\design.md
Gen: Home Page
```

### Bước 3: AI thực hiện

1. Đọc file design từ đường dẫn
2. Parse HTML/CSS layout
3. Transform sang React components (Container + View + CSS)
4. Áp dụng design system của project
5. Tạo 3 files theo chuẩn

## Cách dùng nhanh

**Cách 1: Có sẵn design file**
```
Design: G:\SWP391\fruit-shop-manager\Frontend\src\components\product-detail\design.md
Gen: Product Detail
```

**Cách 2: Không có design file (AI tự tạo layout)**
```
GEN: product-detail
Description: Màn chi tiết sản phẩm với carousel ảnh, thông tin SP, nút Add to Cart
```

## Yêu cầu bắt buộc

### 0. Format của Design File (design.md)

Design file có thể chứa một hoặc nhiều trong các thành phần sau:

**A. HTML Markup:**
```html
<div class="product-detail-root">
  <header class="header-sticky">...</header>
  <main class="product-main">
    <div class="product-images">
      <div class="carousel">...</div>
    </div>
    <div class="product-info">...</div>
  </main>
</div>
```

**B. CSS Styles:**
```css
.product-detail-root {
  min-height: 100vh;
  background: #f6f8f5;
}
.product-main {
  display: flex;
  gap: 2rem;
}
```

**C. Mô tả Layout (Markdown):**
```markdown
## Layout Structure
- Header: Sticky header with logo and navigation
- Main: 2-column layout (60% images, 40% info)
- Images: Carousel with thumbnail navigation
- Info: Product name, price, description, Add to Cart button
```

**D. Design Notes:**
```markdown
## Design System
- Primary color: #33f20d
- Font: Plus Jakarta Sans
- Border radius: 8px for cards
- Responsive: Stack on mobile (< 768px)
```

**Quy tắc khi đọc design file:**
1. Ưu tiên HTML structure nếu có
2. Transform class names sang React components
3. Áp dụng design system của project (colors, fonts, etc.)
4. Giữ semantic HTML (`<header>`, `<main>`, `<section>`, etc.)
5. Tách logic vào Container, markup vào View

### 1. Cấu trúc file (3-file pattern)

Tạo 3 file trong thư mục `src/components/{{kebab-screen}}/`:

1. **{{PascalScreen}}.tsx** (Container)
   - Logic, state, validation, API calls
   - Import `useNavigate` từ `react-router-dom` nếu cần navigation
   - Import services từ `../../services/` nếu cần (authService, apiClient)
   - **KHÔNG** import CSS
   - Export default component

2. **{{PascalScreen}}View.tsx** (View)
   - Presentational component
   - Import `./{{PascalScreen}}.css`
   - Import Header/Footer từ `../common/header/Header` và `../common/footer/Footer`
   - Khai báo typed Props interface
   - Chỉ render markup, không có business logic

3. **{{PascalScreen}}.css** (Styles)
   - Component-scoped stylesheet
   - Class-based (NO CSS modules)
   - Follow design system (xem phần Design System bên dưới)

### 2. Pattern Container / View

**Container responsibilities:**
- State management (useState, useEffect)
- Form validation
- API integration (import từ `../../services/authService` hoặc `../../utils/apiClient`)
- Navigation (useNavigate từ react-router-dom)
- Error handling
- Render View với typed props

**View responsibilities:**
- Render UI markup only
- Import và sử dụng CSS
- Nhận props từ container
- Accessibility attributes (aria-*, role, etc.)

### 3. Layout Patterns

#### A. Split-Screen Layout (Login/Register/Auth screens)

Structure:
```tsx
<div className="{{screen}}-root">
  <header className="{{screen}}-header">
    <Header />
  </header>
  
  <main className="{{screen}}-main">
    {/* Left: Hero Section (Desktop only) */}
    <div className="{{screen}}-hero">
      <div className="hero-image">
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <h1 className="hero-title">Title Here</h1>
        <p className="hero-subtitle">Subtitle text here</p>
      </div>
    </div>
    
    {/* Right: Form Section */}
    <div className="{{screen}}-form-section">
      <div className="{{screen}}-form-container">
        {/* Form content */}
      </div>
    </div>
  </main>
  
  <footer className="{{screen}}-footer">
    <Footer />
  </footer>
</div>
```

CSS pattern:
- Mobile: Stack vertically (hero on top, form below)
- Desktop (≥1024px): Split 50/50 (hero left, form right)
- Hero: Background image with overlay
- Form: Centered, max-width 480px

#### B. Sidebar + Content Layout (Home/Product List screens)

Structure:
```tsx
<div className="home-root">
  <div className="home-header-sticky">
    <div className="home-header-container">
      <Header />
    </div>
  </div>
  
  <main className="home-main-layout">
    {/* Sidebar Filters */}
    <aside className="home-sidebar-filters">
      <div className="filters-sticky">
        {/* Filter sections */}
      </div>
    </aside>
    
    {/* Main Content */}
    <div className="home-content">
      {/* Products grid */}
    </div>
  </main>
  
  <footer className="home-footer">
    <Footer />
  </footer>
</div>
```

### 4. Design System & Class Names

#### Colors
- Primary (accent): `#33f20d` (green)
- Text: `#121811` (dark)
- Muted text: `#678a60` (green-gray)
- Background: `#f6f8f5` (light), `white` (cards)
- Border: `#dde6db` (light green-gray)
- Error: `#c00` (red)

#### Typography
- Font family: `'Plus Jakarta Sans', Inter, system-ui, -apple-system, 'Segoe UI', Roboto`
- Title: 1.875rem - 3rem, font-weight 700-900
- Body: 0.875rem - 1rem
- Muted: 0.875rem, color `#678a60`

#### Form Elements

**Field wrapper:**
```tsx
<div className="field">
  <label htmlFor="fieldId">Label</label>
  <input 
    id="fieldId"
    type="text"
    value={value}
    onChange={onChange}
    aria-invalid={!!error}
    aria-describedby={error ? 'fieldId-error' : undefined}
    disabled={loading}
  />
  {error && <span id="fieldId-error" className="error-message">{error}</span>}
</div>
```

**Input styles:**
- Height: 3rem
- Border-radius: 9999px (pill shape)
- Border: 1px solid #dde6db
- Padding: 0 1rem
- Font-size: 0.875rem

**Buttons:**

Primary button (CTA):
```tsx
<button type="submit" className="primary" disabled={loading}>
  {loading ? 'Loading...' : 'Button Text'}
</button>
```

CSS:
```css
button.primary {
  width: 100%;
  height: 3rem;
  border-radius: 9999px;
  border: none;
  background: #33f20d;
  color: #121811;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

button.primary:hover:not(:disabled) {
  background: #2dd60c;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(51, 242, 13, 0.3);
}

button.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #a0a0a0;
}
```

Secondary button:
```css
button.secondary {
  border: 2px solid #33f20d;
  background: white;
  color: #33f20d;
  /* same dimensions as primary */
}
```

Link button:
```css
.link-btn {
  background: transparent;
  border: none;
  color: #33f20d;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}
```

#### Error Display

General error (top of form):
```tsx
{errors.general && (
  <div className="error-message" style={{
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '4px',
    color: '#c00'
  }}>
    {errors.general}
  </div>
)}
```

Field error:
```tsx
<span className="error-message">{error}</span>
```

CSS:
```css
.error-message {
  font-size: 0.875rem;
  color: #c00;
  margin-top: 0.25rem;
}
```

#### Products Grid

Modern product card:
```tsx
<div className="modern-products-grid">
  <div className="modern-product-card">
    <div className="product-image-wrap">
      <div className="product-image" style={{backgroundImage: `url('${img}')`}} />
      {tag && <div className="product-tag">{tag}</div>}
      <div className="product-favorite">❤</div>
    </div>
    <div className="product-info">
      <div className="product-details">
        <div>
          <p className="product-name-modern">{name}</p>
          {desc && <p className="product-desc">{desc}</p>}
        </div>
        <p className="product-price-modern">{price}</p>
      </div>
      <button className="add-to-cart-btn">Add to Cart</button>
    </div>
  </div>
</div>
```

Grid CSS:
```css
.modern-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

### 5. Navigation Pattern (React Router)

Container import:
```tsx
import { useNavigate } from 'react-router-dom'

export default function MyComponent() {
  const navigate = useNavigate()
  
  const handleGoToLogin = () => {
    navigate('/login')
  }
  
  const handleSuccess = () => {
    navigate('/home')
  }
  
  // Pass to view
  return <MyComponentView onGoToLogin={handleGoToLogin} />
}
```

Common routes:
- `/` → redirect to `/login`
- `/login` → Login screen
- `/register` → Register screen
- `/home` → Home/Product list
- `/products/:id` → Product detail

### 6. API Integration Pattern

**Import API client:**
```tsx
import { callApi } from '../../utils/apiClient'
// OR import specific service
import { login, register } from '../../services/authService'
```

**API call pattern:**
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!validate()) return
  
  setLoading(true)
  setErrors({})
  
  try {
    const result = await login({ email, password })
    
    if (result.resultCd === 0 && result.data) {
      // Success
      saveUserToStorage(result.data)
      navigate('/home')
    } else {
      // Business error
      setErrors({ general: result.message || 'Operation failed' })
    }
  } catch (error) {
    console.error('Error:', error)
    setErrors({ general: 'An error occurred. Please try again!' })
  } finally {
    setLoading(false)
  }
}
```

**API Response format:**
```typescript
interface ApiResponse<T> {
  resultCd: 0 | 1  // 0 = success, 1 = error
  message?: string
  data: T | null
}
```

### 7. Message Display Pattern (Common Popup)

**⚠️ QUAN TRỌNG: KHÔNG dùng `alert()` - Dùng Common Popup Component**

Project có sẵn common popup component với 4 loại thông báo:
- **Notice** (xanh dương): Thông báo thông thường
- **Confirm** (xanh lá): Xác nhận hành động
- **Error** (đỏ): Thông báo lỗi
- **Warning** (vàng): Cảnh báo

#### Import và Setup

**Container component:**
```tsx
import { usePopup } from '../common/popup'

export default function MyComponent() {
  const { showNotice, showConfirm, showError, showWarning } = usePopup()
  
  // Sử dụng popup methods
}
```

#### Usage Examples

**1. Notice (Success message):**
```tsx
const handleSubmit = async () => {
  try {
    const result = await saveData(data)
    if (result.resultCd === 0) {
      showNotice('Đã lưu thành công!', 'Thành công')
      navigate('/home')
    }
  } catch (error) {
    showError('Có lỗi xảy ra!')
  }
}
```

**2. Confirm (Before destructive action):**
```tsx
const handleDelete = (id: number) => {
  showConfirm(
    'Bạn có chắc chắn muốn xóa? Thao tác này không thể hoàn tác!',
    async () => {
      // Logic khi user click Xác nhận
      try {
        await deleteItem(id)
        showNotice('Đã xóa thành công!')
        refreshList()
      } catch (error) {
        showError('Không thể xóa. Vui lòng thử lại!')
      }
    },
    'Xác nhận xóa',
    () => {
      // Optional: Logic khi user click Hủy
      console.log('User cancelled')
    }
  )
}
```

**3. Error (API/Validation errors):**
```tsx
const handleLogin = async () => {
  try {
    const result = await login(email, password)
    if (result.resultCd === 0) {
      navigate('/home')
    } else {
      // Show business error from API
      showError(result.message || 'Đăng nhập thất bại')
    }
  } catch (error) {
    // Show network/system error
    showError('Không thể kết nối đến server. Vui lòng thử lại!')
  }
}
```

**4. Warning (Important notice):**
```tsx
const handleSubmit = () => {
  if (stockLevel < 10) {
    showWarning('Số lượng tồn kho thấp. Vui lòng kiểm tra!', 'Cảnh báo tồn kho')
  }
  // Continue with submission
}
```

#### API Methods

```typescript
// Notice: showNotice(message: string, title?: string)
showNotice('Đã thêm vào giỏ hàng!', 'Thành công')
showNotice('Thao tác hoàn tất!')

// Confirm: showConfirm(message, onConfirm, title?, onCancel?)
showConfirm('Bạn có chắc?', () => { /* confirm logic */ })
showConfirm('Xóa item?', handleDelete, 'Xác nhận', handleCancel)

// Error: showError(message: string, title?: string)
showError('Email không hợp lệ!', 'Lỗi đăng nhập')
showError('Có lỗi xảy ra!')

// Warning: showWarning(message: string, title?: string)
showWarning('Tài khoản sắp hết hạn', 'Cảnh báo')
showWarning('Vui lòng kiểm tra lại thông tin')
```

#### When to use each type:

- **Notice**: Success operations, information messages
  - "Đã lưu thành công!"
  - "Đã thêm vào giỏ hàng!"
  - "Cập nhật hoàn tất!"

- **Confirm**: Before destructive or important actions
  - Delete operations
  - Submit forms with sensitive data
  - Status changes (approve, reject, suspend)

- **Error**: Errors, validation failures, API errors
  - API errors (resultCd === 1)
  - Network errors (catch block)
  - Validation errors
  - "Email không hợp lệ!"

- **Warning**: Important notices that aren't errors
  - Low stock warnings
  - Account expiration notices
  - Data inconsistencies

#### ❌ KHÔNG làm:
```tsx
// ❌ WRONG: Dùng alert()
alert('Đã lưu thành công!')
alert('Có lỗi xảy ra!')

// ❌ WRONG: Dùng confirm()
if (confirm('Bạn có chắc?')) { ... }
```

#### ✅ Đúng:
```tsx
// ✅ CORRECT: Dùng popup
showNotice('Đã lưu thành công!')
showError('Có lỗi xảy ra!')
showConfirm('Bạn có chắc?', () => { ... })
```

#### Full Example Pattern:

```tsx
import { usePopup } from '../common/popup'
import { deleteProduct } from '../../services/productService'

export default function ProductManagement() {
  const { showNotice, showConfirm, showError } = usePopup()
  const [products, setProducts] = useState<Product[]>([])

  const handleDelete = (id: number) => {
    showConfirm(
      `Bạn có chắc chắn muốn xóa sản phẩm này?`,
      async () => {
        try {
          const result = await deleteProduct(id)
          if (result.resultCd === 0) {
            showNotice('Đã xóa sản phẩm thành công!')
            loadProducts() // Refresh list
          } else {
            showError(result.message || 'Không thể xóa sản phẩm')
          }
        } catch (error) {
          console.error('Delete error:', error)
          showError('Có lỗi xảy ra. Vui lòng thử lại!')
        }
      },
      'Xác nhận xóa'
    )
  }

  const handleAdd = async (data: ProductDto) => {
    try {
      const result = await createProduct(data)
      if (result.resultCd === 0) {
        showNotice('Đã thêm sản phẩm thành công!', 'Thành công')
        loadProducts()
      } else {
        showError(result.message || 'Không thể thêm sản phẩm')
      }
    } catch (error) {
      showError('Lỗi kết nối. Vui lòng thử lại!')
    }
  }

  return <ProductManagementView onDelete={handleDelete} onAdd={handleAdd} />
}
```

### 8. Validation Pattern

### 8. Validation Pattern

Client-side validation:
```tsx
const validate = (): boolean => {
  const newErrors: Record<string, string> = {}
  
  if (!email.trim()) {
    newErrors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = 'Email is invalid'
  }
  
  if (!password) {
    newErrors.password = 'Password is required'
  } else if (password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters'
  }
  
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

### 9. Responsive Rules

### 9. Responsive Rules

**Mobile-first approach:**
- Base styles: Mobile (< 768px)
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

**Media queries:**
```css
/* Desktop: Split-screen layout */
@media (min-width: 1024px) {
  .login-main {
    flex-direction: row;
  }
  
  .login-hero {
    display: block;
    width: 50%;
  }
  
  .login-form-section {
    width: 50%;
  }
}
```

### 10. Accessibility Requirements

- Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`
- All inputs have `<label>` with matching `htmlFor`
- Error states: `aria-invalid` and `aria-describedby`
- Buttons: explicit `type` attribute
- Images: `alt` text (or use background-image for decorative)
- Focus states: visible focus indicators
- Keyboard navigation: proper tab order

### 11oard navigation: proper tab order

### 10. TypeScript Types

**View Props:**
```typescript
export type Props = {
  // State values
  email: string
  password: string
  loading: boolean
  errors: Record<string, string>
  
  // Callbacks
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onGoToRegister?: () => void
}
```

**Data models:**
```typescript
type Product = {
  id: number
  name: string
  price: string
  img?: string
  desc?: string
  tag?: string
}

type User = {
  userId: number
  email: string
  fullName: string
  phoneNumber?: string
}
```

## Deliverable

### Khi generate với Design File:

**Input:**
```
Design: G:\SWP391\fruit-shop-manager\Frontend\src\components\product-detail\design.md
Gen: Product Detail
```

**Process:**
1. Đọc file `design.md` từ đường dẫn
2. Parse HTML structure và CSS styles
3. Transform sang React components theo patterns của project
4. Áp dụng design system (colors, fonts, spacing)
5. Tạo 3 files output

**Output:**
- `src/components/product-detail/ProductDetail.tsx` (container)
  - State management, API calls, business logic
  - Import useNavigate nếu cần
  - Không import CSS
  
- `src/components/product-detail/ProductDetailView.tsx` (view)
  - Presentational component
  - Import `./ProductDetail.css`
  - Import Header/Footer
  - Render markup từ design file
  
- `src/components/product-detail/ProductDetail.css` (styles)
  - Transform CSS từ design file
  - Áp dụng design system của project
  - Responsive breakpoints

### Khi generate KHÔNG có Design File:

**Input:**
```
GEN: product-detail
Description: Màn chi tiết sản phẩm với carousel ảnh, description, Add to Cart
```

**Output:** 
Giống như trên nhưng AI tự tạo layout dựa trên Description và RULE_LAYOUT.md

## Ví dụ mapping

- `{{kebab-screen}}` → `product-detail`
- `{{PascalScreen}}` → `ProductDetail`
- File design → `src/components/product-detail/design.md`

## Ví dụ lệnh đầy đủ

### Ví dụ 1: Generate với Design File

**Preparation:**
```bash
# User đã copy design file vào:
G:\SWP391\fruit-shop-manager\Frontend\src\components\product-detail\design.md
```

**Command:**
```
Design: G:\SWP391\fruit-shop-manager\Frontend\src\components\product-detail\design.md
Gen: Product Detail
```

**AI sẽ làm:**
1. Đọc `design.md`
2. Parse HTML/CSS
3. Tạo 3 files:
   - `ProductDetail.tsx`
   - `ProductDetailView.tsx`
   - `ProductDetail.css`

### Ví dụ 2: Generate với Home Page (có design)

**Command:**
```
Design: G:\SWP391\fruit-shop-manager\Frontend\src\components\home-page\design.md
Gen: Home Page
```

**Design file içinde có:**
- HTML structure với sidebar filters + products grid
- CSS styles cho layout
- Responsive breakpoints

**AI output:**
- Transform HTML sang React JSX
- Tách logic vào `Home.tsx` (pagination, search, filters)
- UI vào `HomeView.tsx`
- Styles vào `Home.css`

### Ví dụ 3: Generate KHÔNG có design (fallback mode)

**Command:**
```
GEN: cart
Description: Shopping cart với danh sách SP, quantity selector, total price, checkout button
```

**AI sẽ:**
- Tự tạo layout dựa trên Description
- Follow RULE_LAYOUT.md patterns
- Áp dụng design system

## Quy tắc Transform từ Design File

### 1. HTML → React JSX

**Design file (HTML):**
```html
<div class="product-detail-root">
  <div class="product-images">
    <img src="image.jpg" alt="Product">
  </div>
</div>
```

**Transform to View (JSX):**
```tsx
<div className="product-detail-root">
  <div className="product-images">
    <img src={product.image} alt={product.name} />
  </div>
</div>
```

### 2. Static → Dynamic

**Design file:**
```html
<h1>Product Name</h1>
<p class="price">$99.99</p>
```

**Transform to:**
```tsx
<h1>{product.name}</h1>
<p className="price">{product.price}</p>
```

### 3. Forms → Controlled Components

**Design file:**
```html
<input type="email" placeholder="Email">
<button>Submit</button>
```

**Transform to:**
```tsx
<input 
  type="email" 
  value={email}
  onChange={(e) => onEmailChange(e.target.value)}
  placeholder="Email"
/>
<button type="submit" onClick={onSubmit}>Submit</button>
```

### 4. CSS Classes → Project Convention

**Design file classes:**
```css
.product-card { ... }
.btn-primary { ... }
```

**Transform to project convention:**
```css
.modern-product-card { ... }
button.primary { ... }
```

### 5. Colors → Design System

**Design file:**
```css
background: #00ff00;
color: #000;
```

**Transform to:**
```css
background: #33f20d; /* Project primary color */
color: #121811; /* Project text color */
```

## Ghi chú

### Khi có Design File:
- **Ưu tiên:** Layout và structure từ design file
- **Áp dụng:** Design system của project (colors, fonts, spacing)
- **Giữ nguyên:** Semantic structure, accessibility
- **Transform:** Static content → Dynamic props

### Khi KHÔNG có Design File:
- Follow `src/SOURCE_RULES.md` và `src/components/RULE_LAYOUT.md`
- Sử dụng patterns từ các màn có sẵn (Login, Register, Home)
- Mock API calls nếu cần
- Responsive mobile-first

### Best Practices:
- Luôn kiểm tra file design trước khi gen
- Validate HTML structure hợp lệ
- Test responsive trên các breakpoints
- Đảm bảo accessibility (aria-*, semantic HTML)
- Remove debug logs trước production

## Maintenance

**Updated: 2026-02-26**
- Thêm workflow mới: Generate từ Design File
- Thêm transform rules (HTML → React, Static → Dynamic)
- Thêm ví dụ đầy đủ với design file
- Giữ nguyên backward compatibility (GEN: command vẫn hoạt động)

Kết thúc template.
