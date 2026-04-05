import { callApiWithMethod, type ApiResponse } from '../utils/apiClient';

export interface ShopCheckoutOption {
  shopId: number;
  shippingMethodId: number;
  voucherId?: number;
  note?: string;
}

export interface OrderRequest {
  receiverName: string;
  shippingAddress: string;
  receiverPhone: string;
  paymentMethod: string;
  shops: ShopCheckoutOption[];
}

export interface OrderItemDto {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  imageUrl?: string;
}

export interface OrderDto {
  orderId: number;
  fullName: string;
  address: string;
  phone: string;
  paymentMethod?: string;
  paymentStatus?: string;
  note?: string;
  totalPrice: number;
  shippingFee?: number;
  subTotal?: number;
  discountValue?: number;
  shopId?: number;
  shopName?: string;
  status: string;
  createdAt: string;
  items?: OrderItemDto[];
}

interface OrderResponseDto {
  orderId: number;
  totalAmount: number;
  shippingFee: number;
  status: string;
  createdAt: string;
}

interface BackendOrderItemDto {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  imageUrl?: string;
}

interface BackendOrderDto {
  orderId: number;
  shopId?: number;
  shopName?: string;
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  subTotal?: number;
  shippingFee?: number;
  discountValue?: number;
  totalAmount: number;
  status: string;
  paymentMethod?: string;
  paymentStatus?: string;
  note?: string;
  createdAt: string;
  items?: BackendOrderItemDto[];
}

function mapOrderItem(item: BackendOrderItemDto): OrderItemDto {
  return {
    orderItemId: item.orderItemId,
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.subtotal,
    imageUrl: item.imageUrl,
  };
}

function mapOrderDto(order: BackendOrderDto): OrderDto {
  return {
    orderId: order.orderId,
    fullName: order.receiverName,
    address: order.shippingAddress,
    phone: order.receiverPhone,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    note: order.note,
    totalPrice: order.totalAmount,
    shippingFee: order.shippingFee,
    subTotal: order.subTotal,
    discountValue: order.discountValue,
    shopId: order.shopId,
    shopName: order.shopName,
    status: order.status,
    createdAt: order.createdAt,
    items: order.items?.map(mapOrderItem) ?? [],
  };
}

/**
 * Create a new order from current cart
 *
 * Endpoint: POST /api/orders/checkout
 */
export async function createOrder(userId: number, request: OrderRequest): Promise<ApiResponse<OrderResponseDto>> {
  try {
    return await callApiWithMethod<OrderRequest & { userId: number }, ApiResponse<OrderResponseDto>>(
      'POST',
      '/api/orders/checkout',
      { ...request, userId },
      { userId: String(userId) }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      resultCd: 1,
      message: 'Không thể tạo đơn hàng. Vui lòng thử lại.',
      data: null
    };
  }
}

/**
 * Get all orders for a specific user
 *
 * Endpoint: GET /api/orders/user/{userId}
 */
export async function getUserOrders(userId: number): Promise<ApiResponse<OrderDto[]>> {
  try {
    const response = await callApiWithMethod<never, ApiResponse<BackendOrderDto[]>>(
      'GET',
      `/api/orders/user/${userId}`
    );

    return {
      ...response,
      data: response.data?.map(mapOrderDto) ?? null,
    };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return {
      resultCd: 1,
      message: 'Không thể tải danh sách đơn hàng. Vui lòng thử lại.',
      data: null
    };
  }
}

/**
 * Get order detail by orderId
 *
 * Endpoint: GET /api/orders/{orderId}?userId={userId}
 */
export async function getOrderDetail(orderId: number, userId: number): Promise<ApiResponse<OrderDto>> {
  try {
    const response = await callApiWithMethod<never, ApiResponse<BackendOrderDto>>(
      'GET',
      `/api/orders/${orderId}?userId=${userId}`
    );

    return {
      ...response,
      data: response.data ? mapOrderDto(response.data) : null,
    };
  } catch (error) {
    console.error('Error fetching order detail:', error);
    return {
      resultCd: 1,
      message: 'Không thể tải chi tiết đơn hàng. Vui lòng thử lại.',
      data: null
    };
  }
}

/**
 * Cancel an order
 *
 * Endpoint: PUT /api/orders/{orderId}/cancel?userId={userId}
 */
export async function cancelOrder(orderId: number, userId: number): Promise<ApiResponse<string>> {
  try {
    return await callApiWithMethod<never, ApiResponse<string>>(
      'PUT',
      `/api/orders/${orderId}/cancel?userId=${userId}`
    );
  } catch (error) {
    console.error('Error cancelling order:', error);
    return {
      resultCd: 1,
      message: 'Không thể hủy đơn hàng. Vui lòng thử lại.',
      data: null
    };
  }
}

/**
 * Mark an order as completed
 *
 * Endpoint: PUT /api/orders/{orderId}/complete?userId={userId}
 */
export async function completeOrder(orderId: number, userId: number): Promise<ApiResponse<string>> {
  try {
    return await callApiWithMethod<never, ApiResponse<string>>(
      'PUT',
      `/api/orders/${orderId}/complete?userId=${userId}`
    );
  } catch (error) {
    console.error('Error completing order:', error);
    return {
      resultCd: 1,
      message: 'Không thể hoàn thành đơn hàng. Vui lòng thử lại.',
      data: null
    };
  }
}

/**
 * Confirm a pending order (seller action)
 *
 * Endpoint: PUT /api/orders/{orderId}/confirm
 */
export async function confirmOrder(orderId: number, userId: number): Promise<ApiResponse<string>> {
  try {
    return await callApiWithMethod<never, ApiResponse<string>>(
      'PUT',
      `/api/orders/${orderId}/confirm`,
      undefined,
      { userId: String(userId) }
    );
  } catch (error) {
    console.error('Error confirming order:', error);
    return {
      resultCd: 1,
      message: 'Không thể xác nhận đơn hàng. Vui lòng thử lại.',
      data: null
    };
  }
}

/**
 * Update order status (seller action)
 *
 * Endpoint: PUT /api/orders/{orderId}/status
 */
export async function updateOrderStatus(orderId: number, status: string, userId: number): Promise<ApiResponse<string>> {
  try {
    return await callApiWithMethod<{ status: string }, ApiResponse<string>>(
      'PUT',
      `/api/orders/${orderId}/status`,
      { status },
      { userId: String(userId) }
    );
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      resultCd: 1,
      message: 'Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.',
      data: null
    };
  }
}
