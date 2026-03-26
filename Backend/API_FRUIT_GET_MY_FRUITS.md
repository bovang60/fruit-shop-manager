# API - getMyFruits

## Method
`getMyFruits(Integer shopId)`

## Endpoint
`GET /api/seller/fruits/shop/{shopId}`

## Description
Lay danh sach product theo `shopId`.

## Path params
- `shopId` (Integer, required): ID cua shop.

## Request body
Khong co.

## Success response
**HTTP 200**

```json
{
  "resultCd": 0,
  "message": "Tải danh sách sản phẩm thành công",
  "data": [
    {
      "productId": 1,
      "name": "Cam Vang",
      "price": 45000,
      "stock": 120,
      "imageUrl": "https://example.com/cam.jpg",
      "description": "Cam ngot, it hat",
      "isActive": true,
      "categoryId": 2,
      "discount": 0,
      "originalPrice": 48000,
      "unit": "kg",
      "origin": "LOCAL",
      "isOrganic": false
    }
  ]
}
```

## Notes
- Neu shop khong co san pham, `data` la mang rong `[]`.
- Controller dung `ApiResponse` va tra ve `SellerProductDto`.
