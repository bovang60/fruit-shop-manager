# API - Seller Dashboard Data

Tai lieu nay mo ta cach lay du lieu cho man hinh Seller Dashboard, duoc frontend tong hop tu nhieu API.

---

## Method
`getSellerDashboardData(Integer shopId, SellerDashboardOptions options)`

## Description
Frontend goi 3 API ben duoi de tong hop du lieu cho dashboard:
1) Sales report: `GET /api/seller/reports/{shopId}`
2) Danh sach don hang: `GET /api/seller/orders/shop/{shopId}`
3) Danh sach san pham cua shop: `GET /api/fruits/shop/{shopId}`

## Options (frontend)
- `recentLimit` (Integer, optional, default 5): So luong don hang gan nhat hien thi.
- `lowStockThreshold` (Integer, optional, default 10): Nguong de dem san pham sap het hang.

---

## Endpoint 1 - Sales Report
`GET /api/seller/reports/{shopId}`

Phan data can dung:
```json
{
  "totalOrders": 120,
  "successfulOrders": 95,
  "totalRevenue": 12500000,
  "totalFruitsSold": 860
}
```

---

## Endpoint 2 - Seller Orders
`GET /api/seller/orders/shop/{shopId}`

Phan data can dung:
```json
[
  {
    "orderId": 1001,
    "receiverName": "Nguyen Van A",
    "subTotal": 150000,
    "status": "PENDING",
    "createdAt": "2026-03-10T09:30:00"
  }
]
```

---

## Endpoint 3 - Seller Fruits
`GET /api/fruits/shop/{shopId}`

Phan data can dung:
```json
[
  {
    "fruitId": 1,
    "stockQuantity": 12,
    "status": "AVAILABLE"
  }
]
```

---

## Tong hop data (frontend)

### Logic
- `pendingOrders` = dem so don hang co `status = PENDING`.
- `lowStockItems` = dem so san pham co `stockQuantity <= lowStockThreshold`
  va `status` khong phai `DISCONTINUED` hoac `HIDDEN`.
- `recentOrders` = lay `recentLimit` don hang dau tien tu danh sach orders.
- `totalOrders` = lay tu sales report neu co, neu khong thi dung `orders.length`.
- `totalRevenue` = lay tu sales report (co the la string/number).

### Response tong hop (Frontend)
```json
{
  "resultCd": 0,
  "message": "Success",
  "data": {
    "stats": {
      "totalRevenue": 12500000,
      "totalOrders": 120,
      "pendingOrders": 8,
      "lowStockItems": 3
    },
    "recentOrders": [
      {
        "orderId": 1001,
        "receiverName": "Nguyen Van A",
        "subTotal": 150000,
        "status": "PENDING"
      }
    ]
  }
}
```

## Notes
- Danh sach orders duoc backend sap xep giam dan theo `createdAt`,
  nen `recentOrders` co the lay truc tiep tu danh sach tra ve.
- Frontend da tu dong normalize `ApiResponse` neu backend tra ve raw list/object.
