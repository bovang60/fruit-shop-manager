# Source rules and component contract

Purpose

- This file documents the source layout, naming conventions and small "contract" rules so other developers or automated generators (AI) can produce UI files that fit into the project without manual changes.

Where to put the file

- Path: `src/SOURCE_RULES.md` (root of source). Keep this file updated whenever CSS class names or component APIs change.

Project structure (high level)

- `src/` — application source
  - `components/` — UI components grouped by feature and `common` shared components
    - `common/header/` — `Header.tsx` (container) + `HeaderView.tsx` (presentational) + `Header.css`
    - `common/footer/` — `Footer.tsx` + `FooterView.tsx` + `Footer.css`
    - `common/pagination/` — `Pagination.tsx` + `PaginationView.tsx` + `Pagination.css`
    - `home-page/` — `Home.tsx` (container) + `HomeView.tsx` (view) + `Home.css`
    - `login/` — `Login.tsx` + `LoginView.tsx` + `Login.css`

File & component conventions

- Each UI piece uses a 3-file pattern when it has logic:
  1. Container (e.g. `X.tsx`) — React component with state, effects and handlers. Exports default component. No CSS imports here.
  2. View (e.g. `XView.tsx`) — presentational component: imports the component's CSS, renders markup, receives props only. No internal state except local UI-only (rare).
  3. Style (e.g. `X.css`) — component-scoped stylesheet using global class names (no CSS modules).
- Naming: component folder = kebab-case feature name, files CamelCase matching component name.
- Props: explicit typed props for views (TypeScript interfaces). Containers pass functions and values; views should not import container logic.

Class-name contract (important for generators)

- Header: `.site-header`, `.brand`, `.nav-tabs`, `.tab`, `.tab.active`
- Topbar: `.topbar`, `.search-wrap`, `.search`, `.cart-wrap`, `.cart-btn`, `.badge`
- Main layout: `.home-root`, `.home-container`, `.content`, `.home-actions`, `.home-main`, `.sidebar`
- Products: `.products-grid` (desktop: 5 columns), `.product-card`, `.product-media`, `.product-name`, `.product-meta`, `.price`, `.add`
- Pagination: `.pagination` (root, full-width + centered), `.page-btn`, `.page-list`, `.page-number`, `.active`, `.dots`
- Login: `.login-root`, `.login-wrap`, `.login-card`, `.field`, `.form-actions`, `.primary`, `.link-btn`

Data and prop shapes (contract)

- Product: { id: number; name: string; price: string; img?: string }
- Pagination props: `{ currentPage: number, totalPages: number, onPageChange: (n:number) => void }`
- View props: keep minimal and explicit. Example: `HomeView` receives `query, onQueryChange, displayed, page, totalPages, onPageChange`.

Generator guidelines for other AIs

- Use only the class names above for structure and styling.
- Render semantic HTML: `header`, `main`, `section`, `article`, `footer`.
- Do not inline styles that change layout rules (grid columns, padding). Use classes only.
- If images are not available, use an emoji or placeholder element inside `.product-media`.
- Keep markup stable: predictable element order and classes so CSS selectors work.
- Accessibility: set `aria-current="page"` on active page number, use proper `type` on buttons and inputs, and add alt text for images.

Validation checklist for generated code

- Files placed in correct folder and follow naming conventions.
- `View` imports its CSS and contains no business logic.
- `Container` wires state & handlers and renders `View` with typed props.
- Pagination receives required props and uses `onPageChange` for navigation.
- Products grid renders exactly the `.product-card` elements and can handle an arbitrary number of children (the grid CSS controls wrapping).

How to run locally (quick)

```powershell
cd G:\SWP391\fruit-shop-manager\Frontend
npm install
npm run dev
```

If the dev server fails because of Node version, upgrade Node to >= 20.19.0.

Maintenance

- When you change a class or component API, update `src/SOURCE_RULES.md` and `src/components/RULE_LAYOUT.md` so automation stays compatible.

Contact

- Leave a short note in this file with the author's name and date when you update the contract.
