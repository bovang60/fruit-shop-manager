import { callApiWithMethod, type ApiResponse } from '../utils/apiClient';

export interface ShippingMethodDto {
  methodId: number;
  methodName: string;
  description: string;
  fixedFee: number;
  isAvailable: boolean;
}

export async function getShippingMethods(): Promise<ApiResponse<ShippingMethodDto[]>> {
  try {
    return await callApiWithMethod<never, ApiResponse<ShippingMethodDto[]>>('GET', '/api/shipping-methods');
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
    return { resultCd: 1, message: 'Không thể tải danh sách phương thức vận chuyển', data: null };
  }
}
