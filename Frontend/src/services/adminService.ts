import { get, post, put, type ApiResponse } from "../utils/apiClient";
import { buildUrlWithParams } from "../utils/adminUtils";

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
    return get<ApiResponse<DashboardStats>>("/api/admin/dashboard/stats");
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
    return get<ApiResponse<PageResponse<UserDto>>>("/api/users", params);
}

/**
 * Update user status
 */
export async function updateUserStatus(userId: number, status: string) {
    const url = buildUrlWithParams(`/api/users/${userId}/status`, { status });
    return put<null, ApiResponse<UserDto>>(url, null);
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
    return get<ApiResponse<Category[]>>("/api/categories", params);
}

/**
 * Create a new category
 */
export async function createCategory(data: CategoryRequest) {
    return post<CategoryRequest, ApiResponse<Category>>("/api/categories", data);
}

/**
 * Update an existing category
 */
export async function updateCategory(id: number, data: CategoryRequest) {
    return put<CategoryRequest, ApiResponse<Category>>(`/api/categories/${id}`, data);
}

/**
 * Toggle category status
 */
export async function toggleCategoryStatus(id: number) {
    return put<null, ApiResponse<Category>>(`/api/categories/${id}/toggle-status`);
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
    return get<ApiResponse<ShopDto[]>>("/api/shops", params);
}

/**
 * Approve a shop
 */
export async function approveShop(id: number) {
    return put<null, ApiResponse<null>>(`/api/shops/${id}/approve`);
}

/**
 * Reject a shop
 */
export async function rejectShop(id: number, reason: string) {
    return put<{ reason: string }, ApiResponse<null>>(`/api/shops/${id}/reject`, { reason });
}

/**
 * Suspend a shop
 */
export async function suspendShop(id: number) {
    return put<null, ApiResponse<null>>(`/api/shops/${id}/suspend`);
}
