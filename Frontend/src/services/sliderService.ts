/**
 * Slider Service
 * Tích hợp API theo chuẩn API_CLIENT_GUIDE.md
 *
 * GET /api/sliders         - Admin: danh sách tất cả slider
 * GET /api/sliders/active  - Public: slider đang hiển thị
 * POST /api/sliders        - Admin: tạo slider mới (multipart/form-data)
 * PUT /api/sliders/:id     - Admin: cập nhật slider (multipart/form-data)
 * DELETE /api/sliders/:id  - Admin: xóa slider
 * PATCH /api/sliders/:id/toggle-status - Admin: bật/tắt slider
 */

import { get, callApiWithMethod, getAuthToken, type ApiResponse } from '../utils/apiClient';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// ============= Types =============

export interface SliderDto {
  sliderId: number;
  title: string;
  description?: string;
  imageUrl: string;
  status: boolean; // true = hiển thị (active), false = ẩn (inactive)
}

export interface SliderFormData {
  title: string;
  description: string;
  status: boolean;
  image?: File | null; // File upload, null = giữ ảnh cũ
}

// ============= Helper =============

function buildAuthHeader(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Gửi multipart/form-data request (POST hoặc PUT)
 * Không dùng callApiWithMethod vì cần browser tự set boundary
 */
async function sendFormData(
  method: 'POST' | 'PUT',
  url: string,
  data: SliderFormData,
): Promise<ApiResponse<SliderDto>> {
  const formData = new FormData();
  formData.append('title', data.title.trim());
  formData.append('description', data.description.trim());
  formData.append('status', String(data.status));
  if (data.image) formData.append('image', data.image);

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers: buildAuthHeader(),
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error(`Error ${method} ${url}:`, error);
    return { resultCd: 1, message: 'Lỗi kết nối. Vui lòng thử lại.', data: null };
  }
}

// ============= API Functions =============

/**
 * 1. Lấy danh sách slider đang hiển thị (Public - dùng ở trang chủ)
 */
export async function getActiveSliders(): Promise<ApiResponse<SliderDto[]>> {
  try {
    return await get<ApiResponse<SliderDto[]>>('/api/sliders/active');
  } catch (error) {
    console.error('Error fetching active sliders:', error);
    return { resultCd: 1, message: 'Không thể tải slider', data: [] };
  }
}

/**
 * 2. Lấy danh sách tất cả slider (Admin)
 */
export async function getSliders(): Promise<ApiResponse<SliderDto[]>> {
  try {
    return await callApiWithMethod<never, ApiResponse<SliderDto[]>>(
      'GET',
      '/api/sliders',
      undefined,
      buildAuthHeader(),
    );
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return { resultCd: 1, message: 'Không thể tải danh sách slider', data: [] };
  }
}

/**
 * Lấy danh sách slider đang hiển thị (Public - dùng ở trang chủ)
 */
export async function getSliderById(id: number): Promise<ApiResponse<SliderDto>> {
  try {
    return await callApiWithMethod<never, ApiResponse<SliderDto>>(
      'GET',
      `/api/sliders/${id}`,
      undefined,
      buildAuthHeader(),
    );
  } catch (error) {
    console.error(`Error fetching slider ${id}:`, error);
    return { resultCd: 1, message: 'Không tìm thấy slider', data: null };
  }
}

/**
 * 4. Tạo slider mới (Admin) - multipart/form-data
 */
export async function createSlider(
  data: SliderFormData,
): Promise<ApiResponse<SliderDto>> {
  if (!data.title.trim()) {
    return { resultCd: 1, message: 'Tiêu đề không được để trống', data: null };
  }
  if (!data.image) {
    return { resultCd: 1, message: 'Vui lòng chọn hình ảnh', data: null };
  }
  return sendFormData('POST', '/api/sliders', data);
}

/**
 * 5. Cập nhật slider (Admin) - multipart/form-data
 */
export async function updateSlider(
  id: number,
  data: SliderFormData,
): Promise<ApiResponse<SliderDto>> {
  if (!data.title.trim()) {
    return { resultCd: 1, message: 'Tiêu đề không được để trống', data: null };
  }
  return sendFormData('PUT', `/api/sliders/${id}`, data);
}

/**
 * 6. Xóa slider (Admin)
 */
export async function deleteSlider(
  id: number,
): Promise<ApiResponse<null>> {
  try {
    return await callApiWithMethod<never, ApiResponse<null>>(
      'DELETE',
      `/api/sliders/${id}`,
      undefined,
      buildAuthHeader(),
    );
  } catch (error) {
    console.error(`Error deleting slider ${id}:`, error);
    return { resultCd: 1, message: 'Không thể xóa slider', data: null };
  }
}

/**
 * 7. Bật/tắt trạng thái hiển thị slider (Admin)
 */
export async function toggleSliderStatus(
  id: number,
): Promise<ApiResponse<null>> {
  try {
    return await callApiWithMethod<never, ApiResponse<null>>(
      'PATCH',
      `/api/sliders/${id}/toggle-status`,
      undefined,
      buildAuthHeader(),
    );
  } catch (error) {
    console.error(`Error toggling slider ${id}:`, error);
    return { resultCd: 1, message: 'Không thể đổi trạng thái slider', data: null };
  }
}

// ============= Error Messages =============

export function getSliderErrorMessage(message: string): string {
  const MESSAGES: Record<string, string> = {
    // Success / Warning messages from spec
    'Slider created successfully': 'Tạo slider thành công',
    'Slider updated successfully': 'Cập nhật slider thành công',
    'Slider deleted successfully': 'Đã xóa slider thành công',
    'Slider activated successfully': 'Slider đã được hiển thị',
    'Slider deactivated successfully': 'Slider đã được ẩn',
    'Tạo slider thành công nhưng được đặt thành ẨN: không thể hiển thị quá 5 slider cùng lúc':
      'Tạo slider thành công nhưng được đặt thành ẨN: không thể hiển thị quá 5 slider cùng lúc',

    // Error messages from spec
    'Không thể hiển thị quá 5 slider cùng lúc': 'Không thể hiển thị quá 5 slider cùng lúc (tối đa 5)',
    'Slider title is required': 'Tiêu đề slider không được để trống',
    'Invalid file type. Only PNG, JPG, GIF are allowed.': 'Định dạng file không hợp lệ. Chỉ chấp nhận PNG, JPG, GIF',
    'File size exceeds limit. Maximum 5MB allowed.': 'File quá lớn. Tối đa 5MB',
    'Failed to upload image. Please try again later.': 'Tải ảnh thất bại. Vui lòng thử lại.',
  };
  // Handle dynamic messages like "Slider not found with ID: 99"
  if (message.startsWith('Slider not found')) return 'Không tìm thấy slider';
  return MESSAGES[message] || message;
}
