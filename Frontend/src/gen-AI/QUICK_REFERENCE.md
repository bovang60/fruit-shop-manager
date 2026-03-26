# Quick Reference - AI Generator Commands

## 🎯 Lệnh Generate với Design File

### Format
```
Design: [đường dẫn tới file design]
Gen: [Tên màn hình]
```

### Ví dụ
```
Design: G:\SWP391\fruit-shop-manager\Frontend\src\components\product-detail\design.md
Gen: Product Detail
```

## 📋 Quy trình nhanh

### Bước 1: Chuẩn bị design file
1. Nhận file HTML/design từ tools (Figma, v2, etc.)
2. Copy vào thư mục component
3. Đặt tên: `design.md`

**Ví dụ:**
```
G:\SWP391\fruit-shop-manager\Frontend\src\components\product-detail\design.md
```

### Bước 2: Gửi lệnh cho AI
```
Design: G:\SWP391\fruit-shop-manager\Frontend\src\components\product-detail\design.md
Gen: Product Detail
```

### Bước 3: Nhận output
AI tạo 3 files:
- ✅ `ProductDetail.tsx` (container - logic)
- ✅ `ProductDetailView.tsx` (view - UI)
- ✅ `ProductDetail.css` (styles)

## 📝 Design File Format

File design có thể chứa:

### 1. HTML Markup
```html
<div class="screen-root">
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</div>
```

### 2. CSS Styles
```css
.screen-root {
  background: #f6f8f5;
}
```

### 3. Layout Description (Markdown)
```markdown
## Layout
- Header: Sticky
- Main: 2-column (60% left, 40% right)
- Footer: Full width
```

### 4. Design Notes
```markdown
## Colors
- Primary: #33f20d
- Text: #121811

## Responsive
- Mobile: Stack vertically
- Desktop: 2-column layout
```

## 🔄 Lệnh Generate KHÔNG có design

### Format
```
GEN: [screen-name]
Description: [Mô tả màn hình]
```

### Ví dụ
```
GEN: shopping-cart
Description: Shopping cart với danh sách products, quantity selector, total price, checkout button
```

## 📂 Folder Structure

```
src/components/
  product-detail/
    ├── design.md              ← Design file (user cung cấp)
    ├── ProductDetail.tsx      ← AI generate (container)
    ├── ProductDetailView.tsx  ← AI generate (view)
    └── ProductDetail.css      ← AI generate (styles)
```

## ⚡ Mapping Rules

| Input | Output |
|-------|--------|
| `product-detail` | `ProductDetail` |
| `shopping-cart` | `ShoppingCart` |
| `user-profile` | `UserProfile` |

**Quy tắc:**
- Folder: kebab-case (`product-detail`)
- Component: PascalCase (`ProductDetail`)
- Files: `{Component}.tsx`, `{Component}View.tsx`, `{Component}.css`

## 🎨 Design System (Auto-applied)

AI sẽ tự động áp dụng:
- Colors: `#33f20d` (primary), `#121811` (text), `#678a60` (muted)
- Font: Plus Jakarta Sans
- Border radius: 8px - 16px
- Spacing: 0.5rem - 2rem increments
- Responsive: Mobile-first (< 768px, 1024px+)

## 🔧 Transform Rules

### HTML → React
```html
<!-- Design file -->
<div class="product-card">
  <h2>Product Name</h2>
</div>
```

```tsx
// AI output
<div className="product-card">
  <h2>{product.name}</h2>
</div>
```

### Static → Dynamic
```html
<!-- Design file -->
<p class="price">$99.99</p>
```

```tsx
// AI output
<p className="price">{product.price}</p>
```

### Buttons
```html
<!-- Design file -->
<button class="btn-primary">Submit</button>
```

```tsx
// AI output
<button type="submit" className="primary" onClick={onSubmit}>
  {loading ? 'Loading...' : 'Submit'}
</button>
```

## ✅ Checklist

Trước khi generate:
- [ ] Design file đã được copy vào đúng folder component
- [ ] File có extension `.md`
- [ ] Đường dẫn đầy đủ (absolute path)
- [ ] Tên màn hình đúng format (Product Detail, Shopping Cart, etc.)

Sau khi generate:
- [ ] Kiểm tra 3 files đã được tạo
- [ ] Check imports đúng (Header, Footer, CSS)
- [ ] Test responsive trên mobile/desktop
- [ ] Verify colors theo design system

## 🆘 Troubleshooting

**Vấn đề:** AI không tìm thấy design file
- ✅ Check đường dẫn đầy đủ và chính xác
- ✅ File extension phải là `.md`
- ✅ File tồn tại trong folder

**Vấn đề:** Layout không đúng design
- ✅ Check HTML structure trong design file
- ✅ Verify CSS classes và styles
- ✅ Design notes có đầy đủ không

**Vấn đề:** TypeScript errors
- ✅ Check Props interface
- ✅ Verify imports (useState, useNavigate, etc.)
- ✅ Run `npm run dev` để test

## 📚 Tham khảo thêm

- [GEN_PROMPT.md](./GEN_PROMPT.md) - Full documentation
- [DESIGN_FILE_EXAMPLE.md](./DESIGN_FILE_EXAMPLE.md) - Design file template
- [../SOURCE_RULES.md](../SOURCE_RULES.md) - Project conventions
- [../components/RULE_LAYOUT.md](../components/RULE_LAYOUT.md) - Layout patterns

---

**Quick Tip:** Copy DESIGN_FILE_EXAMPLE.md và chỉnh sửa theo design của bạn! 🚀
