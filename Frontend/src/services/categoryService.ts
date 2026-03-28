import { callApi, callApiWithMethod } from "../utils/apiClient";
import type { ApiResponse } from "../utils/apiClient";

// ============= Types =============

export const CategoryStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
} as const;

export type CategoryStatus = keyof typeof CategoryStatus;

export interface CategoryDto {
    categoryId: number;
    categoryName: string;
    description: string;
    status: CategoryStatus;
    productCount: number;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface CategoryFilter {
    search?: string;
    status?: string;
    sortByProductCount?: boolean;
    page?: number;
    size?: number;
    sort?: string;
}

export interface CreateCategoryDto {
    categoryName: string;
    description: string;
    status: CategoryStatus;
}

export interface UpdateCategoryPayload {
    categoryName: string;
    description?: string;
    status?: CategoryStatus;
}


// ============= API Functions =============

/**
 * Get all categories with pagination and filtering
 */
export async function getCategories(filter: CategoryFilter): Promise<ApiResponse<PageResponse<CategoryDto>>> {
    const params = new URLSearchParams();
    if (filter.search) params.append("search", filter.search);
    if (filter.status) params.append("status", filter.status);
    if (filter.sortByProductCount !== undefined) params.append("sortByProductCount", filter.sortByProductCount.toString());
    if (filter.page !== undefined) params.append("page", filter.page.toString());
    if (filter.size !== undefined) params.append("size", filter.size.toString());
    if (filter.sort) params.append("sort", filter.sort);

    const url = `/api/categories?${params.toString()}`;
    try {
        return await callApi<undefined, ApiResponse<PageResponse<CategoryDto>>>(url);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi lấy danh sách danh mục", data: null };
    }
}


/**
 * Get category by ID
 */
export async function getCategoryById(id: number): Promise<ApiResponse<CategoryDto>> {
    try {
        return await callApi<undefined, ApiResponse<CategoryDto>>(`/api/categories/${id}`);
    } catch (error) {
        console.error("Error fetching category:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi lấy thông tin danh mục", data: null };
    }
}


/**
 * Create a new category
 */
export async function createCategory(data: CreateCategoryDto): Promise<ApiResponse<CategoryDto>> {
    try {
        return await callApiWithMethod<CreateCategoryDto, ApiResponse<CategoryDto>>("POST", "/api/categories", data);
    } catch (error) {
        console.error("Error creating category:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi tạo danh mục", data: null };
    }
}


/**
 * Update an existing category
 */
export async function updateCategory(id: number, data: UpdateCategoryPayload): Promise<ApiResponse<CategoryDto>> {
    try {
        return await callApiWithMethod<UpdateCategoryPayload, ApiResponse<CategoryDto>>("PUT", `/api/categories/${id}`, data);
    } catch (error) {
        console.error("Error updating category:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi cập nhật danh mục", data: null };
    }
}


/**
 * Delete a category
 */
export async function deleteCategory(id: number): Promise<ApiResponse<CategoryDto | null>> {
    try {
        return await callApiWithMethod<undefined, ApiResponse<CategoryDto | null>>("DELETE", `/api/categories/${id}`);
    } catch (error) {
        console.error("Error deleting category:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi xóa danh mục", data: null };
    }
}


// ============= Helper Functions =============

/**
 * Map API response to user-friendly messages if needed
 */
export function getCategoryErrorMessage(message: string): string {
    const ERROR_MESSAGES: Record<string, string> = {
        "Category not found": "Không tìm thấy danh mục",
        "Category name already exists": "Tên danh mục đã tồn tại",
    };
    return ERROR_MESSAGES[message] || message;
}
