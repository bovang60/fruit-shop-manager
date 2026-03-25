import { callApiWithMethod, get, post, put, type ApiResponse } from "../utils/apiClient";

export type SellerFruitStatus = "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED";

export interface SellerFruitDto {
  fruitId: number;
  fruitName: string;
  description?: string;
  price: number;
  stockQuantity: number;
  status: SellerFruitStatus;
  imageUrl?: string;
  categoryId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type SellerFruitQueryParams = Record<
  string,
  string | number | boolean | undefined
> & {
  page?: number;
  size?: number;
  search?: string;
  status?: SellerFruitStatus;
  categoryId?: number;
};

export interface CreateSellerFruitRequest {
  fruitName: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  categoryId?: number;
}

export interface UpdateSellerFruitRequest {
  fruitName?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  imageUrl?: string;
  categoryId?: number;
}

export interface UpdateSellerFruitStatusRequest {
  status: SellerFruitStatus;
}

export async function getSellerFruitsByShop(
  shopId: number,
  params?: SellerFruitQueryParams,
): Promise<ApiResponse<SellerFruitDto[]>> {
  try {
    return await get<ApiResponse<SellerFruitDto[]>>(
      `/api/fruits/shop/${shopId}`,
      params,
    );
  } catch (error) {
    console.error("Error fetching seller fruits:", error);
    return {
      resultCd: 1,
      message: "Không thể tải danh sách trái cây của cửa hàng",
      data: null,
    };
  }
}

export async function getSellerFruitById(
  fruitId: number,
): Promise<ApiResponse<SellerFruitDto>> {
  try {
    return await callApiWithMethod<never, ApiResponse<SellerFruitDto>>(
      "GET",
      `/api/fruits/${fruitId}`,
    );
  } catch (error) {
    console.error("Error fetching seller fruit details:", error);
    return {
      resultCd: 1,
      message: "Không thể tải thông tin trái cây",
      data: null,
    };
  }
}

export async function createSellerFruit(
  data: CreateSellerFruitRequest,
): Promise<ApiResponse<SellerFruitDto>> {
  try {
    return await post<CreateSellerFruitRequest, ApiResponse<SellerFruitDto>>(
      "/api/fruits",
      data,
    );
  } catch (error) {
    console.error("Error creating seller fruit:", error);
    return {
      resultCd: 1,
      message: "Không thể tạo mới trái cây",
      data: null,
    };
  }
}

export async function updateSellerFruit(
  fruitId: number,
  data: UpdateSellerFruitRequest,
): Promise<ApiResponse<SellerFruitDto>> {
  try {
    return await put<UpdateSellerFruitRequest, ApiResponse<SellerFruitDto>>(
      `/api/fruits/${fruitId}`,
      data,
    );
  } catch (error) {
    console.error("Error updating seller fruit:", error);
    return {
      resultCd: 1,
      message: "Không thể cập nhật trái cây",
      data: null,
    };
  }
}

export async function updateSellerFruitStatus(
  fruitId: number,
  status: SellerFruitStatus,
): Promise<ApiResponse<SellerFruitDto>> {
  try {
    return await callApiWithMethod<
      UpdateSellerFruitStatusRequest,
      ApiResponse<SellerFruitDto>
    >("PATCH", `/api/fruits/${fruitId}/status`, { status });
  } catch (error) {
    console.error("Error updating seller fruit status:", error);
    return {
      resultCd: 1,
      message: "Không thể cập nhật trạng thái sản phẩm",
      data: null,
    };
  }
}

export async function deleteSellerFruit(
  fruitId: number,
): Promise<ApiResponse<null>> {
  try {
    return await callApiWithMethod<never, ApiResponse<null>>(
      "DELETE",
      `/api/fruits/${fruitId}`,
    );
  } catch (error) {
    console.error("Error deleting seller fruit:", error);
    return {
      resultCd: 1,
      message: "Không thể xóa trái cây",
      data: null,
    };
  }
}

export function getSellerFruitDisplayMessage(message: string): string {
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
