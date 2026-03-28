# API - updateVoucher

## Method
`update(Integer voucherId, Voucher voucher)`

## Endpoint
`PUT /api/seller/vouchers/{voucherId}`

## Description
Cap nhat thong tin voucher theo `voucherId`.

## Path params
- `voucherId` (Integer, required): ID cua voucher can cap nhat.

## Request body
Body la object `Voucher` (JSON).

```json
{
  "code": "SALE20",
  "discountValue": 15000,
  "discountType": "FIXED",
  "minOrderValue": 120000,
  "expiredDate": "2026-06-01T23:59:59",
  "status": "ACTIVE"
}
```

## Success response
**HTTP 200**

```json
{
  "resultCd": 0,
  "message": "Cập nhật voucher thành công!",
  "data": {
    "voucherId": 5,
    "shop": {
      "shopId": 10
    },
    "code": "SALE20",
    "discountValue": 15000,
    "discountType": "FIXED",
    "minOrderValue": 120000,
    "expiredDate": "2026-06-01T23:59:59",
    "status": "ACTIVE"
  }
}
```

## Error behavior
- Neu `voucherId` khong ton tai: `"Voucher không tồn tại!"`.
- Controller bat Exception va tra ve **HTTP 200** voi `ApiResponse.error(message)`.

## Notes
- Cac field duoc cap nhat: `code`, `discountValue`, `discountType`, `minOrderValue`, `expiredDate`, `status`.
