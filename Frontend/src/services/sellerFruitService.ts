import { callApiWithMethod, get, post, put, type ApiResponse } from "../utils/apiClient";

export interface SellerProductDto {
  productId: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  isActive?: boolean;
  imageUrl?: string;
  categoryId?: number;
  discount?: number;
  originalPrice?: number;
  unit?: string;
  origin?: "LOCAL" | "IMPORTED";
  isOrganic?: boolean;
}

export type SellerProductQueryParams = Record<
  string,
  string | number | boolean | undefined
> & {
  page?: number;
  size?: number;
  search?: string;
  isActive?: boolean;
  categoryId?: number;
};

export interface CreateSellerProductRequest {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: number;
  category?: { categoryId: number };
  discount?: number;
  originalPrice?: number;
  unit?: string;
  origin?: "LOCAL" | "IMPORTED";
  isOrganic?: boolean;
  isActive?: boolean;
}

export interface UpdateSellerProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: number;
  category?: { categoryId: number };
  discount?: number;
  originalPrice?: number;
  unit?: string;
  origin?: "LOCAL" | "IMPORTED";
  isOrganic?: boolean;
  isActive?: boolean;
}

export interface UpdateSellerProductStatusRequest {
  isActive: boolean;
}

export async function getSellerFruitsByShop(
  shopId: number,
  params?: SellerProductQueryParams,
): Promise<ApiResponse<SellerProductDto[]>> {
  try {
    return await get<ApiResponse<SellerProductDto[]>>(
      `/api/seller/fruits/shop/${shopId}`,
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
): Promise<ApiResponse<SellerProductDto>> {
  try {
    return await callApiWithMethod<never, ApiResponse<SellerProductDto>>(
      "GET",
      `/api/seller/fruits/${fruitId}`,
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
  shopId: number,
  data: CreateSellerProductRequest,
): Promise<ApiResponse<SellerProductDto>> {
  try {
    return await post<CreateSellerProductRequest, ApiResponse<SellerProductDto>>(
      `/api/seller/fruits/${shopId}`,
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
  data: UpdateSellerProductRequest,
): Promise<ApiResponse<SellerProductDto>> {
  try {
    return await put<UpdateSellerProductRequest, ApiResponse<SellerProductDto>>(
      `/api/seller/fruits/${fruitId}`,
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

export async function uploadSellerFruitImage(
  fruitId: number,
  imageFile: File,
): Promise<ApiResponse<SellerProductDto>> {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/seller/fruits/${fruitId}/image`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<SellerProductDto> = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading seller fruit image:", error);
    return {
      resultCd: 1,
      message: "Không thể tải ảnh sản phẩm lên",
      data: null,
    };
  }
}

export async function updateSellerFruitStatus(
  fruitId: number,
  isActive: boolean,
): Promise<ApiResponse<SellerProductDto>> {
  try {
    return await callApiWithMethod<
      UpdateSellerProductStatusRequest,
      ApiResponse<SellerProductDto>
    >("PATCH", `/api/seller/fruits/${fruitId}/status`, { isActive });
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
      `/api/seller/fruits/${fruitId}`,
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
    "Fruit not found": "Không tìm thấy sản phẩm",
    "Fruit name already exists": "Tên sản phẩm đã tồn tại",
    "Invalid fruit data": "Dữ liệu sản phẩm không hợp lệ",
    "Price must be greater than 0": "Giá phải lớn hơn 0",
    "Stock quantity must be greater than or equal to 0":
      "Số lượng tồn kho phải lớn hơn hoặc bằng 0",
    "Access denied": "Bạn không có quyền thực hiện thao tác này",
    "Validation failed": "Dữ liệu nhập chưa hợp lệ",
  };

  return ERROR_MESSAGES[message] || message;
}
