# Gen-AI Documentation

> Thư mục này chứa tài liệu và tools hỗ trợ việc generate components tự động bằng AI.

## 📚 Tài liệu

### [GEN_PROMPT.md](./GEN_PROMPT.md) - Main Generator Template
File template chính để gửi cho AI khi muốn generate component mới.

**Cách dùng:**
1. Chuẩn bị design file (optional)
2. Gửi lệnh cho AI với format:
   ```
   Design: [path to design file]
   Gen: [Screen Name]
   ```

### [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick Command Reference
Tham chiếu nhanh các lệnh và format thường dùng.

**Nội dung:**
- ⚡ Lệnh generate nhanh
- 📋 Quy trình 3 bước
- 🔄 Transform rules
- ✅ Checklist

### [DESIGN_FILE_EXAMPLE.md](./DESIGN_FILE_EXAMPLE.md) - Design File Template
File mẫu về format của design file mà bạn cung cấp cho AI.

**Sử dụng:**
1. Copy file này
2. Rename: `design.md`
3. Chỉnh sửa theo design của bạn
4. Đặt vào folder component

### [GEN_CHECKLIST.md](./GEN_CHECKLIST.md) - Validation Checklist
Checklist đầy đủ để validate component sau khi generate.

**Nội dung:**
- ✅ Pre-generation checks
- ✅ Post-generation validation
- ✅ Manual testing steps
- 🔧 Common issues & fixes

### [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) - Known Issues & Workarounds
Các vấn đề đã biết và cách giải quyết.

## 🚀 Quick Start

### Workflow 1: Generate với Design File

```bash
# Bước 1: Copy design file
# Copy HTML/design vào: src/components/product-detail/design.md

# Bước 2: Gửi lệnh cho AI
Design: G:\SWP391\fruit-shop-manager\Frontend\src\components\product-detail\design.md
Gen: Product Detail

# Bước 3: Nhận output
# AI tạo 3 files:
#   - ProductDetail.tsx
#   - ProductDetailView.tsx
#   - ProductDetail.css
```

### Workflow 2: Generate KHÔNG có Design File

```bash
# Gửi lệnh cho AI
GEN: shopping-cart
Description: Shopping cart với products list, quantity, total, checkout button

# AI tự tạo layout dựa trên Description và RULE_LAYOUT.md
```

## 📁 File Structure

```
gen-AI/
├── README.md                    ← Bạn đang đọc file này
├── GEN_PROMPT.md               ← Main template (gửi cho AI)
├── QUICK_REFERENCE.md          ← Quick reference
├── DESIGN_FILE_EXAMPLE.md      ← Design file template
├── GEN_CHECKLIST.md            ← Validation checklist
├── KNOWN_ISSUES.md             ← Known issues
└── check_generated.js          ← Automated validation script
```

## 🎯 Command Format

### Có Design File
```
Design: G:\SWP391\fruit-shop-manager\Frontend\src\components\{{screen}}\design.md
Gen: {{Screen Name}}
```

### Không có Design File
```
GEN: {{screen-name}}
Description: {{mô tả màn hình}}
```

## 📋 Quy trình đầy đủ

### 1. Chuẩn bị

**Option A: Có Design File**
1. Nhận HTML/design từ tools (Figma, v2, etc.)
2. Copy vào `src/components/{{screen-name}}/design.md`
3. Verify format (xem DESIGN_FILE_EXAMPLE.md)

**Option B: Không có Design File**
1. Viết mô tả chi tiết màn hình
2. List các features/components cần có

### 2. Generate

**Gửi lệnh cho AI:**
```
Design: G:\SWP391\fruit-shop-manager\Frontend\src\components\product-detail\design.md
Gen: Product Detail
```

Hoặc:
```
GEN: product-detail
Description: Màn chi tiết SP với carousel, info, Add to Cart
```

### 3. Validate

**Manual check:**
1. Mở 3 files được tạo
2. Check imports, types, structure
3. Run `npm run dev`
4. Test trong browser

**Automated check:**
```bash
node src/gen-AI/check_generated.js product-detail
```

### 4. Test

1. **Visual:** Check layout trên mobile/tablet/desktop
2. **Functionality:** Test forms, navigation, API calls
3. **Accessibility:** Tab navigation, ARIA labels
4. **Responsive:** Test breakpoints (< 768px, 1024px+)

## 🎨 Design System (Auto-apply)

Khi generate, AI tự động áp dụng design system của project:

**Colors:**
- Primary: `#33f20d` (green)
- Text: `#121811` (dark)
- Muted: `#678a60` (gray-green)
- Background: `#f6f8f5` (light)
- Border: `#dde6db` (subtle)
- Error: `#c00` (red)

**Typography:**
- Font: Plus Jakarta Sans
- Title: 1.875rem - 3rem, bold
- Body: 0.875rem - 1rem
- Small: 0.875rem

**Spacing:**
- 0.5rem, 1rem, 1.5rem, 2rem, 3rem

**Border Radius:**
- Small: 4px - 8px
- Medium: 12px - 16px
- Pill: 9999px

**Responsive:**
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

## 🔧 Transform Rules

### HTML → React
```html
<!-- Design file -->
<div class="card">
  <h2>Title</h2>
</div>
```

```tsx
// AI output
<div className="card">
  <h2>{title}</h2>
</div>
```

### Static → Dynamic
```html
<!-- Design file -->
<p class="price">$99.99</p>
<button>Add to Cart</button>
```

```tsx
// AI output
<p className="price">{product.price}</p>
<button onClick={onAddToCart} disabled={loading}>
  {loading ? 'Adding...' : 'Add to Cart'}
</button>
```

### Forms
```html
<!-- Design file -->
<input type="email" placeholder="Email">
```

```tsx
// AI output
<input 
  type="email"
  value={email}
  onChange={(e) => onEmailChange(e.target.value)}
  placeholder="Email"
  aria-invalid={!!errors.email}
  disabled={loading}
/>
```

## ✅ Validation Checklist (Quick)

- [ ] 3 files tạo đúng chỗ (Container, View, CSS)
- [ ] View import CSS
- [ ] Container render View với typed props
- [ ] Semantic HTML (`<header>`, `<main>`, `<footer>`)
- [ ] Colors theo design system
- [ ] Responsive (mobile/tablet/desktop)
- [ ] Accessibility (labels, ARIA, keyboard nav)
- [ ] Navigation works (useNavigate)
- [ ] API integration (if applicable)
- [ ] No TypeScript errors

## 🆘 Troubleshooting

**Q: AI không tìm thấy design file?**
- ✅ Check đường dẫn đầy đủ (absolute path)
- ✅ File extension là `.md`
- ✅ File tồn tại trong folder

**Q: Layout không đúng design?**
- ✅ Check HTML structure trong design file
- ✅ Verify CSS classes
- ✅ Design notes đầy đủ

**Q: TypeScript errors?**
- ✅ Check Props interface
- ✅ Verify imports
- ✅ Run `npm run dev`

**Q: CSS không áp dụng?**
- ✅ View phải import CSS
- ✅ Check class names
- ✅ Clear browser cache

## 📚 Tham khảo thêm

- [../SOURCE_RULES.md](../SOURCE_RULES.md) - Project conventions
- [../components/RULE_LAYOUT.md](../components/RULE_LAYOUT.md) - Layout patterns
- [DEBUG_GUIDE.md](../../DEBUG_GUIDE.md) - Debug instructions

## 🔄 Updates

**2026-02-26:**
- ✅ Thêm workflow generate từ design file
- ✅ Thêm QUICK_REFERENCE.md
- ✅ Thêm DESIGN_FILE_EXAMPLE.md
- ✅ Update GEN_CHECKLIST.md với design file validation
- ✅ Transform rules từ HTML → React

**2026-02-25:**
- ✅ Update design system (split-screen, sidebar layouts)
- ✅ Thêm navigation patterns (React Router)
- ✅ Thêm API integration patterns

---

**Tip:** Bắt đầu bằng QUICK_REFERENCE.md để hiểu nhanh, sau đó xem GEN_PROMPT.md để biết chi tiết! 🚀
