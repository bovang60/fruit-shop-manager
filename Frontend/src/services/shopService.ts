import { callApiWithMethod, type ApiResponse } from "../utils/apiClient";

// ============= Types =============

export const ShopStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED'
} as const;

export type ShopStatus = keyof typeof ShopStatus;


export interface ShopDto {
    shopId: number;
    shopName: string;
    ownerId: number;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    businessAddress: string;
    description: string;
    status: ShopStatus;
    rejectReason?: string;
    createdAt: string;
    documentUrls: string[];
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

export interface ShopFilter {
    status?: string;
    page?: number;
    size?: number;
    sort?: string;
}

// ============= API Functions =============

/**
 * Get all shops with pagination and filtering
 */
export async function getShops(filter: ShopFilter): Promise<ApiResponse<PageResponse<ShopDto>>> {
    const params = new URLSearchParams();
    if (filter.status) params.append("status", filter.status);
    if (filter.page !== undefined) params.append("page", filter.page.toString());
    if (filter.size !== undefined) params.append("size", filter.size.toString());
    if (filter.sort) params.append("sort", filter.sort);

    const url = `/api/shops?${params.toString()}`;
    try {
        return await callApiWithMethod<undefined, ApiResponse<PageResponse<ShopDto>>>("GET", url);
    } catch (error) {
        console.error("Error fetching shops:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi lấy danh sách cửa hàng", data: null };
    }
}

/**
 * Approve a shop
 */
export async function approveShop(shopId: number): Promise<ApiResponse<ShopDto>> {
    try {
        return await callApiWithMethod<undefined, ApiResponse<ShopDto>>("PUT", `/api/shops/${shopId}/approve`);
    } catch (error) {
        console.error("Error approving shop:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi phê duyệt cửa hàng", data: null };
    }
}


/**
 * Reject a shop
 */
export async function rejectShop(shopId: number, reason: string): Promise<ApiResponse<ShopDto>> {
    try {
        return await callApiWithMethod<{ reason: string }, ApiResponse<ShopDto>>("PUT", `/api/shops/${shopId}/reject`, { reason });
    } catch (error) {
        console.error("Error rejecting shop:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi từ chối cửa hàng", data: null };
    }
}


// ============= Helper Functions =============

/**
 * Map API response to user-friendly messages if needed
 */
export function getShopErrorMessage(message: string): string {
    const ERROR_MESSAGES: Record<string, string> = {
        "Shop not found": "Không tìm thấy cửa hàng",
        "Permission denied": "Bạn không có quyền thực hiện hành động này",
    };
    return ERROR_MESSAGES[message] || message;
}
