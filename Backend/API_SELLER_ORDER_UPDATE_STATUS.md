# API - updateOrderStatus

## Method
`updateStatus(Integer orderId, Order.OrderStatus status)`

## Endpoint
`PATCH /api/seller/orders/{orderId}/status`

## Description
Cap nhat trang thai don hang.

## Path params
- `orderId` (Integer, required): ID cua don hang.

## Query params
- `status` (OrderStatus, required): Trang thai moi cua don hang.

Gia tri hop le: `PENDING`, `CONFIRMED`, `SHIPPING`, `COMPLETED`, `CANCELLED`.

Vi du:
`PATCH /api/seller/orders/1001/status?status=SHIPPING`

## Request body
Khong co.

## Success response
**HTTP 200**

```json
{
  "resultCd": 0,
  "message": "Cập nhật trạng thái đơn hàng thành công!",
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
    "status": "SHIPPING",
    "note": "Giao buoi chieu",
    "createdAt": "2026-03-10T09:30:00"
  }
}
```

## Error behavior
- Neu `orderId` khong ton tai: `"Không tìm thấy đơn hàng ID: {orderId}"`.
- Neu don hang da `CANCELLED` hoac `COMPLETED`: `"Đơn hàng đã đóng, không thể thay đổi trạng thái!"`.
- Controller bat Exception va tra ve **HTTP 200** voi `ApiResponse.error(message)`.

## Notes
- Controller dung `ApiResponse<Order>`.
