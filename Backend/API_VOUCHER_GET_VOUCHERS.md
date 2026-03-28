# API - getVouchers

## Method
`getVouchers(Integer shopId)`

## Endpoint
`GET /api/seller/vouchers/shop/{shopId}`

## Description
Lay danh sach voucher theo `shopId`.

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
  "data": [
    {
      "voucherId": 1,
      "shop": {
        "shopId": 10
      },
      "code": "SALE10",
      "discountValue": 10000,
      "discountType": "FIXED",
      "minOrderValue": 50000,
      "expiredDate": "2026-04-01T23:59:59",
      "status": "ACTIVE"
    }
  ]
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
- Danh sach sap xep giam dan theo `expiredDate`.
- Controller dung `ApiResponse<List<Voucher>>`.
