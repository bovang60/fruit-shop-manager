package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ProductListResponseDto;
import com.fruitshop.backend.dto.ProductSummaryDto;
import com.fruitshop.backend.model.Product;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {

    /**
     * Get products list with pagination, search, and filters
     */
    ApiResponse<ProductListResponseDto> getProducts(
            Integer page,
            Integer pageSize,
            String search,
            Integer category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String origin,
            Boolean organic,
            String sortBy,
            String sortOrder,
            Integer shopId);

    /**
     * Get new arrivals (newest products)
     */
    ApiResponse<List<ProductSummaryDto>> getNewArrivals(Integer limit);

    /**
     * Get trending products (popular products by sold count and view count)
     */
    ApiResponse<List<ProductSummaryDto>> getTrendingProducts(Integer limit);

    /**
     * Get products by category ID with pagination
     */
    ApiResponse<ProductListResponseDto> getProductsByCategory(
            Integer categoryId,
            Integer page,
            Integer pageSize,
            String sortBy,
            String sortOrder);
}
