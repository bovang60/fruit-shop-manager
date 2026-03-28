/*
import {
  callApiWithMethod,
  get,
  post,
  put,
  type ApiResponse,
} from "../utils/apiClient";

export type FruitStatus = "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED";

export interface FruitDto {
  fruitId: number;
  fruitName: string;
  description?: string;
  price: number;
  stockQuantity: number;
  status: FruitStatus;
  imageUrl?: string;
  categoryId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type FruitQueryParams = Record<
  string,
  string | number | boolean | undefined
> & {
  page?: number;
  size?: number;
  search?: string;
  status?: FruitStatus;
  categoryId?: number;
};

export interface CreateFruitRequest {
  fruitName: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  categoryId?: number;
}

export interface UpdateFruitRequest {
  fruitName?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  imageUrl?: string;
  categoryId?: number;
}

export interface UpdateFruitStatusRequest {
  status: FruitStatus;
}

export async function getFruits(
  params?: FruitQueryParams,
): Promise<ApiResponse<FruitDto[]>> {
  try {
    return await get<ApiResponse<FruitDto[]>>("/api/fruits", params);
  } catch (error) {
    console.error("Error fetching fruits:", error);
    return {
      resultCd: 1,
      message: "Không thể tải danh sách trái cây",
      data: null,
    };
  }
}

export async function getFruitsByShop(
  shopId: number,
): Promise<ApiResponse<FruitDto[]>> {
  try {
    return await callApiWithMethod<never, ApiResponse<FruitDto[]>>(
      "GET",
      `/api/fruits/shop/${shopId}`,
    );
  } catch (error) {
    console.error("Error fetching fruits by shop:", error);
    return {
      resultCd: 1,
      message: "Không thể tải danh sách trái cây của cửa hàng",
      data: null,
    };
  }
}

export async function getFruitById(
  fruitId: number,
): Promise<ApiResponse<FruitDto>> {
  try {
    return await callApiWithMethod<never, ApiResponse<FruitDto>>(
      "GET",
      `/api/fruits/${fruitId}`,
    );
  } catch (error) {
    console.error("Error fetching fruit details:", error);
    return {
      resultCd: 1,
      message: "Không thể tải thông tin trái cây",
      data: null,
    };
  }
}

export async function createFruit(
  data: CreateFruitRequest,
): Promise<ApiResponse<FruitDto>> {
  try {
    return await post<CreateFruitRequest, ApiResponse<FruitDto>>(
      "/api/fruits",
      data,
    );
  } catch (error) {
    console.error("Error creating fruit:", error);
    return {
      resultCd: 1,
      message: "Không thể tạo mới trái cây",
      data: null,
    };
  }
}

export async function updateFruit(
  fruitId: number,
  data: UpdateFruitRequest,
): Promise<ApiResponse<FruitDto>> {
  try {
    return await put<UpdateFruitRequest, ApiResponse<FruitDto>>(
      `/api/fruits/${fruitId}`,
      data,
    );
  } catch (error) {
    console.error("Error updating fruit:", error);
    return {
      resultCd: 1,
      message: "Không thể cập nhật trái cây",
      data: null,
    };
  }
}

export async function updateFruitStatus(
  fruitId: number,
  status: FruitStatus,
): Promise<ApiResponse<FruitDto>> {
  try {
    return await callApiWithMethod<
      UpdateFruitStatusRequest,
      ApiResponse<FruitDto>
    >("PATCH", `/api/fruits/${fruitId}/status`, { status });
  } catch (error) {
    console.error("Error updating fruit status:", error);
    return {
      resultCd: 1,
      message: "Không thể cập nhật trạng thái sản phẩm",
      data: null,
    };
  }
}

export async function deleteFruit(
  fruitId: number,
): Promise<ApiResponse<null>> {
  try {
    return await callApiWithMethod<never, ApiResponse<null>>(
      "DELETE",
      `/api/fruits/${fruitId}`,
    );
  } catch (error) {
    console.error("Error deleting fruit:", error);
    return {
      resultCd: 1,
      message: "Không thể xóa trái cây",
      data: null,
    };
  }
}

export function getFruitDisplayMessage(message: string): string {
  const ERROR_MESSAGES: Record<string, string> = {
    "Fruit not found": "Không tìm thấy trái cây",
    "Fruit name already exists": "Tên trái cây đã tồn tại",
    "Invalid fruit data": "Dữ liệu trái cây không hợp lệ",
    "Price must be greater than 0": "Giá phải lớn hơn 0",
    "Stock quantity must be greater than or equal to 0":
      "Số lượng tồn kho phải lớn hơn hoặc bằng 0",
    "Access denied": "Bạn không có quyền thực hiện thao tác này",
    "Validation failed": "Dữ liệu nhập chưa hợp lệ",
  };

  return ERROR_MESSAGES[message] || message;
}
 */
