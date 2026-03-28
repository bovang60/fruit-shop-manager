# API - createVoucher

## Method
`create(Integer shopId, Voucher voucher)`

## Endpoint
`POST /api/seller/vouchers/shop/{shopId}`

## Description
Tao moi voucher cho shop theo `shopId`.

## Path params
- `shopId` (Integer, required): ID cua shop.

## Request body
Body la object `Voucher` (JSON).

```json
{
  "code": "SALE20",
  "discountValue": 20,
  "discountType": "PERCENT",
  "minOrderValue": 100000,
  "expiredDate": "2026-05-01T23:59:59",
  "status": "ACTIVE"
}
```

## Success response
**HTTP 200**

```json
{
  "resultCd": 0,
  "message": "Tạo voucher thành công!",
  "data": {
    "voucherId": 5,
    "shop": {
      "shopId": 10
    },
    "code": "SALE20",
    "discountValue": 20,
    "discountType": "PERCENT",
    "minOrderValue": 100000,
    "expiredDate": "2026-05-01T23:59:59",
    "status": "ACTIVE"
  }
}
```

## Error behavior
- Neu ma voucher da ton tai trong shop: `"Mã voucher này đã tồn tại trong Shop của bạn!"`.
- Neu `shopId` khong ton tai: `"Không tìm thấy Shop!"`.
- Controller bat Exception va tra ve **HTTP 200** voi `ApiResponse.error(message)`.

## Notes
- Truong `shop` khong can gui; backend set theo `shopId` path param.
- Truong `discountType` nhan: `FIXED` hoac `PERCENT`.
