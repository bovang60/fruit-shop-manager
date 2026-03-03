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

export interface ForgotPasswordRequestData {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmPassword: string;
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

/**
 * Forgot Password - Step 1: Request OTP via email
 * @param data - ForgotPasswordRequestData with email
 * @returns ApiResponse (data will be null, OTP sent to email)
 */
export async function requestPasswordReset(
  data: ForgotPasswordRequestData,
): Promise<ApiResponse<null>> {
  return callApi<ForgotPasswordRequestData, ApiResponse<null>>(
    "/api/users/forgot-password/request",
    data,
  );
}

/**
 * Forgot Password - Step 2: Reset password with OTP
 * @param data - ResetPasswordRequest with email, OTP code, and new password
 * @returns ApiResponse (data will be null on success)
 */
export async function resetPasswordWithOtp(
  data: ResetPasswordRequest,
): Promise<ApiResponse<null>> {
  return callApi<ResetPasswordRequest, ApiResponse<null>>(
    "/api/users/forgot-password/reset",
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
    "No account found with this email address":
      "Không tìm thấy tài khoản với email này",
    "Failed to send OTP email. Please try again.":
      "Không thể gửi email OTP. Vui lòng thử lại.",
    "No password reset request found. Please request a new OTP.":
      "Không tìm thấy yêu cầu đặt lại mật khẩu. Vui lòng yêu cầu OTP mới.",
    "OTP code has been sent to your email. Please verify within 5 minutes.":
      "Mã OTP đã được gửi đến email của bạn. Vui lòng xác thực trong 5 phút.",
    "Password has been reset successfully. You can now login with your new password.":
      "Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập với mật khẩu mới.",
    "New password and confirm password do not match":
      "Mật khẩu mới và xác nhận mật khẩu không khớp",
    "New password must be between 6 and 50 characters":
      "Mật khẩu mới phải có từ 6 đến 50 ký tự",
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
