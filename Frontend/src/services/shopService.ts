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
    regDate?: string;
    taxCode?: string;
    shopType?: string;
    businessName?: string;
    pickupAddress?: string;
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
 * Check if a tax code already exists in the system
 * Returns true if the tax code is taken, false if it's available
 */
export async function checkTaxCodeExists(taxCode: string): Promise<ApiResponse<boolean>> {
    const trimmed = taxCode.trim();
    if (!trimmed) return { resultCd: 1, message: 'Mã số thuế không hợp lệ', data: null };
    try {
        return await callApiWithMethod<undefined, ApiResponse<boolean>>(
            'GET',
            `/api/shops/check-tax?taxCode=${encodeURIComponent(trimmed)}`
        );
    } catch (error) {
        console.error('Lỗi khi kiểm tra mã số thuế:', error);
        return { resultCd: 1, message: 'Lỗi kết nối khi kiểm tra mã số thuế', data: null };
    }
}


/**
 * Check if the user is allowed to register a shop
 * Returns true if can register, false if already has a shop/pending application
 */
export async function checkCanRegisterShop(ownerId: number): Promise<ApiResponse<boolean>> {
    try {
        return await callApiWithMethod<undefined, ApiResponse<boolean>>(
            'GET', 
            `/api/shops/can-register/${ownerId}`
        );
    } catch (error) {
        console.error('Lỗi khi kiểm tra quyền đăng ký:', error);
        return { resultCd: 1, message: 'Lỗi kết nối khi kiểm tra quyền đăng ký', data: false };
    }
}

/**
 * Get detailed shop status for a user
 */
export async function checkShopStatus(ownerId: number): Promise<ApiResponse<ShopDto>> {
    try {
        return await callApiWithMethod<undefined, ApiResponse<ShopDto>>(
            'GET',
            `/api/shops/check-status/${ownerId}`
        );
    } catch (error) {
        console.error('Lỗi khi lấy trạng thái shop:', error);
        return { resultCd: 1, message: 'Lỗi kết nối khi lấy trạng thái cửa hàng', data: null };
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
        'Đơn đăng ký của bạn đang chờ phê duyệt': 'Bạn đã có đơn đăng ký đang trong quá trình xét duyệt.',
        'Bạn đã mở shop thành công rồi': 'Bạn đã là người bán trên hệ thống.',
        'Shop của bạn đang bị đình chỉ': 'Cửa hàng của bạn đang bị tạm khóa. Vui lòng liên hệ hỗ trợ.',
        'Tên cửa hàng đã tồn tại, vui lòng chọn tên khác': 'Tên cửa hàng này đã tồn tại, vui lòng chọn tên khác.',
        'Mã số thuế đã được sử dụng, vui lòng kiểm tra lại': 'Mã số thuế này đã được sử dụng, vui lòng kiểm tra lại.'
    };
    return ERROR_MESSAGES[message] || message;
}
