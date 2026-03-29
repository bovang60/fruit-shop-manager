import { callApiWithMethod, type ApiResponse } from "../utils/apiClient";

export interface FeedbackDto {
  feedbackId: number;
  orderId?: number;
  userId?: number;
  userName: string;
  productId: number;
  productName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface FeedbackRequestDto {
  orderId: number;
  productId: number;
  rating: number;
  comment: string;
}

export async function createFeedback(
  userId: number,
  request: FeedbackRequestDto
): Promise<ApiResponse<FeedbackDto>> {
  try {
    return await callApiWithMethod<FeedbackRequestDto, ApiResponse<FeedbackDto>>(
      "POST",
      "/api/feedback",
      request,
      { userId: String(userId) }
    );
  } catch (error) {
    console.error("Error creating feedback:", error);
    return {
      resultCd: 1,
      message: "Lỗi kết nối khi gửi đánh giá.",
      data: null as any
    };
  }
}

export async function updateFeedback(
  userId: number,
  feedbackId: number,
  request: FeedbackRequestDto
): Promise<ApiResponse<FeedbackDto>> {
  try {
    return await callApiWithMethod<FeedbackRequestDto, ApiResponse<FeedbackDto>>(
      "PUT",
      `/api/feedback/${feedbackId}`,
      request,
      { userId: String(userId) }
    );
  } catch (error) {
    console.error("Error updating feedback:", error);
    return {
      resultCd: 1,
      message: "Lỗi kết nối khi cập nhật đánh giá.",
      data: null as any
    };
  }
}

export async function getFeedbackByProduct(
  productId: number
): Promise<ApiResponse<FeedbackDto[]>> {
  try {
    return await callApiWithMethod<never, ApiResponse<FeedbackDto[]>>(
      "GET",
      `/api/feedback/product/${productId}`
    );
  } catch (error) {
    console.error(`Error fetching feedback for product ${productId}:`, error);
    return {
      resultCd: 1,
      message: "Không thể tải danh sách đánh giá.",
      data: []
    };
  }
}
