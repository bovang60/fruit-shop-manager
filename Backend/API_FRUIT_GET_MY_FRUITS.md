# API - getMyFruits

## Method
`getMyFruits(Integer shopId)`

## Endpoint
`GET /api/seller/fruits/shop/{shopId}`

## Description
Lay danh sach fruit theo `shopId`.

## Path params
- `shopId` (Integer, required): ID cua shop.

## Request body
Khong co.

## Success response
**HTTP 200**

```json
[
  {
    "fruitId": 1,
    "shop": {
      "shopId": 10
    },
    "category": {
      "categoryId": 2,
      "categoryName": "Citrus"
    },
    "fruitName": "Cam Vang",
    "price": 45000,
    "stockQuantity": 120,
    "imageUrl": "https://example.com/cam.jpg",
    "description": "Cam ngot, it hat",
    "status": "AVAILABLE",
    "createdAt": "2026-03-09T09:00:00"
  }
]
```

## Notes
- Neu shop khong co san pham, API tra ve mang rong `[]`.
- Controller khong dung `ApiResponse`, tra truc tiep `List<Fruit>`.
