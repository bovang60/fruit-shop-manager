import { callApiWithMethod, type ApiResponse } from '../utils/apiClient';

export interface OrderRequest {
  userId: number;
  fullName: string;
  address: string;
  phone: string;
  shippingMethodId: number;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
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
  userId: number;
  fullName: string;
  address: string;
  phone: string;
  shippingMethodId: number;
  shippingMethodName?: string;
  totalPrice: number;
  shippingFee?: number;
  status: string;
  createdAt: string;
  items?: OrderItemDto[];
}

/**
 * Create a new order
 *
 * Endpoint: POST /api/orders
 */
export async function createOrder(request: OrderRequest): Promise<ApiResponse<OrderDto>> {
  try {
    return await callApiWithMethod<OrderRequest, ApiResponse<OrderDto>>(
      'POST',
      '/api/orders',
      request
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
    return await callApiWithMethod<never, ApiResponse<OrderDto[]>>(
      'GET',
      `/api/orders/user/${userId}`
    );
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
    return await callApiWithMethod<never, ApiResponse<OrderDto>>(
      'GET',
      `/api/orders/${orderId}?userId=${userId}`
    );
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
 * Endpoint: PUT /api/orders/{orderId}/cancel
 */
export async function cancelOrder(orderId: number): Promise<ApiResponse<OrderDto>> {
  try {
    return await callApiWithMethod<never, ApiResponse<OrderDto>>(
      'PUT',
      `/api/orders/${orderId}/cancel`
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
 * Endpoint: PUT /api/orders/{orderId}/complete
 */
export async function completeOrder(orderId: number): Promise<ApiResponse<OrderDto>> {
  try {
    return await callApiWithMethod<never, ApiResponse<OrderDto>>(
      'PUT',
      `/api/orders/${orderId}/complete`
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
export async function confirmOrder(orderId: number): Promise<ApiResponse<OrderDto>> {
  try {
    return await callApiWithMethod<never, ApiResponse<OrderDto>>(
      'PUT',
      `/api/orders/${orderId}/confirm`
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
export async function updateOrderStatus(orderId: number, status: string): Promise<ApiResponse<OrderDto>> {
  try {
    return await callApiWithMethod<{ status: string }, ApiResponse<OrderDto>>(
      'PUT',
      `/api/orders/${orderId}/status`,
      { status }
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
