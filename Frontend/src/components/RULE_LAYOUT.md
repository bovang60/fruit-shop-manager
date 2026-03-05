# Home page layout specification (Updated 2026-02-20)

Mục tiêu: mô tả rõ ràng cấu trúc HTML/CSS và hành vi của màn Home để các thành viên trong nhóm (và AI trên máy họ) có thể tạo giao diện đồng nhất với layout hiện tại.

## Nguyên tắc chung

- Thiết kế responsive hiện đại với sidebar filters bên trái
- Layout chính: **Sticky Header + Sidebar Filters (Left) + Main Content (Right)**
- Products grid: 3 cột ở desktop, tự động responsive trên màn nhỏ
- Sử dụng các class CSS cố định (dưới) làm "contract" giữa frontend và generator
- Font family: 'Plus Jakarta Sans' (Google Fonts)
- Primary color: `#33f20d` (green accent)
- Background: `#f6f8f5` (light), `#132210` (dark mode)

## Component và class chính

### 1. Sticky Header (dùng chung)

- Component: `Header` (path: `src/components/common/header/Header.tsx`)
- Container classes:
  - `.home-header-sticky` — sticky header wrapper with blur backdrop
  - `.home-header-container` — max-width container inside sticky header
- Root element class: `.site-header`
- Brand class: `.brand`
- Tabs container: `.nav-tabs`
- Tab button: `.tab` (active: `.tab.active`)

### 2. Main Layout

- Root class: `.home-root` — full page wrapper
- Layout container: `.home-main-layout` — flexbox container for sidebar + content
  - Max-width: 1280px
  - Display: flex (row on desktop, column on mobile)
  - Gap: 2rem

### 3. Sidebar Filters (Left)

- Container class: `.home-sidebar-filters`
  - Width: 256px (desktop), 100% (mobile)
  - Position: left side of main layout
- Sticky wrapper: `.filters-sticky` — keeps filters visible when scrolling
  - Position: sticky, top: 6rem

#### Filter Sections:

- **Category Filter**
  - Section wrapper: `.filter-section`
  - Title: `.filter-title` (uppercase, green accent)
  - Options container: `.filter-options`
  - Individual option: `.filter-option` (checkbox + label)

- **Price Range Filter**
  - Wrapper: `.price-range-wrap`
  - Slider: `.price-slider` (input type="range")
  - Labels: `.price-labels` (min/max display)

- **Origin Filter**
  - Same structure as Category Filter
  - Uses radio buttons instead of checkboxes

- **Organic Status**
  - Special highlighted option: `.filter-option-organic`
  - Background: rgba(51, 242, 13, 0.1) with green border

- **Apply Button**
  - Class: `.apply-filters-btn`
  - Style: full-width green button with shadow

### 4. Main Content (Right)

- Container class: `.home-content` — flex-1, main content area

#### Content Header:

- Wrapper: `.content-header` (flexbox, space-between)
- Title: `.content-title` (1.875rem, font-weight: 900)
- Subtitle: `.content-subtitle` (result count, green text)
- Actions: `.content-actions` (search + sort)
  - Search input: `.search-input`
  - Sort dropdown: `.sort-select`

#### Products Grid (Modern):

- Grid container: `.modern-products-grid`
  - Display: grid
  - Columns: repeat(auto-fill, minmax(280px, 1fr)) — responsive 3-column layout
  - Gap: 1.5rem

- Product card: `.modern-product-card`
  - Image wrapper: `.product-image-wrap` (aspect-ratio: 1)
    - Image: `.product-image` (background-image, with hover scale)
    - Placeholder: `.product-image-placeholder` (emoji fallback)
    - Tag: `.product-tag` (top-left badge, e.g., "NEW", "ORGANIC")
    - Favorite: `.product-favorite` (top-right heart icon, opacity on hover)
  - Info section: `.product-info`
    - Details: `.product-details` (name + price row)
      - Name: `.product-name-modern` (1.125rem, bold)
      - Description: `.product-desc` (small gray text)
      - Price: `.product-price-modern` (1.25rem, green, bold)
    - Button: `.add-to-cart-btn` (full-width, hover turns green)

### 5. Extra Sections (Below Grid)

- Wrapper: `.extra-sections` (margin-top: 4rem)

#### Newest Arrivals:

- Section: `.section-arrivals`
- Header: `.section-header` (title + navigation)
- Title: `.section-title`
- Navigation: `.section-nav` (left/right arrows)
  - Button: `.nav-btn` (40px circle button)
- Scroll container: `.horizontal-scroll` (overflow-x: auto, no scrollbar)
- Mini card: `.mini-card`
  - Image: `.mini-card-img`
  - Name: `.mini-card-name`
  - Price: `.mini-card-price`

#### Trending Now:

- Section: `.section-trending`
- Same structure as Newest Arrivals
- Additional left header: `.trending-header-left` (title + badge)
- Badge: `.trending-badge` (orange "Hot Picks" badge)

### 6. Footer (dùng chung)

- Container: `.home-footer` — white background with border-top
- Inner wrapper: `.footer-container` — max-width container
- Component: `Footer` (path: `src/components/common/footer/Footer.tsx`)

## Data shapes (mock / contract)

Product (TypeScript):

```typescript
type Product = {
  id: number;
  name: string;
  price: string; // display-ready, e.g. "$8.99"
  img?: string; // image URL (external or relative)
  desc?: string; // short description, e.g. "Organic Orchard · 1kg"
  tag?: string; // badge text, e.g. "NEW", "ORGANIC", "BEST SELLER"
};
```

Props (HomeView):

```typescript
type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  products: Product[];
  displayed: Product[];
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
};
```

## Behavior & interactions

- **Search**: Filter on product.name (client-side). Input class `.search-input` triggers filtering.
- **Add to cart**: `.add-to-cart-btn` — shows alert (mock) or increments cart count.
- **Filters**: Checkboxes/radios in sidebar — client-side filtering (to be implemented).
- **Horizontal scroll**: "Newest Arrivals" and "Trending Now" sections scroll horizontally on overflow.
- **Hover effects**: Product cards scale images, show favorite icon, change border color.

## Styling notes / variables

Colors:

- Primary (accent): `#33f20d` (bright green)
- Background light: `#f6f8f5`
- Background dark: `#132210`
- Text dark: `#121811`
- Text muted: `#678a60`
- Border: `#e5e7eb`

Spacing:

- Container max-width: 1280px
- Content padding: 1rem (mobile), 2rem (desktop)
- Grid gap: 1.5rem
- Card padding: 1rem
- Border radius: 0.5rem (default), 0.75rem (cards)

Typography:

- Font family: 'Plus Jakarta Sans', sans-serif
- Title font-weight: 900
- Regular font-weight: 500-700

## Breakpoints

- **Desktop (>= 768px)**:
  - Sidebar + Content side-by-side (flex-row)
  - Products grid: auto-fill, minmax(280px, 1fr) — typically 3 columns
  - Filters sticky at top: 6rem

- **Mobile (< 768px)**:
  - Layout stacks (flex-column)
  - Sidebar full-width (position: static)
  - Products grid: auto-fill, minmax(200px, 1fr) — typically 1-2 columns
  - Content actions stack vertically

## Examples (DOM skeleton)

```html
<div class="home-root">
  <!-- Sticky Header -->
  <div class="home-header-sticky">
    <div class="home-header-container">
      <header />
    </div>
  </div>

  <!-- Main Layout: Sidebar + Content -->
  <main class="home-main-layout">
    <!-- Left Sidebar: Filters -->
    <aside class="home-sidebar-filters">
      <div class="filters-sticky">
        <div class="filter-section">
          <h3 class="filter-title">Category</h3>
          <div class="filter-options">
            <label class="filter-option">
              <input type="checkbox" checked />
              <span>All Fruits</span>
            </label>
            <!-- more options... -->
          </div>
        </div>
        <!-- more filter sections... -->
        <button class="apply-filters-btn">Apply Filters</button>
      </div>
    </aside>

    <!-- Right Content: Products + Sections -->
    <div class="home-content">
      <!-- Header: Title + Search + Sort -->
      <div class="content-header">
        <div>
          <h1 class="content-title">Fresh Produce</h1>
          <p class="content-subtitle">Showing 12 results for "All Fruits"</p>
        </div>
        <div class="content-actions">
          <input class="search-input" placeholder="Search fruits..." />
          <select class="sort-select">
            <option>Sort by: Popularity</option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="modern-products-grid">
        <div class="modern-product-card">
          <div class="product-image-wrap">
            <div class="product-image" style="background-image: url(...)"></div>
            <div class="product-tag">NEW</div>
            <div class="product-favorite">❤</div>
          </div>
          <div class="product-info">
            <div class="product-details">
              <div>
                <p class="product-name-modern">Rainier Cherries</p>
                <p class="product-desc">Washington Fresh · 250g</p>
              </div>
              <p class="product-price-modern">$8.99</p>
            </div>
            <button class="add-to-cart-btn">🛒 Add to Cart</button>
          </div>
        </div>
        <!-- repeat for all products... -->
      </div>

      <!-- Pagination -->
      <div class="pagination-wrap">
        <Pagination currentPage="{1}" totalPages="{5}" onPageChange="{...}" />
      </div>

      <!-- Extra Sections -->
      <div class="extra-sections">
        <section class="section-arrivals">
          <div class="section-header">
            <h2 class="section-title">Newest Arrivals</h2>
            <div class="section-nav">
              <button class="nav-btn">←</button>
              <button class="nav-btn">→</button>
            </div>
          </div>
          <div class="horizontal-scroll">
            <div class="mini-card">...</div>
            <!-- more cards... -->
          </div>
        </section>

        <section class="section-trending">
          <!-- similar structure... -->
        </section>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="home-footer">
    <div class="footer-container">
      <footer />
    </div>
  </footer>
</div>
```

## Notes for AI generators

- **Respect class names exactly**; they are used by CSS and expected by other components.
- **Prioritize semantic HTML**: `<main>`, `<section>`, `<aside>`, `<footer>`.
- **Images fallback**: If images are missing, use `.product-image-placeholder` with emoji (e.g., 🍊).
- **Keep markup minimal**: Avoid inline styles that break responsive grid rules.
- **Accessibility**: Use proper `<label>` for form inputs, meaningful alt text for images.
- **Responsive behavior**: Grid must adapt automatically via CSS (no manual column counts in JS).
- **Font loading**: Ensure 'Plus Jakarta Sans' is loaded from Google Fonts in `index.html`.
- **Icons**: Use emoji or Material Symbols for icons (loaded from Google Fonts).

## Maintenance

- When CSS class names change, **update this contract file** immediately.
- Keep all team members and automation (AI generators) in sync.
- Test layout on multiple screen sizes (mobile, tablet, desktop) after changes.

## Migration from old layout (legacy)

Old classes (deprecated, do not use):

- `.home-container` → use `.home-main-layout`
- `.topbar` → replaced by `.content-header` + `.content-actions`
- `.products-grid` (5 columns) → use `.modern-products-grid` (auto-fill)
- `.product-card` → use `.modern-product-card`
- `.product-media` → use `.product-image-wrap` + `.product-image`
- `.product-name` → use `.product-name-modern`
- `.price` → use `.product-price-modern`
- `.add` → use `.add-to-cart-btn`

## Contact

- Nếu cần chỉnh sửa contract (thêm class, hành vi), liên hệ kỹ thuật viên chịu trách nhiệm giao diện UI.
- File reference: `src/components/home-page/HomeView.tsx`, `src/components/home-page/Home.css`

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
