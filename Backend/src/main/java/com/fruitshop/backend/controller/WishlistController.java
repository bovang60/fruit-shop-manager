package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.WishlistResponseDto;
import com.fruitshop.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@Slf4j
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<WishlistResponseDto>>> getWishlist(
            @PathVariable Integer userId) {
        log.info("GET /api/wishlist/{}", userId);
        return ResponseEntity.ok(wishlistService.getWishlist(userId));
    }

    @PostMapping("/{userId}/add/{productId}")
    public ResponseEntity<ApiResponse<String>> addToWishlist(
            @PathVariable Integer userId,
            @PathVariable Integer productId) {
        log.info("POST /api/wishlist/{}/add/{}", userId, productId);
        return ResponseEntity.ok(wishlistService.addToWishlist(userId, productId));
    }

    @DeleteMapping("/{userId}/remove/{productId}")
    public ResponseEntity<ApiResponse<String>> removeFromWishlist(
            @PathVariable Integer userId,
            @PathVariable Integer productId) {
        log.info("DELETE /api/wishlist/{}/remove/{}", userId, productId);
        return ResponseEntity.ok(wishlistService.removeFromWishlist(userId, productId));
    }
}
