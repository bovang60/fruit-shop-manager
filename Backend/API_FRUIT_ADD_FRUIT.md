# API - addFruit

## Method
`addFruit(Integer shopId, Fruit fruit)`

## Endpoint
`POST /api/seller/fruits/{shopId}`

## Description
Tao moi product cho shop theo `shopId`.

## Path params
- `shopId` (Integer, required): ID cua shop.

## Request body
Body la object `Product` (JSON).

```json
{
  "category": {
    "categoryId": 2
  },
  "name": "Xoai Cat Hoa Loc",
  "price": 90000,
  "stock": 50,
  "imageUrl": "https://example.com/xoai.jpg",
  "description": "Xoai ngot thom",
  "isActive": true,
  "discount": 0,
  "originalPrice": 95000,
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
  "message": "Tạo sản phẩm thành công!",
  "data": {
    "productId": 15,
    "name": "Xoai Cat Hoa Loc",
    "price": 90000,
    "stock": 50,
    "imageUrl": "https://example.com/xoai.jpg",
    "description": "Xoai ngot thom",
    "isActive": true,
    "categoryId": 2,
    "discount": 0,
    "originalPrice": 95000,
    "unit": "kg",
    "origin": "LOCAL",
    "isOrganic": false
  }
}
```

## Error behavior
- Neu `shopId` khong ton tai: service throw `RuntimeException("Khong tim thay cua hang!")`.
- Hien tai khong co exception handler rieng trong controller nay, nen loi se ra theo co che mac dinh cua Spring (thuong la HTTP 500).

## Notes
- Truong `shop` trong body khong can gui; backend set theo `shopId` path param.
- Controller dung `ApiResponse` va tra ve `SellerProductDto`.
