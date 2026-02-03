# GENERATOR PROMPT - Fruit Shop Manager (template)

Mục đích

- Template này dùng để yêu cầu một AI/agent tạo màn hình React+TypeScript tuân theo quy ước dự án (container/view/css) và RULE_LAYOUT / SOURCE_RULES.

Cách dùng nhanh

- Thay {{SCREEN_NAME}} bằng tên màn bạn muốn (kebab-case folder, PascalCase tên component).  
  Ví dụ: màn đăng ký => folder `register`, component `Register`.
- Gửi cho AI dòng: `GEN: {{SCREEN_NAME}}` (hoặc paste toàn bộ file này và chỉ định SCREEN_NAME).

Yêu cầu bắt buộc (tuân theo `src/SOURCE_RULES.md` và `src/components/RULE_LAYOUT.md`)

1. Tạo 3 file trong thư mục:
   - `src/components/{{kebab-screen}}/{{PascalScreen}}.tsx` // container: logic, state, handlers; NO CSS import
   - `src/components/{{kebab-screen}}/{{PascalScreen}}View.tsx` // view: presentational, imports `./{{PascalScreen}}.css`
   - `src/components/{{kebab-screen}}/{{PascalScreen}}.css` // styles (class-based, no CSS modules)
2. Pattern Container / View:
   - Container: giữ tất cả state, validation, side-effects, gọi API mock. Render View với typed props.
   - View: chỉ render markup và import CSS; không chứa business logic.
3. Class-name contract (sử dụng các class có trong SOURCE_RULES & RULE_LAYOUT khi phù hợp)
   - Layout chung: `.home-root`, `.home-container`, `.content`, `.card`
   - Form/login/register: `.login-root`, `.login-wrap`, `.login-card`, `.field`, `.form-actions`, `.primary`, `.link-btn`
   - Products: `.products-grid`, `.product-card`, `.product-media`, `.product-name`, `.price`, `.add`
   - Pagination: `.pagination`, `.page-list`, `.page-btn`, `.active`
   - Header/Footer: import từ `src/components/common/header/Header` và `src/components/common/footer/Footer`
4. Semantic + accessibility:
   - Sử dụng `header`, `main`, `section`, `article`, `footer`.
   - Mỗi input có `label`; lỗi hiển thị với `aria-invalid` và `aria-describedby`.
   - Buttons có `type`.
5. Props / Types:
   - View phải khai báo interface Props rõ ràng; container truyền các props đó.
6. Responsive rules:
   - Nếu màn có lưới sản phẩm thì desktop mặc định 5 cột (`.products-grid { grid-template-columns: repeat(5, 1fr); }`), responsive tự co.
7. Behavior mặc định khi cần (ví dụ form):
   - Validation client-side, hiển thị lỗi dưới field.
   - On submit: mô phỏng API delay (≈600ms), xử lý loading và success callback prop `onSuccess?`.
   - Link to login/register: prop callback `onGoToLogin?` / `onGoToRegister?`.

Deliverable (đầu ra khi chạy)

- Trả về đầy đủ nội dung của 3 file (TSX + TSX view + CSS) với đường dẫn chính xác như trên.
- Không in bài ngoại; chỉ trả file contents.
- Dùng import tương đối chính xác (ví dụ: Header từ `"../common/header/Header"`).

Ví dụ placeholder mapping

- `{{kebab-screen}}` => register
- `{{PascalScreen}}` => Register

Ví dụ lệnh bạn gửi cho AI (tóm tắt)

- `GEN: register`
  - AI sẽ: tạo `src/components/register/Register.tsx` (container), `RegisterView.tsx` (view), `Register.css` theo rules.

Ghi chú cho generator

- Luôn kiểm tra `src/SOURCE_RULES.md` & `src/components/RULE_LAYOUT.md` trước khi gen.
- Nếu màn đặc thù (ví dụ: product-detail có carousel), thêm phần mô tả ngắn khi yêu cầu (ví dụ: "carousel: true").
- Nếu cần kết nối API thật, container chỉ để comment `// TODO: connect API` và expose mock behavior.

Kết thúc template.
