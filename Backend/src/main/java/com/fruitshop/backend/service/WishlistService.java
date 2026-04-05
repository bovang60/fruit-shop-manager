package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.WishlistResponseDto;

import java.util.List;

public interface WishlistService {
    ApiResponse<String> addToWishlist(Integer userId, Integer productId);
    ApiResponse<String> removeFromWishlist(Integer userId, Integer productId);
    ApiResponse<List<WishlistResponseDto>> getWishlist(Integer userId);
}
