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

export interface RegisterShopRequest {
    ownerId: number;
    shopName: string;
    description?: string;
    address: string;
    taxCode?: string;
    shopType: string;
    businessName: string;
    businessAddress: string;
    pickupAddress: string;
    shippingMethodIds: number[];
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

export async function getShopByOwnerId(ownerId: number): Promise<ApiResponse<ShopDto | null>> {
    try {
        const response = await getShops({ page: 0, size: 200, sort: 'createdAt,desc' });
        if (response.resultCd !== 0 || !response.data) {
            return { resultCd: response.resultCd, message: response.message, data: null };
        }

        const shop = response.data.content.find((item) => item.ownerId === ownerId) || null;
        return { resultCd: 0, message: shop ? 'Thành công' : 'Shop not found', data: shop };
    } catch (error) {
        console.error("Error finding seller shop by owner:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi lấy thông tin cửa hàng của seller", data: null };
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

/**
 * Suspend a shop
 */
export async function suspendShop(shopId: number): Promise<ApiResponse<ShopDto>> {
    try {
        return await callApiWithMethod<undefined, ApiResponse<ShopDto>>("PUT", `/api/shops/${shopId}/suspend`);
    } catch (error) {
        console.error("Error suspending shop:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi đình chỉ cửa hàng", data: null };
    }
}


/**
 * Check if a shop name already exists in the system
 * Returns true if the name is taken, false if it's available
 */
export async function checkShopNameExists(name: string): Promise<ApiResponse<boolean>> {
    const trimmed = name.trim();
    try {
        return await callApiWithMethod<undefined, ApiResponse<boolean>>(
            'GET',
            `/api/shops/check-name?name=${encodeURIComponent(trimmed)}`
        );
    } catch (error) {
        console.error('Lỗi khi kiểm tra tên shop:', error);
        return { resultCd: 1, message: 'Lỗi kết nối khi kiểm tra tên cửa hàng', data: null };
    }
}


/**
 * Register a new shop (user becomes seller)
 */
export async function registerShop(payload: RegisterShopRequest): Promise<ApiResponse<ShopDto>> {
    try {
        return await callApiWithMethod<RegisterShopRequest, ApiResponse<ShopDto>>(
            'POST',
            '/api/shops/register',
            payload
        );
    } catch (error) {
        console.error('Lỗi khi đăng ký cửa hàng:', error);
        return { resultCd: 1, message: 'Lỗi kết nối khi đăng ký cửa hàng', data: null };
    }
}


// ============= Helper Functions =============

/**
 * Map API response to user-friendly messages if needed
 */
export function getShopErrorMessage(message: string): string {
    const ERROR_MESSAGES: Record<string, string> = {
        'Shop not found': 'Không tìm thấy cửa hàng',
        'Permission denied': 'Bạn không có quyền thực hiện hành động này',
        'User already has a registered shop application': 'Bạn đã có yêu cầu mở cửa hàng đang chờ duyệt. Vui lòng đợi kết quả xét duyệt.',
    };
    return ERROR_MESSAGES[message] || message;
}
