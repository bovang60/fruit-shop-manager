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
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
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
            @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "pageSize", required = false, defaultValue = "25") Integer pageSize,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "category", required = false) Integer category,
            @RequestParam(name = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(name = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(name = "origin", required = false) String origin,
            @RequestParam(name = "organic", required = false) Boolean organic,
            @RequestParam(name = "sortBy", required = false, defaultValue = "popularity") String sortBy,
            @RequestParam(name = "sortOrder", required = false, defaultValue = "desc") String sortOrder,
            @RequestParam(name = "shopId", required = false) Integer shopId) {
        log.info("GET /api/products - params: page={}, pageSize={}, category={}, search={}, organic={}, shopId={}", page, pageSize,
                category, search, organic, shopId);
        ApiResponse<ProductListResponseDto> response = productService.getProducts(
                page, pageSize, search, category, minPrice, maxPrice,
                origin, organic, sortBy, sortOrder, shopId);
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
            @RequestParam(name = "limit", required = false, defaultValue = "10") Integer limit) {
        log.info("GET /api/products/new-arrivals - limit={}", limit);
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
            @RequestParam(name = "limit", required = false, defaultValue = "10") Integer limit) {
        log.info("GET /api/products/trending - limit={}", limit);
        ApiResponse<List<ProductSummaryDto>> response = productService.getTrendingProducts(limit);
        return ResponseEntity.ok(response);
    }

    /**
     * Get products by category ID with pagination and sorting
     *
     * @param categoryId Category ID to filter by
     * @param page       Page number (1-based, default: 1)
     * @param pageSize   Number of items per page (default: 25)
     * @param sortBy     Sort field: popularity | price | newest | rating (default: popularity)
     * @param sortOrder  Sort direction: asc | desc (default: desc)
     * @return ApiResponse with ProductListResponseDto
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<ProductListResponseDto>> getProductsByCategory(
            @PathVariable("categoryId") Integer categoryId,
            @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "pageSize", required = false, defaultValue = "25") Integer pageSize,
            @RequestParam(name = "sortBy", required = false, defaultValue = "popularity") String sortBy,
            @RequestParam(name = "sortOrder", required = false, defaultValue = "desc") String sortOrder) {
        log.info("GET /api/products/category/{} - page={}, pageSize={}, sortBy={}, sortOrder={}",
                categoryId, page, pageSize, sortBy, sortOrder);
        ApiResponse<ProductListResponseDto> response = productService.getProductsByCategory(
                categoryId, page, pageSize, sortBy, sortOrder);
        return ResponseEntity.ok(response);
    }
}
