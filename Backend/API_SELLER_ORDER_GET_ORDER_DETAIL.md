# API - getOrderById

## Method
`getOrderById(Integer orderId)`

## Endpoint
`GET /api/seller/orders/{orderId}`

## Description
Xem chi tiet don hang theo `orderId`.

## Path params
- `orderId` (Integer, required): ID cua don hang.

## Request body
Khong co.

## Success response
**HTTP 200**

```json
{
  "resultCd": 0,
  "message": "Success",
  "data": {
    "orderId": 1001,
    "transaction": {
      "transactionId": 555
    },
    "shop": {
      "shopId": 10
    },
    "user": {
      "userId": 20
    },
    "receiverName": "Nguyen Van A",
    "receiverPhone": "0909123456",
    "shippingAddress": "123 ABC, HCM",
    "subTotal": 150000,
    "shippingFee": 20000,
    "status": "PENDING",
    "note": "Giao buoi chieu",
    "createdAt": "2026-03-10T09:30:00"
  }
}
```

## Error behavior
- Neu `orderId` khong ton tai: `"Không tìm thấy đơn hàng ID: {orderId}"`.
- Controller bat Exception va tra ve **HTTP 200** voi `ApiResponse.error(message)`.

## Notes
- Controller dung `ApiResponse<Order>`.
