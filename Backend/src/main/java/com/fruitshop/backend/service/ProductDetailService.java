package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ProductDetailDto;
import com.fruitshop.backend.dto.ProductSummaryDto;

import java.util.List;

public interface ProductDetailService {

    /**
     * Get product detail by ID
     */
    ApiResponse<ProductDetailDto> getProductDetail(Integer id, Integer userId);

    /**
     * Get related products (same category)
     */
    ApiResponse<List<ProductSummaryDto>> getRelatedProducts(Integer id, Integer limit);
}
