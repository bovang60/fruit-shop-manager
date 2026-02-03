# Home page layout specification

Mục tiêu: mô tả rõ ràng cấu trúc HTML/CSS và hành vi của màn Home để các thành viên trong nhóm (và AI trên máy họ) có thể tạo giao diện đồng nhất với layout hiện tại.

Nguyên tắc chung

- Thiết kế responsive, ưu tiên hiển thị 5 cột sản phẩm ở màn hình rộng (desktop). Trên màn nhỏ tự co về 1-3 cột.
- Sử dụng các class CSS cố định (dưới) làm "contract" giữa frontend và generator.

Component và class chính

- Header (dùng chung)

  - Component: `Header` (path: `src/components/common/header/Header.tsx`)
  - Root element class: `.site-header`
  - Brand class: `.brand`
  - Tabs container: `.nav-tabs`
  - Tab button: `.tab` (active: `.tab.active`)

- Topbar (search + cart)

  - Container class: `.topbar`
  - Search wrapper: `.search-wrap` containing `<input class="search" />`
  - Cart button: `.cart-btn` with optional `.badge` for count

- Content / Products

  - Content wrapper: `.content`
  - Products grid: `.products-grid` — grid cũng là contract: at >=1100px use `grid-template-columns: repeat(5, 1fr)`
  - Product card: `.product-card`
    - media box (image/icon): `.product-media`
    - product name: `.product-name`
    - meta area: `.product-meta` (contains `.price` and `.add` button)
  - Accessibility: product cards should be `<article>` with `role="article"` (optional) and meaningful alt text if images used.

- Sidebar (optional)

  - Container class: `.sidebar`
  - Used for quick stats, filters, or categories.

- Footer (dùng chung)
  - Component: `Footer` (path: `src/components/common/footer/Footer.tsx`)
  - Root element class: `.site-footer`

Data shapes (mock / contract)

- Product (JS/TS):
  - id: number
  - name: string
  - price: string (display-ready, e.g. `₫30,000`)
  - img?: string (relative/absolute URL)

Behavior & interactions

- Search: filter on product.name (client-side mock). Input class `.search` must trigger filtering.
- Add to cart: `.add` button — increments cart count (displayed in `.badge` inside `.cart-btn`).
- Tabs: `.tab` buttons are present for navigation; generator can mark one as `.tab.active`.

Styling notes / variables

- Colors and spacing are project-specific; prefer existing variables if available (e.g. `--accent`, `--muted`).
- Product card size: media box ~110px height, card padding ~1rem.

Breakpoints

- Desktop (>= 1100px): products grid = 5 columns.
- Tablet (>= 720px and <1100px): 2-3 columns (auto-fit).
- Mobile (<720px): 1 column.

Examples (DOM skeleton)

<main class="home-root">
  <div class="home-container">
    <header class="site-header">…</header>
    <div class="topbar">
      <div class="search-wrap"><input class="search" /></div>
      <div class="cart-wrap"><button class="cart-btn">🧺<span class="badge">2</span></button></div>
    </div>

    <section class="home-actions">
      <div class="home-main">
        <div class="card">
          <h2>Sản phẩm</h2>
          <div class="products-grid">
            <article class="product-card">
              <div class="product-media"><img src="..." alt="Táo đỏ"/></div>
              <h3 class="product-name">Táo đỏ</h3>
              <div class="product-meta"><span class="price">₫30,000</span><button class="add">Thêm</button></div>
            </article>
            <!-- repeat 25 items for 5x5 -->
          </div>
        </div>
      </div>

      <aside class="sidebar">…</aside>
    </section>

    <footer class="site-footer">…</footer>

  </div>
</main>

Notes for AI generators

- Respect class names exactly; they are used by CSS and expected by other components.
- Prioritize semantic HTML (header, main, section, article, footer).
- If images are missing, generator should fall back to an emoji or placeholder inside `.product-media`.
- Keep markup minimal and predictable: avoid injecting inline styles that break the responsive grid rules.

Maintenance

- When CSS class names change, update this contract file so all team members and automation stay in sync.

Contact

- Nếu cần chỉnh sửa contract (thêm class, hành vi), liên hệ kỹ thuật viên chịu trách nhiệm giao diện UI.

## Pagination (component contract)

Pagination là một component dùng chung nằm ở `src/components/common/pagination/Pagination.tsx` với style ở `Pagination.css`.

Class / API (contract):

- Root component: renders a block-level nav với class `.pagination` (component should be full-width and centered).
- Buttons: `.page-btn` cho các nút Prev/Next. Disabled state must use the disabled attribute.
- Page numbers: `.page-number` (the active page must include `.active` and set `aria-current="page"`).
- Ellipsis: rendered as plain text with `.dots` class when pages are collapsed.

Behaviour expectations:

- The component must accept `currentPage`, `totalPages`, `onPageChange(page)` and be idempotent (no internal side effects beyond callbacks).
- It must be safe to place the component inside any container; `.pagination` should center content using `justify-content: center`.
- If `totalPages <= 1`, the component may render nothing.

Usage example:

```tsx
import Pagination from "../common/pagination/Pagination";

<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>;
```

When updating layout rules, keep the pagination contract in sync so automation/AI generators place and style the component consistently.
