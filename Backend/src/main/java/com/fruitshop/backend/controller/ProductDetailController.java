package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ProductDetailDto;
import com.fruitshop.backend.dto.ProductSummaryDto;
import com.fruitshop.backend.service.ProductDetailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
public class ProductDetailController {

    private final ProductDetailService productDetailService;

    /**
     * Get product detail by ID
     *
     * @param id Product ID (positive integer)
     * @return ApiResponse with ProductDetailDto
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDetailDto>> getProductDetail(
            @PathVariable Integer id,
            @RequestParam(name = "userId", required = false) Integer userId) {
        log.info("GET /api/products/{} - fetching product detail (userId: {})", id, userId);

        if (id == null || id <= 0) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Product ID must be a positive integer"));
        }

        ApiResponse<ProductDetailDto> response = productDetailService.getProductDetail(id, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get related products (same category)
     *
     * @param id    Product ID
     * @param limit Number of related products to return (default: 8)
     * @return ApiResponse with list of ProductSummaryDto
     */
    @GetMapping("/{id}/related")
    public ResponseEntity<ApiResponse<List<ProductSummaryDto>>> getRelatedProducts(
            @PathVariable Integer id,
            @RequestParam(name = "limit", required = false, defaultValue = "8") Integer limit) {
        log.info("GET /api/products/{}/related - limit={}", id, limit);

        if (id == null || id <= 0) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Product ID must be a positive integer"));
        }

        ApiResponse<List<ProductSummaryDto>> response = productDetailService.getRelatedProducts(id, limit);
        return ResponseEntity.ok(response);
    }
}
