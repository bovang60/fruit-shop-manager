import { callApiWithMethod, type ApiResponse } from "../utils/apiClient";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export type OrderFilterStatus = OrderStatus | "ALL";

export interface SellerOrderApiModel {
  orderId: number;
  receiverName: string;
  receiverPhone: string;
  shippingAddress?: string;
  note?: string;
  subTotal: number | string;
  shippingFee?: number | string;
  discountValue?: number | string;
  paymentMethod?: string;
  paymentStatus?: string;
  status: OrderStatus;
  createdAt: string;
}

export interface SellerOrderDto {
  orderId: number;
  receiverName: string;
  receiverPhone: string;
  shippingAddress?: string;
  note?: string;
  subTotal: number;
  shippingFee: number;
  discountValue: number;
  paymentMethod?: string;
  paymentStatus?: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function mapOrder(order: SellerOrderApiModel): SellerOrderDto {
  const subTotal = toNumber(order.subTotal);
  const shippingFee = toNumber(order.shippingFee);
  const discountValue = toNumber(order.discountValue);
  const totalAmount = Math.max(0, subTotal + shippingFee - discountValue);

  return {
    orderId: order.orderId,
    receiverName: order.receiverName,
    receiverPhone: order.receiverPhone,
    shippingAddress: order.shippingAddress,
    note: order.note,
    subTotal,
    shippingFee,
    discountValue,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    totalAmount,
    status: order.status,
    createdAt: order.createdAt,
  };
}

function normalizeOrderListResponse(
  response: ApiResponse<SellerOrderApiModel[]> | SellerOrderApiModel[],
): ApiResponse<SellerOrderApiModel[]> {
  if (Array.isArray(response)) {
    return { resultCd: 0, message: "Success", data: response };
  }

  return {
    resultCd: response.resultCd ?? 0,
    message: response.message ?? "Success",
    data: response.data ?? [],
  };
}

function normalizeOrderResponse(
  response: ApiResponse<SellerOrderApiModel> | SellerOrderApiModel,
): ApiResponse<SellerOrderApiModel> {
  if (!response) {
    return { resultCd: 1, message: "Không tìm thấy đơn hàng", data: null };
  }

  if (typeof response === "object" && "data" in response) {
    return {
      resultCd: response.resultCd ?? 0,
      message: response.message ?? "Success",
      data: response.data ?? null,
    };
  }

  return {
    resultCd: 0,
    message: "Success",
    data: response,
  };
}

export async function getSellerOrdersByShop(
  shopId: number,
  status: OrderFilterStatus = "ALL",
): Promise<ApiResponse<SellerOrderDto[]>> {
  try {
    const response = await callApiWithMethod<
      never,
      ApiResponse<SellerOrderApiModel[]> | SellerOrderApiModel[]
    >("GET", `/api/seller/orders/shop/${shopId}`);

    const normalizedResponse = normalizeOrderListResponse(response);
    if (normalizedResponse.resultCd !== 0) {
      return {
        resultCd: normalizedResponse.resultCd,
        message: normalizedResponse.message || "Không thể tải danh sách đơn hàng",
        data: null,
      };
    }

    const mappedOrders = (normalizedResponse.data ?? []).map(mapOrder);
    const filteredOrders =
      status === "ALL"
        ? mappedOrders
        : mappedOrders.filter((order) => order.status === status);

    return {
      resultCd: 0,
      message: "Success",
      data: filteredOrders,
    };
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    return {
      resultCd: 1,
      message: "Không thể tải danh sách đơn hàng",
      data: null,
    };
  }
}

export async function getSellerOrderById(
  orderId: number,
): Promise<ApiResponse<SellerOrderDto>> {
  try {
    const response = await callApiWithMethod<
      never,
      ApiResponse<SellerOrderApiModel> | SellerOrderApiModel
    >("GET", `/api/seller/orders/${orderId}`);

    const normalizedResponse = normalizeOrderResponse(response);
    if (normalizedResponse.resultCd !== 0) {
      return {
        resultCd: normalizedResponse.resultCd,
        message: normalizedResponse.message || "Không thể tải chi tiết đơn hàng",
        data: null,
      };
    }

    const data = normalizedResponse.data;
    if (!data || Array.isArray(data)) {
      return { resultCd: 1, message: "Không tìm thấy đơn hàng", data: null };
    }

    return {
      resultCd: 0,
      message: "Success",
      data: mapOrder(data),
    };
  } catch (error) {
    console.error("Error fetching order details:", error);
    return {
      resultCd: 1,
      message: "Không thể tải chi tiết đơn hàng",
      data: null,
    };
  }
}

export async function updateSellerOrderStatus(
  orderId: number,
  status: OrderStatus,
): Promise<ApiResponse<SellerOrderDto>> {
  try {
    const url = `/api/seller/orders/${orderId}/status?status=${encodeURIComponent(
      status,
    )}`;
    const response = await callApiWithMethod<
      never,
      ApiResponse<SellerOrderApiModel> | SellerOrderApiModel
    >("PATCH", url);

    const normalizedResponse = normalizeOrderResponse(response);
    if (normalizedResponse.resultCd !== 0) {
      return {
        resultCd: normalizedResponse.resultCd,
        message:
          normalizedResponse.message || "Không thể cập nhật trạng thái đơn hàng",
        data: null,
      };
    }

    const data = normalizedResponse.data;
    if (!data || Array.isArray(data)) {
      return {
        resultCd: 1,
        message: "Không thể cập nhật trạng thái đơn hàng",
        data: null,
      };
    }

    return {
      resultCd: 0,
      message: "Cập nhật trạng thái đơn hàng thành công",
      data: mapOrder(data),
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      resultCd: 1,
      message: "Không thể cập nhật trạng thái đơn hàng",
      data: null,
    };
  }
}

export function getOrderDisplayMessage(message: string): string {
  const ERROR_MESSAGES: Record<string, string> = {
    "Order not found": "Không tìm thấy đơn hàng",
    "Order already completed": "Đơn hàng đã hoàn tất",
    "Order already cancelled": "Đơn hàng đã bị hủy",
    "Access denied": "Bạn không có quyền thực hiện thao tác này",
  };

  return ERROR_MESSAGES[message] || message;
}
