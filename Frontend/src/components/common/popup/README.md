# Common Popup Component

Popup component để hiển thị thông báo với 4 loại: Notice, Confirm, Error, Warning.

## Setup

Popup đã được setup trong `App.tsx` với `PopupProvider`, không cần setup thêm.

## Sử dụng

### 1. Import hook

```typescript
import { usePopup } from '../common/popup'
```

### 2. Sử dụng trong component

```typescript
function MyComponent() {
  const { showNotice, showConfirm, showError, showWarning } = usePopup()
  
  // ... component logic
}
```

## API Methods

### showNotice(message, title?)

Hiển thị thông báo thông thường (màu xanh dương).

```typescript
showNotice('Đã lưu thành công!')
showNotice('Đã lưu thành công!', 'Thành công')
```

### showConfirm(message, onConfirm, title?, onCancel?)

Hiển thị popup xác nhận với 2 nút (màu xanh lá).

```typescript
showConfirm(
  'Bạn có chắc chắn muốn xóa?',
  () => {
    // Logic khi user click Xác nhận
    console.log('Confirmed!')
  },
  'Xác nhận xóa',
  () => {
    // Logic khi user click Hủy (optional)
    console.log('Cancelled')
  }
)
```

### showError(message, title?)

Hiển thị thông báo lỗi (màu đỏ).

```typescript
showError('Không thể kết nối đến server!')
showError('Email không hợp lệ', 'Lỗi đăng nhập')
```

### showWarning(message, title?)

Hiển thị cảnh báo (màu vàng cam).

```typescript
showWarning('Tài khoản của bạn sắp hết hạn')
showWarning('Vui lòng kiểm tra lại thông tin', 'Cảnh báo')
```

## Ví dụ trong ShopManagement

```typescript
import { usePopup } from '../common/popup'

function ShopManagement() {
  const { showNotice, showConfirm, showError } = usePopup()

  const handleApprove = (id: number) => {
    showConfirm(
      `Bạn có chắc chắn muốn phê duyệt shop này?`,
      () => {
        // Call API
        showNotice(`Shop ${id} đã được phê duyệt thành công!`)
      },
      'Xác nhận phê duyệt'
    )
  }

  const handleDelete = async (id: number) => {
    showConfirm(
      'Thao tác này không thể hoàn tác!',
      async () => {
        try {
          await deleteShopAPI(id)
          showNotice('Đã xóa shop thành công')
        } catch (error) {
          showError('Không thể xóa shop. Vui lòng thử lại!')
        }
      },
      'Xác nhận xóa'
    )
  }

  return <div>...</div>
}
```

## Styling

Popup sử dụng pure CSS với animations mượt mà:
- Fade in overlay
- Slide up animation
- Responsive design (mobile-friendly)
- 4 màu tương ứng với 4 loại popup

## File Structure

```
src/components/common/popup/
├── PopupProvider.tsx    # Context provider và logic
├── PopupView.tsx        # UI component
├── Popup.css           # Styles
├── index.ts            # Exports
└── README.md           # Documentation
```

## Notes

- Chỉ hiển thị 1 popup tại một thời điểm
- Click vào overlay hoặc nút X để đóng popup
- Popup tự động đóng sau khi user click nút Confirm/Cancel
- Sử dụng hook `usePopup` thay vì `alert()` trong toàn bộ project
