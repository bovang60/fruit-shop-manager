package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ProductListResponseDto;
import com.fruitshop.backend.dto.ProductSummaryDto;
import com.fruitshop.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * Get products list with pagination, search, and filters
     * 
     * @param page      Page number (1-based, default: 1)
     * @param pageSize  Number of items per page (default: 25)
     * @param search    Search query for product name
     * @param category  Filter by category (berries, citrus, tropical, seasonal)
     * @param minPrice  Minimum price filter
     * @param maxPrice  Maximum price filter
     * @param origin    Filter by origin (local, imported)
     * @param organic   Filter organic products only
     * @param sortBy    Sort field (popularity, price, newest, rating)
     * @param sortOrder Sort order (asc, desc)
     * @return ApiResponse with ProductListResponseDto
     */
    @GetMapping
    public ResponseEntity<ApiResponse<ProductListResponseDto>> getProducts(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "25") Integer pageSize,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) Boolean organic,
            @RequestParam(required = false, defaultValue = "popularity") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder) {
        ApiResponse<ProductListResponseDto> response = productService.getProducts(
                page, pageSize, search, category, minPrice, maxPrice,
                origin, organic, sortBy, sortOrder);
        return ResponseEntity.ok(response);
    }

    /**
     * Get new arrivals (newest products)
     * 
     * @param limit Number of products to return (default: 10)
     * @return ApiResponse with list of ProductSummaryDto
     */
    @GetMapping("/new-arrivals")
    public ResponseEntity<ApiResponse<List<ProductSummaryDto>>> getNewArrivals(
            @RequestParam(required = false, defaultValue = "10") Integer limit) {
        ApiResponse<List<ProductSummaryDto>> response = productService.getNewArrivals(limit);
        return ResponseEntity.ok(response);
    }

    /**
     * Get trending products (popular products by sold count and view count)
     * 
     * @param limit Number of products to return (default: 10)
     * @return ApiResponse with list of ProductSummaryDto
     */
    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<List<ProductSummaryDto>>> getTrendingProducts(
            @RequestParam(required = false, defaultValue = "10") Integer limit) {
        ApiResponse<List<ProductSummaryDto>> response = productService.getTrendingProducts(limit);
        return ResponseEntity.ok(response);
    }
}
