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
    fruitCount: number;
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
    sortByFruitCount?: boolean;
    page?: number;
    size?: number;
    sort?: string;
}

export interface CreateCategoryDto {
    categoryName: string;
    description: string;
    status: CategoryStatus;
}

// ============= API Functions =============

/**
 * Get all categories with pagination and filtering
 */
export async function getCategories(filter: CategoryFilter): Promise<ApiResponse<PageResponse<CategoryDto>>> {
    const params = new URLSearchParams();
    if (filter.search) params.append("search", filter.search);
    if (filter.sortByFruitCount !== undefined) params.append("sortByFruitCount", filter.sortByFruitCount.toString());
    if (filter.page !== undefined) params.append("page", filter.page.toString());
    if (filter.size !== undefined) params.append("size", filter.size.toString());
    if (filter.sort) params.append("sort", filter.sort);

    const url = `/api/categories?${params.toString()}`;
    return callApi<undefined, ApiResponse<PageResponse<CategoryDto>>>(url);
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: number): Promise<ApiResponse<CategoryDto>> {
    return callApi<undefined, ApiResponse<CategoryDto>>(`/api/categories/${id}`);
}

/**
 * Create a new category
 */
export async function createCategory(data: CreateCategoryDto): Promise<ApiResponse<CategoryDto>> {
    return callApiWithMethod<CreateCategoryDto, ApiResponse<CategoryDto>>("POST", "/api/categories", data);
}

/**
 * Update an existing category
 */
export async function updateCategory(id: number, data: Partial<CreateCategoryDto>): Promise<ApiResponse<CategoryDto>> {
    return callApiWithMethod<Partial<CreateCategoryDto>, ApiResponse<CategoryDto>>("PUT", `/api/categories/${id}`, data);
}

/**
 * Delete a category
 */
export async function deleteCategory(id: number): Promise<ApiResponse<null>> {
    return callApiWithMethod<undefined, ApiResponse<null>>("DELETE", `/api/categories/${id}`);
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
