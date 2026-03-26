# API - updateFruit

## Method
`updateFruit(Integer fruitId, Fruit fruit)`

## Endpoint
`PUT /api/seller/fruits/{fruitId}`

## Description
Cap nhat thong tin product theo `fruitId`.

## Path params
- `fruitId` (Integer, required): ID cua fruit can cap nhat.

## Request body
Body la object `Product` (JSON). Cac field duoc update trong service:
- `name`
- `price`
- `stock`
- `category`
- `description`
- `imageUrl`
- `isActive`
- `discount`
- `originalPrice`
- `unit`
- `origin`
- `isOrganic`

```json
{
  "category": {
    "categoryId": 3
  },
  "name": "Xoai Cat Hoa Loc Loai 1",
  "price": 95000,
  "stock": 40,
  "imageUrl": "https://example.com/xoai-loai1.jpg",
  "description": "Xoai loai 1, chat luong cao",
  "isActive": true,
  "discount": 0,
  "originalPrice": 98000,
  "unit": "kg",
  "origin": "LOCAL",
  "isOrganic": false
}
```

## Success response
**HTTP 200**

```json
{
  "resultCd": 0,
  "message": "Cập nhật sản phẩm thành công!",
  "data": {
    "productId": 15,
    "name": "Xoai Cat Hoa Loc Loai 1",
    "price": 95000,
    "stock": 40,
    "imageUrl": "https://example.com/xoai-loai1.jpg",
    "description": "Xoai loai 1, chat luong cao",
    "isActive": true,
    "categoryId": 3,
    "discount": 0,
    "originalPrice": 98000,
    "unit": "kg",
    "origin": "LOCAL",
    "isOrganic": false
  }
}
```

## Error behavior
- Neu `fruitId` khong ton tai: service throw `RuntimeException("Khong tim thay san pham!")`.
- Hien tai khong co exception handler rieng trong controller nay, nen loi se ra theo co che mac dinh cua Spring (thuong la HTTP 500).

## Notes
- Controller dung `ApiResponse` va tra ve `SellerProductDto`.
