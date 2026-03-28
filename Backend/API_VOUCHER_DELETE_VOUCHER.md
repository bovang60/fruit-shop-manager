# API - deleteVoucher

## Method
`delete(Integer voucherId)`

## Endpoint
`DELETE /api/seller/vouchers/{voucherId}`

## Description
Xoa voucher theo `voucherId`.

## Path params
- `voucherId` (Integer, required): ID cua voucher can xoa.

## Request body
Khong co.

## Success response
**HTTP 200**

```json
{
  "resultCd": 0,
  "message": "Xóa voucher thành công!",
  "data": null
}
```

## Error behavior
- Neu `voucherId` khong ton tai: `"Voucher không tồn tại!"`.
- Controller bat Exception va tra ve **HTTP 200** voi `ApiResponse.error(message)`.

## Notes
- Controller tra ve `ApiResponse<Void>`.
