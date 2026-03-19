# API - updateFruit

## Method
`updateFruit(Integer fruitId, Fruit fruit)`

## Endpoint
`PUT /api/seller/fruits/{fruitId}`

## Description
Cap nhat thong tin fruit theo `fruitId`.

## Path params
- `fruitId` (Integer, required): ID cua fruit can cap nhat.

## Request body
Body la object `Fruit` (JSON). Cac field duoc update trong service:
- `fruitName`
- `price`
- `stockQuantity`
- `category`
- `description`
- `imageUrl`
- `status`

```json
{
  "category": {
    "categoryId": 3
  },
  "fruitName": "Xoai Cat Hoa Loc Loai 1",
  "price": 95000,
  "stockQuantity": 40,
  "imageUrl": "https://example.com/xoai-loai1.jpg",
  "description": "Xoai loai 1, chat luong cao",
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
    "categoryId": 3
  },
  "fruitName": "Xoai Cat Hoa Loc Loai 1",
  "price": 95000,
  "stockQuantity": 40,
  "imageUrl": "https://example.com/xoai-loai1.jpg",
  "description": "Xoai loai 1, chat luong cao",
  "status": "AVAILABLE",
  "createdAt": "2026-03-09T09:10:00"
}
```

## Error behavior
- Neu `fruitId` khong ton tai: service throw `RuntimeException("Khong tim thay san pham!")`.
- Hien tai khong co exception handler rieng trong controller nay, nen loi se ra theo co che mac dinh cua Spring (thuong la HTTP 500).

## Notes
- Controller khong dung `ApiResponse`, tra truc tiep `Fruit`.
