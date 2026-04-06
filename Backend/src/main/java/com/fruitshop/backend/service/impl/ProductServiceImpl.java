package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.*;
import com.fruitshop.backend.model.Product;
import com.fruitshop.backend.repository.ProductRepository;
import com.fruitshop.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public ApiResponse<ProductListResponseDto> getProducts(
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
            Integer shopId) {
        try {
            // Validate and set defaults
            page = (page == null || page < 1) ? 1 : page;
            pageSize = (pageSize == null || pageSize < 1) ? 25 : pageSize;
            sortBy = (sortBy == null || sortBy.isEmpty()) ? "popularity" : sortBy;
            sortOrder = (sortOrder == null || sortOrder.isEmpty()) ? "desc" : sortOrder;

            // Create pageable with sorting
            Pageable pageable = createPageable(page - 1, pageSize, sortBy, sortOrder);

            // Convert origin string to enum
            Product.Origin originEnum = null;
            if (origin != null && !origin.isEmpty()) {
                try {
                    originEnum = Product.Origin.valueOf(origin.toUpperCase());
                } catch (IllegalArgumentException e) {
                    // Ignore invalid origin
                }
            }

            // Search products
            Page<Product> productPage = productRepository.searchProducts(
                    shopId,
                    search,
                    category,
                    null, // categoryName - not used, filtering by ID
                    minPrice,
                    maxPrice,
                    originEnum,
                    organic,
                    pageable);

            // Convert to DTOs
            List<ProductDto> productDtos = productPage.getContent().stream()
                    .map(this::convertToProductDto)
                    .collect(Collectors.toList());

            // Create pagination info
            PaginationDto paginationDto = new PaginationDto(
                    page,
                    pageSize,
                    productPage.getTotalElements(),
                    productPage.getTotalPages(),
                    productPage.hasNext(),
                    productPage.hasPrevious());

            // Create applied filters map
            Map<String, Object> appliedFilters = new HashMap<>();
            if (search != null)
                appliedFilters.put("search", search);
            if (category != null)
                appliedFilters.put("category", category);
            if (minPrice != null)
                appliedFilters.put("minPrice", minPrice);
            if (maxPrice != null)
                appliedFilters.put("maxPrice", maxPrice);
            if (origin != null)
                appliedFilters.put("origin", origin);
            if (organic != null)
                appliedFilters.put("organic", organic);
            appliedFilters.put("sortBy", sortBy);
            appliedFilters.put("sortOrder", sortOrder);

            // Create response
            ProductListResponseDto responseData = new ProductListResponseDto(
                    productDtos,
                    paginationDto,
                    appliedFilters);

            return ApiResponse.success("Success", responseData);

        } catch (Exception e) {
            return ApiResponse.error("Failed to fetch products: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<List<ProductSummaryDto>> getNewArrivals(Integer limit) {
        try {
            limit = (limit == null || limit < 1) ? 10 : limit;

            Pageable pageable = PageRequest.of(0, limit);
            List<Product> products = productRepository.findNewArrivals(pageable);

            List<ProductSummaryDto> summaries = products.stream()
                    .map(this::convertToProductSummaryDto)
                    .collect(Collectors.toList());

            return ApiResponse.success("Success", summaries);

        } catch (Exception e) {
            return ApiResponse.error("Failed to fetch new arrivals: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<List<ProductSummaryDto>> getTrendingProducts(Integer limit) {
        try {
            limit = (limit == null || limit < 1) ? 10 : limit;

            Pageable pageable = PageRequest.of(0, limit);
            List<Product> products = productRepository.findTrendingProducts(pageable);

            List<ProductSummaryDto> summaries = products.stream()
                    .map(this::convertToProductSummaryDto)
                    .collect(Collectors.toList());

            return ApiResponse.success("Success", summaries);

        } catch (Exception e) {
            return ApiResponse.error("Failed to fetch trending products: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<ProductListResponseDto> getProductsByCategory(
            Integer categoryId,
            Integer page,
            Integer pageSize,
            String sortBy,
            String sortOrder) {
        try {
            if (categoryId == null) {
                return ApiResponse.error("categoryId is required");
            }

            page = (page == null || page < 1) ? 1 : page;
            pageSize = (pageSize == null || pageSize < 1) ? 25 : pageSize;
            sortBy = (sortBy == null || sortBy.isEmpty()) ? "popularity" : sortBy;
            sortOrder = (sortOrder == null || sortOrder.isEmpty()) ? "desc" : sortOrder;

            Pageable pageable = createPageable(page - 1, pageSize, sortBy, sortOrder);

            Page<Product> productPage = productRepository.findByCategoryId(categoryId, pageable);

            List<ProductDto> productDtos = productPage.getContent().stream()
                    .map(this::convertToProductDto)
                    .collect(Collectors.toList());

            PaginationDto paginationDto = new PaginationDto(
                    page,
                    pageSize,
                    productPage.getTotalElements(),
                    productPage.getTotalPages(),
                    productPage.hasNext(),
                    productPage.hasPrevious());

            Map<String, Object> appliedFilters = new HashMap<>();
            appliedFilters.put("categoryId", categoryId);
            appliedFilters.put("sortBy", sortBy);
            appliedFilters.put("sortOrder", sortOrder);

            ProductListResponseDto responseData = new ProductListResponseDto(
                    productDtos,
                    paginationDto,
                    appliedFilters);

            return ApiResponse.success("Success", responseData);

        } catch (Exception e) {
            return ApiResponse.error("Failed to fetch products by category: " + e.getMessage());
        }
    }

    // Helper methods

    private Pageable createPageable(int page, int size, String sortBy, String sortOrder) {
        Sort sort;

        switch (sortBy.toLowerCase()) {
            case "price":
                sort = Sort.by("price");
                break;
            case "newest":
                sort = Sort.by("createdAt");
                break;
            case "rating":
                sort = Sort.by("rating");
                break;
            case "popularity":
            default:
                // Sort by total quantity sold in COMPLETED orders
                sort = Sort.by("completedOrderSoldCount").and(Sort.by("viewCount"));
                break;
        }

        // Apply sort order
        sort = sortOrder.equalsIgnoreCase("asc") ? sort.ascending() : sort.descending();

        return PageRequest.of(page, size, sort);
    }

    private ProductDto convertToProductDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setImageUrl(product.getImageUrl());
        dto.setCategory(product.getCategory() != null ? product.getCategory().getCategoryName() : null);
        dto.setOrigin(product.getOrigin() != null ? product.getOrigin().getValue() : null);
        dto.setIsOrganic(product.getIsOrganic());
        dto.setStock(product.getStock());
        dto.setUnit(product.getUnit());
        dto.setRating(product.getRating());
        dto.setReviewCount(product.getReviewCount());
        dto.setDiscount(product.getDiscount());
        dto.setShopId(product.getShop() != null ? product.getShop().getShopId() : null);
        dto.setShopName(product.getShop() != null ? product.getShop().getShopName() : null);
        dto.setTags(generateTags(product));
        dto.setSoldCount(product.getCompletedOrderSoldCount() != null ? product.getCompletedOrderSoldCount() : 0);
        dto.setViewCount(product.getViewCount());
        dto.setIsFavorite(false); // TODO: Implement favorite logic when user authentication is ready
        return dto;
    }

    private ProductSummaryDto convertToProductSummaryDto(Product product) {
        ProductSummaryDto dto = new ProductSummaryDto();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setImageUrl(product.getImageUrl());
        dto.setShopName(product.getShop() != null ? product.getShop().getShopName() : null);
        dto.setTags(generateTags(product));
        dto.setRating(product.getRating());
        dto.setSoldCount(product.getCompletedOrderSoldCount() != null ? product.getCompletedOrderSoldCount() : 0);
        dto.setViewCount(product.getViewCount());
        dto.setCreatedAt(product.getCreatedAt());
        return dto;
    }

    private List<String> generateTags(Product product) {
        List<String> tags = new ArrayList<>();

        // Check if product is new (created within 30 days)
        if (product.getCreatedAt() != null &&
                product.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(30))) {
            tags.add("NEW");
        }

        // Check if product has discount
        if (product.getDiscount() != null && product.getDiscount() > 0) {
            tags.add("SALE");
        }

        // Check if product is organic
        if (Boolean.TRUE.equals(product.getIsOrganic())) {
            tags.add("ORGANIC");
        }

        // Check if product is trending (high sold count)
        if (product.getCompletedOrderSoldCount() != null && product.getCompletedOrderSoldCount() > 100) {
            tags.add("HOT");
        }

        // Check if product is very popular
        if (product.getCompletedOrderSoldCount() != null && product.getCompletedOrderSoldCount() > 500 &&
                product.getViewCount() != null && product.getViewCount() > 1000) {
            tags.add("TRENDING");
        }

        return tags;
    }
}
