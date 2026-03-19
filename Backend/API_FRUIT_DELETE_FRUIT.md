# API - deleteFruit

## Method
`deleteFruit(Integer fruitId)`

## Endpoint
`DELETE /api/seller/fruits/{fruitId}`

## Description
Xoa fruit theo `fruitId`.

## Path params
- `fruitId` (Integer, required): ID cua fruit can xoa.

## Request body
Khong co.

## Success response
**HTTP 200**

```json
"Xoa san pham thanh cong!"
```

## Error behavior
- Neu `fruitId` khong ton tai: service throw `RuntimeException("San pham khong ton tai!")`.
- Hien tai khong co exception handler rieng trong controller nay, nen loi se ra theo co che mac dinh cua Spring (thuong la HTTP 500).

## Notes
- Controller khong dung `ApiResponse`, tra truc tiep `String`.
