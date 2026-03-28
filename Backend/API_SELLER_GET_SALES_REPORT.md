# API - getSalesReport

## Method
`getSalesReport(Integer shopId)`

## Endpoint
`GET /api/seller/reports/{shopId}`

## Description
Xem bao cao doanh so tong quan cua shop.

## Path params
- `shopId` (Integer, required): ID cua shop.

## Request body
Khong co.

## Success response
**HTTP 200**

```json
{
  "resultCd": 0,
  "message": "Success",
  "data": {
    "totalOrders": 120,
    "successfulOrders": 95,
    "totalRevenue": 12500000,
    "totalFruitsSold": 860
  }
}
```

## Error behavior
- Controller bat Exception va tra ve **HTTP 200** voi `ApiResponse.error(message)`.

```json
{
  "resultCd": 1,
  "message": "Thong diep loi tu server",
  "data": null
}
```

## Notes
- `totalOrders`: tong so don hang cua shop (tat ca trang thai).
- `successfulOrders`: so don hang hoan thanh (`COMPLETED`).
- `totalRevenue`: tong doanh thu chi tinh don `COMPLETED` (sum `subTotal`).
- `totalFruitsSold`: tong so luong san pham ban ra chi tinh don `COMPLETED`.
