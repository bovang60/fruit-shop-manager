# Hướng dẫn cài đặt môi trường — Frontend Fruit Shop Manager

Tệp này hướng dẫn chi tiết các bước cài đặt môi trường để chạy phần Frontend trên Windows (PowerShell). Bao gồm các lệnh cần thiết và các lỗi thường gặp cùng cách khắc phục.

Tóm tắt nhanh

- Phiên bản Node.js: >= 20.19.0 (Vite yêu cầu) — khuyên dùng bản LTS hoặc bản tương thích
- npm: đi kèm Node
- Git, VS Code (khuyến nghị)
- PowerShell (Windows) — các lệnh dưới đây theo cú pháp PowerShell

Chuẩn bị trước khi bắt đầu

- [ ] Đã clone repository và mở thư mục: `G:\SWP391\fruit-shop-manager\Frontend`
- [ ] Ổ chứa npm cache (thường là C:) có đủ dung lượng; nếu không, hãy di chuyển cache sang ổ khác (ví dụ G:)
- [ ] Có quyền Admin khi cần (một số thao tác có thể yêu cầu quyền cao)

1. Cài Node.js (khuyến nghị dùng nvm-windows)

Khuyến nghị: sử dụng nvm-windows để dễ quản lý nhiều phiên bản Node:

```powershell
# Cài nvm-windows theo hướng dẫn trên: https://github.com/coreybutler/nvm-windows/releases
# Ví dụ: cài Node LTS 20.x và chuyển sang phiên bản đó
nvm install 20.24.1
nvm use 20.24.1
# Kiểm tra
node -v
npm -v
```

Nếu không dùng nvm, tải installer MSI từ https://nodejs.org và chạy bằng quyền Admin, chọn phiên bản >= 20.19.0.

2. Cấu hình npm cache (nếu ổ hệ thống bị đầy)

Nếu ổ C: thiếu không gian, đặt cache của npm sang ổ khác (ví dụ G:):

```powershell
# Tạo thư mục cache trên G:
New-Item -ItemType Directory -Path 'G:\npm-cache' -Force
npm config set cache "G:\npm-cache" --global
npm config get cache
```

3. Cài phụ thuộc (dependencies)

Mở PowerShell, chuyển vào folder Frontend và cài:

```powershell
cd "G:\SWP391\fruit-shop-manager\Frontend"
# Nếu cần loại bỏ trạng thái cũ
rd node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
npm cache clean --force
npm install
```

Ghi chú: nếu gặp lỗi liên quan file nhị phân (ví dụ esbuild bị khoá), hãy đóng editor/terminal rồi thử lại. Nếu file vẫn bị khoá, xem phần Khắc phục bên dưới.

4. Chạy dev server

```powershell
npm run dev
```

Mở địa chỉ Vite in ra (thường là http://localhost:5173/) trên trình duyệt.

5. Chạy script kiểm tra file do AI tạo (sau khi sinh màn)

```powershell
# Ví dụ: kiểm tra màn 'register'
node src/gen-AI/check_generated.js register
```

Khắc phục sự cố thường gặp

- Lỗi ENOSPC (không đủ dung lượng)

  - Nếu `npm install` báo ENOSPC, kiểm tra ổ đĩa với `Get-PSDrive`. Nếu ổ C: đầy, di chuyển cache npm sang ổ khác (xem bước 2).

- File nhị phân bị khoá (esbuild: EPERM / EBUSY)
  - Đóng tất cả editor/terminal đang dùng thư mục dự án.
  - Nếu vẫn khoá, chạy PowerShell với quyền Admin và thực hiện:

```powershell
# Ví dụ xóa file esbuild bị khoá
takeown /f "G:\SWP391\fruit-shop-manager\Frontend\node_modules\@esbuild\win32-x64\esbuild.exe"
icacls "G:\SWP391\fruit-shop-manager\Frontend\node_modules\@esbuild\win32-x64\esbuild.exe" /grant Administrators:F
Remove-Item "G:\SWP391\fruit-shop-manager\Frontend\node_modules\@esbuild\win32-x64\esbuild.exe" -Force
```

- Lỗi do phiên bản Node (Vite yêu cầu phiên bản cao hơn)

  - Nếu Vite báo lỗi liên quan Node version, cập nhật Node lên >=20.19.0 theo cách ở bước 1.

- Lỗi quyền khi cài (permission errors)
  - Thử chạy PowerShell bằng quyền Administrator hoặc tạm thời tắt chương trình diệt virus nếu nghi ngờ.

Mẹo cho nhà phát triển

- Dùng `nvm` để quản lý nhiều phiên bản Node dễ dàng.
- Đặt `npm config get cache` trỏ tới ổ có dung lượng lớn và tốc độ tốt.
- Tuân theo contract trong `src/SOURCE_RULES.md` và `src/components/RULE_LAYOUT.md` khi chỉnh sửa các file do AI tạo.

Tự động sửa lỗi cơ bản (tùy chọn)

Muốn mình tạo một script PowerShell tự động (xóa `node_modules`, đặt cache sang G:, dọn cache và chạy `npm install`), trả lời "Có".

Cập nhật: 2026-02-04
