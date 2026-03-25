import { callApiWithMethod, type ApiResponse } from "../utils/apiClient";

export type VoucherStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";
export type DiscountType = "FIXED" | "PERCENT";

export interface SellerVoucherApiModel {
  voucherId: number;
  code: string;
  discountValue: number | string;
  discountType: DiscountType;
  minOrderValue: number | string;
  expiredDate?: string;
  status: VoucherStatus;
}

export interface SellerVoucherDto {
  voucherId: number;
  code: string;
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
  status: VoucherStatus;
}

export interface CreateSellerVoucherRequest {
  code: string;
  discountValue: number;
  discountType?: DiscountType;
  minOrderValue?: number;
  expiryDate?: string;
  status?: VoucherStatus;
}

export interface UpdateSellerVoucherRequest
  extends Partial<CreateSellerVoucherRequest> {}

function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function toDateOnly(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function toExpiredDate(value?: string): string | undefined {
  if (!value) return undefined;
  if (value.includes("T")) return value;
  return `${value}T00:00:00`;
}

function mapVoucher(voucher: SellerVoucherApiModel): SellerVoucherDto {
  return {
    voucherId: voucher.voucherId,
    code: voucher.code,
    discountValue: toNumber(voucher.discountValue),
    minOrderValue: toNumber(voucher.minOrderValue),
    expiryDate: toDateOnly(voucher.expiredDate),
    status: voucher.status,
  };
}

function normalizeVoucherListResponse(
  response: ApiResponse<SellerVoucherApiModel[]> | SellerVoucherApiModel[],
): SellerVoucherApiModel[] {
  if (Array.isArray(response)) return response;
  return response.data ?? [];
}

function normalizeVoucherResponse(
  response: ApiResponse<SellerVoucherApiModel> | SellerVoucherApiModel,
): SellerVoucherApiModel | null {
  if (!response) return null;
  if ("data" in response) return response.data ?? null;
  return response;
}

export async function getSellerVouchersByShop(
  shopId: number,
): Promise<ApiResponse<SellerVoucherDto[]>> {
  try {
    const response = await callApiWithMethod<
      never,
      ApiResponse<SellerVoucherApiModel[]> | SellerVoucherApiModel[]
    >("GET", `/api/seller/vouchers/shop/${shopId}`);

    const vouchers = normalizeVoucherListResponse(response).map(mapVoucher);

    return {
      resultCd: 0,
      message: "Success",
      data: vouchers,
    };
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return {
      resultCd: 1,
      message: "Không thể tải danh sách voucher",
      data: null,
    };
  }
}

export async function createSellerVoucher(
  shopId: number,
  data: CreateSellerVoucherRequest,
): Promise<ApiResponse<SellerVoucherDto>> {
  try {
    const payload = {
      code: data.code,
      discountValue: data.discountValue,
      discountType: data.discountType ?? "FIXED",
      minOrderValue: data.minOrderValue ?? 0,
      expiredDate: toExpiredDate(data.expiryDate),
      status: data.status ?? "ACTIVE",
    };

    const response = await callApiWithMethod<
      typeof payload,
      ApiResponse<SellerVoucherApiModel> | SellerVoucherApiModel
    >("POST", `/api/seller/vouchers/shop/${shopId}`, payload);

    const voucher = normalizeVoucherResponse(response);
    if (!voucher) {
      return {
        resultCd: 1,
        message: "Không thể tạo voucher",
        data: null,
      };
    }

    return {
      resultCd: 0,
      message: "Tạo voucher thành công",
      data: mapVoucher(voucher),
    };
  } catch (error) {
    console.error("Error creating voucher:", error);
    return {
      resultCd: 1,
      message: "Không thể tạo voucher",
      data: null,
    };
  }
}

export async function updateSellerVoucher(
  voucherId: number,
  data: UpdateSellerVoucherRequest,
): Promise<ApiResponse<SellerVoucherDto>> {
  try {
    const payload = {
      code: data.code,
      discountValue: data.discountValue,
      discountType: data.discountType,
      minOrderValue: data.minOrderValue,
      expiredDate: toExpiredDate(data.expiryDate),
      status: data.status,
    };

    const response = await callApiWithMethod<
      typeof payload,
      ApiResponse<SellerVoucherApiModel> | SellerVoucherApiModel
    >("PUT", `/api/seller/vouchers/${voucherId}`, payload);

    const voucher = normalizeVoucherResponse(response);
    if (!voucher) {
      return {
        resultCd: 1,
        message: "Không thể cập nhật voucher",
        data: null,
      };
    }

    return {
      resultCd: 0,
      message: "Cập nhật voucher thành công",
      data: mapVoucher(voucher),
    };
  } catch (error) {
    console.error("Error updating voucher:", error);
    return {
      resultCd: 1,
      message: "Không thể cập nhật voucher",
      data: null,
    };
  }
}

export async function deleteSellerVoucher(
  voucherId: number,
): Promise<ApiResponse<null>> {
  try {
    await callApiWithMethod<never, ApiResponse<null> | string>(
      "DELETE",
      `/api/seller/vouchers/${voucherId}`,
    );

    return {
      resultCd: 0,
      message: "Xóa voucher thành công",
      data: null,
    };
  } catch (error) {
    console.error("Error deleting voucher:", error);
    return {
      resultCd: 1,
      message: "Không thể xóa voucher",
      data: null,
    };
  }
}

export function getVoucherDisplayMessage(message: string): string {
  const ERROR_MESSAGES: Record<string, string> = {
    "Voucher không tồn tại!": "Voucher không tồn tại",
    "Không tìm thấy Shop!": "Không tìm thấy cửa hàng",
    "Mã voucher này đã tồn tại trong Shop của bạn!":
      "Mã voucher đã tồn tại trong cửa hàng",
  };

  return ERROR_MESSAGES[message] || message;
}
