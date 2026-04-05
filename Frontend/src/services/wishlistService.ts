import { callApiWithMethod, type ApiResponse } from "../utils/apiClient";

export interface WishlistResponseDto {
  wishlistId: number;
  productId: number;
  productName: string;
  price: number;
  imageUrl: string;
  categoryName: string;
}

export const getUserWishlist = async (userId: number): Promise<ApiResponse<WishlistResponseDto[]>> => {
  return await callApiWithMethod<never, ApiResponse<WishlistResponseDto[]>>("GET", `/api/wishlist/${userId}`);
};

export const addToWishlist = async (userId: number, productId: number): Promise<ApiResponse<string>> => {
  return await callApiWithMethod<never, ApiResponse<string>>("POST", `/api/wishlist/${userId}/add/${productId}`);
};

export const removeFromWishlist = async (userId: number, productId: number): Promise<ApiResponse<string>> => {
  return await callApiWithMethod<never, ApiResponse<string>>("DELETE", `/api/wishlist/${userId}/remove/${productId}`);
};
