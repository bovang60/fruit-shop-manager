import { callApi, callApiWithMethod } from "../utils/apiClient";
import type { ApiResponse } from "../utils/apiClient";

/**
 * Helper to build URL with query parameters
 */
function buildUrlWithParams(url: string, params?: any): string {
    if (!params) return url;
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, String(value));
        }
    });
    const queryString = query.toString();
    return queryString ? `${url}?${queryString}` : url;
}

// ============= Dashboard Types & API =============

export interface DashboardStats {
    grossMerchandiseValue: number;
    gmvGrowth: number;
    totalActiveSellers: number;
    sellerGrowth: number;
    acquisitionRate: number;
    acquisitionGrowth: number;
    pendingShopApprovals: number;
    pendingGrowth: number;
    revenueVsExpenses: Array<{
        date: string;
        revenue: number;
        expenses: number;
    }>;
    topSellers: Array<{
        shopName: string;
        totalSales: number;
        status: string;
    }>;
}

/**
 * Fetch dashboard statistics
 */
export async function getDashboardStats() {
    return callApi<undefined, ApiResponse<DashboardStats>>("/api/admin/dashboard/stats");
}

// ============= User Management Types & API =============

export interface UserDto {
    userId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    status: string;
    createdAt: string;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export interface UserQueryParams {
    search?: string;
    status?: string;
    role?: string;
    page?: number;
    size?: number;
    sort?: string;
}

/**
 * Get users with pagination and search
 */
export async function getUsers(params?: UserQueryParams) {
    const url = buildUrlWithParams("/api/users", params);
    return callApi<undefined, ApiResponse<PageResponse<UserDto>>>(url);
}

/**
 * Update user status
 */
export async function updateUserStatus(userId: number, status: string) {
    const url = buildUrlWithParams(`/api/users/${userId}/status`, { status });
    return callApiWithMethod<null, ApiResponse<UserDto>>("PUT", url, null);
}

// ============= Category Management Types & API =============

export interface Category {
    id: number;
    name: string;
    description: string;
    status: "ACTIVE" | "INACTIVE";
    fruitCount: number;
}

export interface CategoryRequest {
    name: string;
    description: string;
    status: string;
}

/**
 * Get all categories
 */
export async function getCategories(params?: { search?: string; sortByFruitCount?: boolean }) {
    const url = buildUrlWithParams("/api/categories", params);
    return callApi<undefined, ApiResponse<Category[]>>(url);
}

/**
 * Create a new category
 */
export async function createCategory(data: CategoryRequest) {
    return callApiWithMethod<CategoryRequest, ApiResponse<Category>>("POST", "/api/categories", data);
}

/**
 * Update an existing category
 */
export async function updateCategory(id: number, data: CategoryRequest) {
    return callApiWithMethod<CategoryRequest, ApiResponse<Category>>("PUT", `/api/categories/${id}`, data);
}

/**
 * Toggle category status
 */
export async function toggleCategoryStatus(id: number) {
    return callApiWithMethod<null, ApiResponse<Category>>("PUT", `/api/categories/${id}/toggle-status`, null);
}

// ============= Shop Management Types & API =============

export interface ShopDto {
    id: number;
    shopName: string;
    ownerName: string;
    status: "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";
    createdAt: string;
}

/**
 * Get shops by status
 */
export async function getShops(params: { status: string; page?: number }) {
    const url = buildUrlWithParams("/api/shops", params);
    return callApi<undefined, ApiResponse<ShopDto[]>>(url);
}

/**
 * Approve a shop
 */
export async function approveShop(id: number) {
    return callApiWithMethod<null, ApiResponse<null>>("PUT", `/api/shops/${id}/approve`, null);
}

/**
 * Reject a shop
 */
export async function rejectShop(id: number, reason: string) {
    return callApiWithMethod<{ reason: string }, ApiResponse<null>>("PUT", `/api/shops/${id}/reject`, { reason });
}

/**
 * Suspend a shop
 */
export async function suspendShop(id: number) {
    return callApiWithMethod<null, ApiResponse<null>>("PUT", `/api/shops/${id}/suspend`, null);
}
