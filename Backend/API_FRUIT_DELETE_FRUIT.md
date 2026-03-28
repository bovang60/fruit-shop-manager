# API - deleteFruit

## Method
`deleteFruit(Integer fruitId)`

## Endpoint
`DELETE /api/seller/fruits/{fruitId}`

## Description
Xoa product theo `fruitId`.

## Path params
- `fruitId` (Integer, required): ID cua fruit can xoa.

## Request body
Khong co.

## Success response
**HTTP 200**

```json
{
  "resultCd": 0,
  "message": "Xóa sản phẩm thành công!",
  "data": null
}
```

## Error behavior
- Neu `fruitId` khong ton tai: service throw `RuntimeException("San pham khong ton tai!")`.
- Hien tai khong co exception handler rieng trong controller nay, nen loi se ra theo co che mac dinh cua Spring (thuong la HTTP 500).

## Notes
- Controller dung `ApiResponse` va tra ve `null`.
