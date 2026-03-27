package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.FeedbackDto;
import com.fruitshop.backend.dto.FeedbackRequestDto;
import com.fruitshop.backend.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    // ===== USER: Create Feedback =====
    @PostMapping
    public ResponseEntity<ApiResponse<FeedbackDto>> createFeedback(
            @RequestHeader("userId") Integer userId,
            @Valid @RequestBody FeedbackRequestDto request) {
        ApiResponse<FeedbackDto> response = feedbackService.createFeedback(userId, request);
        return ResponseEntity.ok(response);
    }

    // ===== USER: Update Feedback =====
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FeedbackDto>> updateFeedback(
            @RequestHeader("userId") Integer userId,
            @PathVariable("id") Integer feedbackId,
            @Valid @RequestBody FeedbackRequestDto request) {
        ApiResponse<FeedbackDto> response = feedbackService.updateFeedback(userId, feedbackId, request);
        return ResponseEntity.ok(response);
    }

    // ===== PUBLIC: Get Feedback by Product =====
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<FeedbackDto>>> getFeedbackByProduct(
            @PathVariable("productId") Integer productId) {
        ApiResponse<List<FeedbackDto>> response = feedbackService.getFeedbackByProduct(productId);
        return ResponseEntity.ok(response);
    }
}

