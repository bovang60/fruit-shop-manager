// API Service for Authentication
import {
  callApi,
  callApiWithMethod,
  type ApiResponse,
} from "../utils/apiClient";

// ============= Types =============

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber?: string;
  newPassword?: string;
  currentPassword?: string;
}

export interface UserDto {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  createdAt: string;
}

// ============= API Functions =============

/**
 * Login API
 * @param data - LoginRequest with email and password
 * @returns ApiResponse with UserDto if successful
 */
export async function login(data: LoginRequest): Promise<ApiResponse<UserDto>> {
  return callApi<LoginRequest, ApiResponse<UserDto>>("/api/users/login", data);
}

/**
 * Request Registration - Step 1: Send OTP to email
 * @param data - RegisterRequest with user information
 * @returns ApiResponse (data will be null)
 */
export async function requestRegister(
  data: RegisterRequest,
): Promise<ApiResponse<null>> {
  return callApi<RegisterRequest, ApiResponse<null>>(
    "/api/users/request-register",
    data,
  );
}

/**
 * Verify OTP - Step 2: Complete registration
 * @param data - VerifyOtpRequest with email and OTP code
 * @returns ApiResponse with UserDto if successful
 */
export async function verifyOtp(
  data: VerifyOtpRequest,
): Promise<ApiResponse<UserDto>> {
  return callApi<VerifyOtpRequest, ApiResponse<UserDto>>(
    "/api/users/verify-otp",
    data,
  );
}

/**
 * Update user profile
 * @param userId - User ID
 * @param data - UpdateProfileRequest with updated information
 * @returns ApiResponse with updated UserDto
 */
export async function updateProfile(
  userId: number,
  data: UpdateProfileRequest,
): Promise<ApiResponse<UserDto>> {
  return callApiWithMethod<UpdateProfileRequest, ApiResponse<UserDto>>(
    "PUT",
    `/api/users/${userId}/profile`,
    data,
  );
}

// ============= Helper Functions =============

/**
 * Get user-friendly error message in Vietnamese
 */
export function getDisplayMessage(message: string): string {
  const ERROR_MESSAGES: Record<string, string> = {
    "Invalid email or password": "Email hoặc mật khẩu không đúng",
    "Your account has been deactivated. Please contact support.":
      "Tài khoản đã bị vô hiệu hóa. Liên hệ hỗ trợ.",
    "Your account has been banned. Please contact support.":
      "Tài khoản đã bị cấm. Liên hệ hỗ trợ.",
    "Please verify your email before logging in.":
      "Vui lòng xác thực email trước khi đăng nhập",
    "Email already exists":
      "Email này đã được đăng ký. Vui lòng sử dụng email khác.",
    "Invalid OTP code": "Mã OTP không chính xác. Vui lòng kiểm tra lại.",
    "OTP code has expired. Please request a new one.":
      "Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.",
    "No pending registration found for this email":
      "Không tìm thấy yêu cầu đăng ký. Vui lòng đăng ký lại.",
    "User not found": "Không tìm thấy người dùng",
    "Current password is required to change password":
      "Cần nhập mật khẩu hiện tại để đổi mật khẩu",
    "Current password is incorrect": "Mật khẩu hiện tại không đúng",
  };

  return ERROR_MESSAGES[message] || message;
}

/**
 * Save user data to localStorage
 */
export function saveUserToStorage(user: UserDto): void {
  localStorage.setItem("user", JSON.stringify(user));
}

/**
 * Get user data from localStorage
 */
export function getUserFromStorage(): UserDto | null {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Clear user data from localStorage
 */
export function clearUserStorage(): void {
  localStorage.removeItem("user");
}
