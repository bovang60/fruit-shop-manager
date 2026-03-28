package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.FeedbackDto;
import com.fruitshop.backend.dto.FeedbackRequestDto;

import java.util.List;

public interface FeedbackService {
    ApiResponse<FeedbackDto> createFeedback(Integer userId, FeedbackRequestDto request);
    ApiResponse<FeedbackDto> updateFeedback(Integer userId, Integer feedbackId, FeedbackRequestDto request);
    ApiResponse<List<FeedbackDto>> getFeedbackByProduct(Integer productId);
}
