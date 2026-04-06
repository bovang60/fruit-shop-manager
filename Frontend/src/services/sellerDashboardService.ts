import { callApiWithMethod, type ApiResponse } from "../utils/apiClient";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED";

export interface SalesReportApiModel {
  totalOrders?: number;
  successfulOrders?: number;
  totalRevenue?: number | string;
  totalFruitsSold?: number;
}

export interface SellerOrderApiModel {
  orderId: number;
  receiverName: string;
  subTotal: number | string;
  shippingFee?: number | string;
  discountValue?: number | string;
  status: OrderStatus;
  createdAt: string;
}

export interface SellerProductApiModel {
  productId: number;
  stock: number;
  isActive?: boolean;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  lowStockItems: number;
}

export interface RecentOrder {
  orderId: number;
  receiverName: string;
  subTotal: number;
  status: OrderStatus;
}

export interface SellerDashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
}

export interface SellerDashboardOptions {
  recentLimit?: number;
  lowStockThreshold?: number;
}

function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function normalizeApiResponse<T>(
  response: ApiResponse<T> | T,
): ApiResponse<T> {
  if (response && typeof response === "object" && "resultCd" in response) {
    return response as ApiResponse<T>;
  }
  return {
    resultCd: 0,
    message: "Success",
    data: response as T,
  };
}

export async function getSellerDashboardData(
  shopId: number,
  options: SellerDashboardOptions = {},
): Promise<ApiResponse<SellerDashboardData>> {
  const recentLimit = options.recentLimit ?? 5;
  const lowStockThreshold = options.lowStockThreshold ?? 10;

  try {
    const [reportRes, ordersRes, fruitsRes] = await Promise.all([
      callApiWithMethod<never, ApiResponse<SalesReportApiModel> | SalesReportApiModel>(
        "GET",
        `/api/seller/reports/${shopId}`,
      ),
      callApiWithMethod<never, ApiResponse<SellerOrderApiModel[]> | SellerOrderApiModel[]>(
        "GET",
        `/api/seller/orders/shop/${shopId}`,
      ),
      callApiWithMethod<never, ApiResponse<SellerProductApiModel[]> | SellerProductApiModel[]>(
        "GET",
        `/api/seller/fruits/shop/${shopId}`,
      ),
    ]);

    const report = normalizeApiResponse<SalesReportApiModel>(reportRes).data ?? {};
    const orders = normalizeApiResponse<SellerOrderApiModel[]>(ordersRes).data ?? [];
    const fruits = normalizeApiResponse<SellerProductApiModel[]>(fruitsRes).data ?? [];

    const pendingOrders = orders.filter((order) => order.status === "PENDING")
      .length;

    const lowStockItems = fruits.filter((fruit) => {
      const isActive = fruit.isActive !== false;
      return isActive && (fruit.stock ?? 0) <= lowStockThreshold;
    }).length;

    const recentOrders = orders
      .slice(0, recentLimit)
      .map((order) => ({
        orderId: order.orderId,
        receiverName: order.receiverName,
        subTotal: Math.max(
          0,
          toNumber(order.subTotal) +
            toNumber(order.shippingFee) -
            toNumber(order.discountValue),
        ),
        status: order.status,
      }));

    const stats: DashboardStats = {
      totalRevenue: toNumber(report.totalRevenue),
      totalOrders: report.totalOrders ?? orders.length,
      pendingOrders,
      lowStockItems,
    };

    return {
      resultCd: 0,
      message: "Success",
      data: { stats, recentOrders },
    };
  } catch (error) {
    console.error("Error fetching seller dashboard:", error);
    return {
      resultCd: 1,
      message: "Không thể tải dữ liệu bảng điều khiển",
      data: null,
    };
  }
}

export function getSellerDashboardMessage(message: string): string {
  const ERROR_MESSAGES: Record<string, string> = {
    "Không tìm thấy Shop!": "Không tìm thấy cửa hàng",
  };

  return ERROR_MESSAGES[message] || message;
}
