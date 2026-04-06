import { callApiWithMethod, getAuthToken, authHeader, type ApiResponse } from "../utils/apiClient";

// ============= Types =============

export const ShopStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    SUSPENDED: 'SUSPENDED'
} as const;

export type ShopStatus = keyof typeof ShopStatus;


export interface ShopDto {
    shopId: number;
    shopName: string;
    ownerId: number;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    address: string;
    description: string;
    status: ShopStatus;
    rejectReason?: string | null;
    createdAt: string;
    regDate?: string;
    taxCode?: string;
    shopType?: string;
    businessName?: string;
    businessAddress?: string;
    pickupAddress?: string;
    documentUrls: string[];
    // Stats fields from SPEC
    totalOrders: number;
    cancellationRate: number;
    totalProducts: number;
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

export interface UpdateSellerShopRequest {
    shopName: string;
    description?: string;
    address: string;
    shopType?: string;
    businessName?: string;
    businessAddress?: string;
    pickupAddress?: string;
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
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    
    try {
        return await callApiWithMethod<undefined, ApiResponse<PageResponse<ShopDto>>>("GET", url, undefined, headers);
    } catch (error) {
        console.error("Error fetching shops:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi lấy danh sách cửa hàng", data: null };
    }
}

/**
 * Get shop detail by ID
 */
export async function getShopById(shopId: number): Promise<ApiResponse<ShopDto>> {
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    
    try {
        return await callApiWithMethod<undefined, ApiResponse<ShopDto>>("GET", `/api/shops/${shopId}`, undefined, headers);
    } catch (error) {
        console.error("Error fetching shop detail:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi lấy chi tiết cửa hàng", data: null };
    }
}

/**
 * Approve a shop
 */
export async function approveShop(shopId: number): Promise<ApiResponse<ShopDto>> {
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    try {
        return await callApiWithMethod<undefined, ApiResponse<ShopDto>>("PUT", `/api/shops/${shopId}/approve`, undefined, headers);
    } catch (error) {
        console.error("Error approving shop:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi phê duyệt cửa hàng", data: null };
    }
}


/**
 * Reject a shop
 */
export async function rejectShop(shopId: number, reason: string): Promise<ApiResponse<ShopDto>> {
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    try {
        return await callApiWithMethod<{ reason: string }, ApiResponse<ShopDto>>("PUT", `/api/shops/${shopId}/reject`, { reason }, headers);
    } catch (error) {
        console.error("Error rejecting shop:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi từ chối cửa hàng", data: null };
    }
}

/**
 * Suspend a shop
 */
export async function suspendShop(shopId: number): Promise<ApiResponse<ShopDto>> {
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    try {
        return await callApiWithMethod<undefined, ApiResponse<ShopDto>>("PUT", `/api/shops/${shopId}/suspend`, undefined, headers);
    } catch (error) {
        console.error("Error suspending shop:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi đình chỉ cửa hàng", data: null };
    }
}

/**
 * Activate a suspended shop
 */
export async function activateShop(shopId: number): Promise<ApiResponse<ShopDto>> {
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    try {
        return await callApiWithMethod<undefined, ApiResponse<ShopDto>>("PUT", `/api/shops/${shopId}/activate`, undefined, headers);
    } catch (error) {
        console.error("Error activating shop:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi kích hoạt lại cửa hàng", data: null };
    }
}


/**
 * Check if a shop name already exists in the system
 */
export async function checkShopNameExists(name: string): Promise<ApiResponse<boolean>> {
    const trimmed = name.trim();
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    try {
        return await callApiWithMethod<undefined, ApiResponse<boolean>>(
            'GET',
            `/api/shops/check-name?name=${encodeURIComponent(trimmed)}`,
            undefined,
            headers
        );
    } catch (error) {
        console.error('Lỗi khi kiểm tra tên shop:', error);
        return { resultCd: 1, message: 'Lỗi kết nối khi kiểm tra tên cửa hàng', data: null };
    }
}

/**
 * Check if a tax code already exists in the system
 */
export async function checkTaxCodeExists(taxCode: string): Promise<ApiResponse<boolean>> {
    const trimmed = taxCode.trim();
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    if (!trimmed) return { resultCd: 1, message: 'Mã số thuế không hợp lệ', data: null };
    try {
        return await callApiWithMethod<undefined, ApiResponse<boolean>>(
            'GET',
            `/api/shops/check-tax?taxCode=${encodeURIComponent(trimmed)}`,
            undefined,
            headers
        );
    } catch (error) {
        console.error('Lỗi khi kiểm tra mã số thuế:', error);
        return { resultCd: 1, message: 'Lỗi kết nối khi kiểm tra mã số thuế', data: null };
    }
}


/**
 * Check if the user is allowed to register a shop
 */
export async function checkCanRegisterShop(ownerId: number): Promise<ApiResponse<boolean>> {
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    try {
        return await callApiWithMethod<undefined, ApiResponse<boolean>>(
            'GET', 
            `/api/shops/can-register/${ownerId}`,
            undefined,
            headers
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
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    try {
        return await callApiWithMethod<undefined, ApiResponse<ShopDto>>(
            'GET',
            `/api/shops/check-status/${ownerId}`,
            undefined,
            headers
        );
    } catch (error) {
        console.error('Lỗi khi lấy trạng thái shop:', error);
        return { resultCd: 1, message: 'Lỗi kết nối khi lấy trạng thái cửa hàng', data: null };
    }
}


/**
 * Register a new shop
 */
export async function registerShop(payload: RegisterShopRequest): Promise<ApiResponse<ShopDto>> {
    const token = getAuthToken();
    const headers = token ? authHeader(token) : {};
    try {
        return await callApiWithMethod<RegisterShopRequest, ApiResponse<ShopDto>>(
            'POST',
            '/api/shops/register',
            payload,
            headers
        );
    } catch (error) {
        console.error('Lỗi khi đăng ký cửa hàng:', error);
        return { resultCd: 1, message: 'Lỗi kết nối khi đăng ký cửa hàng', data: null };
    }
}

export async function updateSellerShop(shopId: number, payload: UpdateSellerShopRequest): Promise<ApiResponse<ShopDto>> {
    const token = getAuthToken();
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(token ? authHeader(token) : {}),
    };

    try {
        const requestBody = JSON.stringify(payload);

        const putResponse = await fetch(`${baseUrl}/api/shops/${shopId}`, {
            method: "PUT",
            headers,
            body: requestBody,
        });

        if (putResponse.status !== 405) {
            return await putResponse.json();
        }

        const patchResponse = await fetch(`${baseUrl}/api/shops/${shopId}`, {
            method: "PATCH",
            headers,
            body: requestBody,
        });
        return await patchResponse.json();
    } catch (error) {
        console.error("Lỗi khi cập nhật cửa hàng:", error);
        return { resultCd: 1, message: "Lỗi kết nối khi cập nhật cửa hàng", data: null };
    }
}


// ============= Helper Functions =============

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
