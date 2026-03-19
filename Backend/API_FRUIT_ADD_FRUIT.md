# API - addFruit

## Method
`addFruit(Integer shopId, Fruit fruit)`

## Endpoint
`POST /api/seller/fruits/{shopId}`

## Description
Tao moi fruit cho shop theo `shopId`.

## Path params
- `shopId` (Integer, required): ID cua shop.

## Request body
Body la object `Fruit` (JSON).

```json
{
  "category": {
    "categoryId": 2
  },
  "fruitName": "Xoai Cat Hoa Loc",
  "price": 90000,
  "stockQuantity": 50,
  "imageUrl": "https://example.com/xoai.jpg",
  "description": "Xoai ngot thom",
  "status": "AVAILABLE"
}
```

## Success response
**HTTP 200**

```json
{
  "fruitId": 15,
  "shop": {
    "shopId": 10
  },
  "category": {
    "categoryId": 2
  },
  "fruitName": "Xoai Cat Hoa Loc",
  "price": 90000,
  "stockQuantity": 50,
  "imageUrl": "https://example.com/xoai.jpg",
  "description": "Xoai ngot thom",
  "status": "AVAILABLE",
  "createdAt": "2026-03-09T09:10:00"
}
```

## Error behavior
- Neu `shopId` khong ton tai: service throw `RuntimeException("Khong tim thay cua hang!")`.
- Hien tai khong co exception handler rieng trong controller nay, nen loi se ra theo co che mac dinh cua Spring (thuong la HTTP 500).

## Notes
- Truong `shop` trong body khong can gui; backend set theo `shopId` path param.
- Controller khong dung `ApiResponse`, tra truc tiep `Fruit`.
