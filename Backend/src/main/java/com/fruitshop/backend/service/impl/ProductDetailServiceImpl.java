package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ProductDetailDto;
import com.fruitshop.backend.dto.ProductSummaryDto;
import com.fruitshop.backend.exception.ProductNotFoundException;
import com.fruitshop.backend.model.Product;
import com.fruitshop.backend.repository.ProductDetailRepository;
import com.fruitshop.backend.service.ProductDetailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductDetailServiceImpl implements ProductDetailService {

    private final ProductDetailRepository productDetailRepository;

    @Override
    @Transactional
    public ApiResponse<ProductDetailDto> getProductDetail(Integer id) {
        log.info("Fetching product detail for id: {}", id);

        Product product = productDetailRepository.findActiveProductById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        // Increment view count
        productDetailRepository.incrementViewCount(id);

        ProductDetailDto dto = convertToDetailDto(product);
        return ApiResponse.success("Success", dto);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<ProductSummaryDto>> getRelatedProducts(Integer id, Integer limit) {
        log.info("Fetching related products for product id: {}, limit: {}", id, limit);

        limit = (limit == null || limit < 1) ? 8 : limit;

        Product product = productDetailRepository.findActiveProductById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        List<ProductSummaryDto> relatedProducts = new ArrayList<>();

        if (product.getCategory() != null) {
            List<Product> products = productDetailRepository.findRelatedProducts(
                    product.getCategory().getCategoryId(),
                    id,
                    PageRequest.of(0, limit));

            relatedProducts = products.stream()
                    .map(this::convertToSummaryDto)
                    .collect(Collectors.toList());
        }

        return ApiResponse.success("Success", relatedProducts);
    }

    // ==================== Private Helper Methods ====================

    private ProductDetailDto convertToDetailDto(Product product) {
        ProductDetailDto dto = new ProductDetailDto();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setImageUrl(product.getImageUrl());
        dto.setOrigin(product.getOrigin() != null ? product.getOrigin().getValue() : null);
        dto.setIsOrganic(product.getIsOrganic());
        dto.setStock(product.getStock());
        dto.setUnit(product.getUnit());
        dto.setRating(product.getRating());
        dto.setReviewCount(product.getReviewCount());
        dto.setDiscount(product.getDiscount());
        dto.setSoldCount(product.getSoldCount());
        dto.setViewCount(product.getViewCount());
        dto.setIsActive(product.getIsActive());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        dto.setTags(generateTags(product));
        dto.setIsFavorite(false); // TODO: Implement when user authentication is ready

        // Category info
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getCategoryId());
            dto.setCategoryName(product.getCategory().getCategoryName());
        }

        // Shop info
        if (product.getShop() != null) {
            dto.setShopId(product.getShop().getShopId());
            dto.setShopName(product.getShop().getShopName());
        }

        return dto;
    }

    private ProductSummaryDto convertToSummaryDto(Product product) {
        ProductSummaryDto dto = new ProductSummaryDto();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setImageUrl(product.getImageUrl());
        dto.setTags(generateTags(product));
        dto.setRating(product.getRating());
        dto.setSoldCount(product.getSoldCount());
        dto.setViewCount(product.getViewCount());
        dto.setCreatedAt(product.getCreatedAt());
        return dto;
    }

    private List<String> generateTags(Product product) {
        List<String> tags = new ArrayList<>();

        if (product.getCreatedAt() != null &&
                product.getCreatedAt().isAfter(LocalDateTime.now().minusDays(30))) {
            tags.add("NEW");
        }
        if (product.getDiscount() != null && product.getDiscount() > 0) {
            tags.add("SALE");
        }
        if (Boolean.TRUE.equals(product.getIsOrganic())) {
            tags.add("ORGANIC");
        }
        if (product.getSoldCount() != null && product.getSoldCount() > 100) {
            tags.add("HOT");
        }
        if (product.getSoldCount() != null && product.getSoldCount() > 500 &&
                product.getViewCount() != null && product.getViewCount() > 1000) {
            tags.add("TRENDING");
        }

        return tags;
    }
}
