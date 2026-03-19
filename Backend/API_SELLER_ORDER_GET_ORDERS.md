# API - getAllOrders

## Method
`getAllOrders(Integer shopId)`

## Endpoint
`GET /api/seller/orders/shop/{shopId}`

## Description
Lay danh sach don hang cua shop theo `shopId`.

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
- Danh sach sap xep giam dan theo `createdAt`.
- Controller dung `ApiResponse<List<Order>>`.
