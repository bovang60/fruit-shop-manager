/**
 * Profile Service
 *
 * Handles API calls for user profile management
 * Following the API Client Guide pattern
 */

import { callApiWithMethod, type ApiResponse } from "../utils/apiClient";
import type {
  UserDto,
  UpdateProfileDto,
} from "../components/profile/Profile.types";

// ============= Profile API Service =============

/**
 * Get user profile by ID
 *
 * Endpoint: GET /api/users/{id}
 *
 * @param userId - User ID
 * @returns User profile data
 *
 * @example
 * const response = await getUserProfile(123)
 * if (response.resultCd === 0) {
 *   console.log('User:', response.data)
 * }
 */
export async function getUserProfile(
  userId: number,
): Promise<ApiResponse<UserDto>> {
  try {
    return await callApiWithMethod<never, ApiResponse<UserDto>>(
      "GET",
      `/api/users/${userId}`,
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return {
      resultCd: 1,
      message: "Failed to fetch profile. Please try again.",
      data: null,
    };
  }
}

/**
 * Update user profile
 *
 * Endpoint: PUT /api/users/{id}/profile
 *
 * @param userId - User ID
 * @param profileData - Updated profile data
 * @returns Updated user profile data
 *
 * @example
 * const response = await updateUserProfile(123, {
 *   fullName: 'Nguyễn Văn A',
 *   phoneNumber: '0912345678'
 * })
 * if (response.resultCd === 0) {
 *   console.log('Profile updated:', response.data)
 * }
 */
export async function updateUserProfile(
  userId: number,
  profileData: UpdateProfileDto,
): Promise<ApiResponse<UserDto>> {
  try {
    return await callApiWithMethod<UpdateProfileDto, ApiResponse<UserDto>>(
      "PUT",
      `/api/users/${userId}/profile`,
      profileData,
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      resultCd: 1,
      message: "Failed to update profile. Please try again.",
      data: null,
    };
  }
}
