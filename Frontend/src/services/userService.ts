import { callApi, callApiWithMethod, type ApiResponse } from "../utils/apiClient";

// ============= Types =============

export const UserStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    BANNED: 'BANNED'
} as const;

export type UserStatus = keyof typeof UserStatus;

export interface UserDto {
    userId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    status: UserStatus;
    createdAt: string;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface UserFilter {
    search?: string;
    status?: string;
    role?: string;
    page?: number;
    size?: number;
    sort?: string;
}

// ============= API Functions =============

/**
 * Get users list with pagination and filters
 * @param filter - UserFilter object
 * @returns ApiResponse with PageResponse of UserDto
 */
export async function getUsers(filter: UserFilter): Promise<ApiResponse<PageResponse<UserDto>>> {
    const params = new URLSearchParams();
    if (filter.search) params.append("search", filter.search);
    if (filter.status) params.append("status", filter.status);
    if (filter.role) params.append("role", filter.role);
    if (filter.page !== undefined) params.append("page", filter.page.toString());
    if (filter.size !== undefined) params.append("size", filter.size.toString());
    if (filter.sort) params.append("sort", filter.sort);

    const url = `/api/users/list?${params.toString()}`;
    return callApi<undefined, ApiResponse<PageResponse<UserDto>>>(url);
}

/**
 * Update user status
 * @param userId - ID of the user
 * @param status - New status (ACTIVE, INACTIVE, BANNED)
 * @returns ApiResponse with updated UserDto
 */
export async function updateUserStatus(userId: number, status: UserStatus): Promise<ApiResponse<UserDto>> {
    // API uses @RequestParam, so we pass status in the query string
    const url = `/api/users/${userId}/status?status=${status}`;
    return callApiWithMethod<null, ApiResponse<UserDto>>("PUT", url, null);
}

// ============= Helper Functions =============

/**
 * Map backend error messages to Vietnamese
 */
export function getUserDisplayMessage(message: string): string {
    const ERROR_MESSAGES: Record<string, string> = {
        "User not found": "Không tìm thấy người dùng",
        "Internal server error": "Lỗi hệ thống",
        "Access denied": "Truy cập bị từ chối"
    };

    return ERROR_MESSAGES[message] || message;
}
