# Utils Folder

Chứa các utility functions và helper modules dùng chung trong toàn bộ dự án.

## 📦 Modules

### `apiClient.ts` - API Client Utility

Centralized API request handler với các tính năng:
- ✅ Method wrappers: `get()`, `post()`, `put()`, `del()`, `patch()`
- ✅ Type-safe requests với TypeScript generics
- ✅ Query parameters support
- ✅ Custom headers support
- ✅ Environment-based configuration
- ✅ Consistent error handling

**Quick Example:**
```typescript
import { get, post } from '@/utils/apiClient'

// GET request
const users = await get<User[]>('/api/users')

// POST request
const result = await post<ApiResponse<User>>('/api/users', {
  name: 'John',
  email: 'john@example.com'
})
```

📖 **Full Documentation:** [API_CLIENT_GUIDE.md](../../../API_CLIENT_GUIDE.md)

## 🔧 Adding New Utilities

Khi thêm utility mới:
1. Tạo file mới trong folder này (VD: `dateUtils.ts`, `formatUtils.ts`)
2. Export các functions cần thiết
3. Document trong file này
4. Sử dụng TypeScript để type-safety

**Example:**
```typescript
// dateUtils.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('vi-VN')
}

export function isExpired(date: Date): boolean {
  return date < new Date()
}
```
