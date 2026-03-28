import { callApiWithMethod, getAuthToken, authHeader } from "../utils/apiClient";
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

export interface DailyOrderDto {
    date: string; // Format: YYYY-MM-DD
    orderCount: number;
}

export interface TopSellerDto {
    shopName: string;
    totalUnitsSold: number;
    totalRevenue: number;
    status: string;
}

export interface DashboardDto {
    activeUsers: number;
    totalOrders: number;
    cancellationRate: number;
    totalRevenue: number;
    totalActiveSellers: number;
    pendingShopApprovals: number;
    ordersLast7Days: DailyOrderDto[];
    topSellers: TopSellerDto[];
}

/**
 * Fetch dashboard statistics
 */
export async function getDashboardStats(): Promise<ApiResponse<DashboardDto>> {
    try {
        const token = getAuthToken();
        const headers = token ? authHeader(token) : {};
        return await callApiWithMethod<never, ApiResponse<DashboardDto>>('GET', '/api/admin/dashboard/stats', undefined, headers);
    } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
        return { resultCd: 1, message: 'Không thể tải dữ liệu thống kê quản trị', data: null };
    }
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
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    return callApiWithMethod<undefined, ApiResponse<PageResponse<UserDto>>>("GET", url, undefined, headers);
}

/**
 * Update user status
 */
export async function updateUserStatus(userId: number, status: string) {
    const url = buildUrlWithParams(`/api/users/${userId}/status`, { status });
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    return callApiWithMethod<null, ApiResponse<UserDto>>("PUT", url, null, headers);
}

// ============= Category Management Types & API =============

export interface Category {
    id: number;
    name: string;
    description: string;
    status: "ACTIVE" | "INACTIVE";
    productCount: number;
}

export interface CategoryRequest {
    name: string;
    description: string;
    status: string;
}

/**
 * Get all categories
 */
export async function getCategories(params?: { search?: string; sortByProductCount?: boolean }) {
    const url = buildUrlWithParams("/api/categories", params);
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    return callApiWithMethod<undefined, ApiResponse<Category[]>>("GET", url, undefined, headers);
}

/**
 * Create a new category
 */
export async function createCategory(data: CategoryRequest) {
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    return callApiWithMethod<CategoryRequest, ApiResponse<Category>>("POST", "/api/categories", data, headers);
}

/**
 * Update an existing category
 */
export async function updateCategory(id: number, data: CategoryRequest) {
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    return callApiWithMethod<CategoryRequest, ApiResponse<Category>>("PUT", `/api/categories/${id}`, data, headers);
}

/**
 * Toggle category status
 */
export async function toggleCategoryStatus(id: number) {
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    return callApiWithMethod<null, ApiResponse<Category>>("PUT", `/api/categories/${id}/toggle-status`, null, headers);
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
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    return callApiWithMethod<undefined, ApiResponse<ShopDto[]>>("GET", url, undefined, headers);
}

/**
 * Approve a shop
 */
export async function approveShop(id: number) {
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    return callApiWithMethod<null, ApiResponse<null>>("PUT", `/api/shops/${id}/approve`, null, headers);
}

/**
 * Reject a shop
 */
export async function rejectShop(id: number, reason: string) {
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    return callApiWithMethod<{ reason: string }, ApiResponse<null>>("PUT", `/api/shops/${id}/reject`, { reason }, headers);
}

/**
 * Suspend a shop
 */
export async function suspendShop(id: number) {
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    return callApiWithMethod<null, ApiResponse<null>>("PUT", `/api/shops/${id}/suspend`, null, headers);
}
