package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.*;
import com.fruitshop.backend.model.Category;
import com.fruitshop.backend.model.Product;
import com.fruitshop.backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product product1;
    private Product product2;
    private Product product3;
    private Category category;

    @BeforeEach
    void setUp() {
        // Setup Category
        category = new Category();
        category.setCategoryId(1);
        category.setCategoryName("Trái cây nhập khẩu");
        category.setStatus(Category.CategoryStatus.ACTIVE);

        // Setup Product 1 - New product with discount
        product1 = new Product();
        product1.setProductId(1);
        product1.setName("Táo Envy Mỹ");
        product1.setDescription("Táo Envy size lớn, giòn ngọt");
        product1.setPrice(new BigDecimal("250000"));
        product1.setOriginalPrice(new BigDecimal("300000"));
        product1.setImageUrl("http://example.com/apple.jpg");
        product1.setCategory(category);
        product1.setOrigin(Product.Origin.IMPORTED);
        product1.setIsOrganic(true);
        product1.setStock(100);
        product1.setUnit("kg");
        product1.setRating(new BigDecimal("4.8"));
        product1.setReviewCount(50);
        product1.setDiscount(17);
        product1.setSoldCount(120);
        product1.setViewCount(500);
        product1.setCreatedAt(LocalDateTime.now().minusDays(10));
        product1.setUpdatedAt(LocalDateTime.now());
        product1.setIsActive(true);

        // Setup Product 2 - Trending product
        product2 = new Product();
        product2.setProductId(2);
        product2.setName("Xoài cát Hòa Lộc");
        product2.setDescription("Xoài cát đặc sản Hòa Lộc");
        product2.setPrice(new BigDecimal("65000"));
        product2.setOriginalPrice(null);
        product2.setImageUrl("http://example.com/mango.jpg");
        product2.setCategory(category);
        product2.setOrigin(Product.Origin.LOCAL);
        product2.setIsOrganic(false);
        product2.setStock(200);
        product2.setUnit("kg");
        product2.setRating(new BigDecimal("4.9"));
        product2.setReviewCount(150);
        product2.setDiscount(0);
        product2.setSoldCount(600);
        product2.setViewCount(2000);
        product2.setCreatedAt(LocalDateTime.now().minusDays(60));
        product2.setUpdatedAt(LocalDateTime.now());
        product2.setIsActive(true);

        // Setup Product 3 - New arrival
        product3 = new Product();
        product3.setProductId(3);
        product3.setName("Dưa lưới Nhật Bản");
        product3.setDescription("Dưa lưới cao cấp");
        product3.setPrice(new BigDecimal("180000"));
        product3.setOriginalPrice(new BigDecimal("200000"));
        product3.setImageUrl("http://example.com/melon.jpg");
        product3.setCategory(category);
        product3.setOrigin(Product.Origin.IMPORTED);
        product3.setIsOrganic(true);
        product3.setStock(50);
        product3.setUnit("quả");
        product3.setRating(new BigDecimal("5.0"));
        product3.setReviewCount(20);
        product3.setDiscount(10);
        product3.setSoldCount(30);
        product3.setViewCount(150);
        product3.setCreatedAt(LocalDateTime.now().minusDays(5));
        product3.setUpdatedAt(LocalDateTime.now());
        product3.setIsActive(true);
    }

    // ==================== GET PRODUCTS TESTS ====================

    @Test
    void getProducts_Success_WithDefaultParameters() {
        // Arrange
        List<Product> products = Arrays.asList(product1, product2, product3);
        Page<Product> productPage = new PageImpl<>(products);

        when(productRepository.searchProducts(
                any(), any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
                .thenReturn(productPage);

        // Act
        ApiResponse<ProductListResponseDto> response = productService.getProducts(
                null, null, null, null, null, null, null, null, null, null, null);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertEquals("Success", response.getMessage());
        assertNotNull(response.getData());
        assertEquals(3, response.getData().getProducts().size());
        assertEquals(1, response.getData().getPagination().getCurrentPage());
        assertEquals(25, response.getData().getPagination().getPageSize());
        assertEquals(3, response.getData().getPagination().getTotalItems());

        verify(productRepository, times(1)).searchProducts(
                any(), any(), any(), any(), any(), any(), any(), any(), any(Pageable.class));
    }

    @Test
    void getProducts_Success_WithSearchParameter() {
        // Arrange
        List<Product> products = Arrays.asList(product1);
        Page<Product> productPage = new PageImpl<>(products);

        when(productRepository.searchProducts(
                any(), eq("táo"), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
                .thenReturn(productPage);

        // Act
        ApiResponse<ProductListResponseDto> response = productService.getProducts(
                1, 25, "táo", null, null, null, null, null, null, null, null);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertEquals(1, response.getData().getProducts().size());
        assertEquals("Táo Envy Mỹ", response.getData().getProducts().get(0).getName());
        assertTrue(response.getData().getAppliedFilters().containsKey("search"));
        assertEquals("táo", response.getData().getAppliedFilters().get("search"));

        verify(productRepository, times(1)).searchProducts(
                any(), eq("táo"), any(), any(), any(), any(), any(), any(), any(Pageable.class));
    }

    @Test
    void getProducts_Success_WithPriceRangeFilter() {
        // Arrange
        BigDecimal minPrice = new BigDecimal("50000");
        BigDecimal maxPrice = new BigDecimal("100000");
        List<Product> products = Arrays.asList(product2);
        Page<Product> productPage = new PageImpl<>(products);

        when(productRepository.searchProducts(
                any(), any(), any(), any(), eq(minPrice), eq(maxPrice), any(), any(), any(Pageable.class)))
                .thenReturn(productPage);

        // Act
        ApiResponse<ProductListResponseDto> response = productService.getProducts(
                1, 25, null, null, minPrice, maxPrice, null, null, null, null, null);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertEquals(1, response.getData().getProducts().size());
        assertTrue(response.getData().getAppliedFilters().containsKey("minPrice"));
        assertTrue(response.getData().getAppliedFilters().containsKey("maxPrice"));

        verify(productRepository, times(1)).searchProducts(
                any(), any(), any(), any(), eq(minPrice), eq(maxPrice), any(), any(), any(Pageable.class));
    }

    @Test
    void getProducts_Success_WithOrganicFilter() {
        // Arrange
        List<Product> products = Arrays.asList(product1, product3);
        Page<Product> productPage = new PageImpl<>(products);

        when(productRepository.searchProducts(
                any(), any(), any(), any(), any(), any(), any(), eq(true), any(Pageable.class)))
                .thenReturn(productPage);

        // Act
        ApiResponse<ProductListResponseDto> response = productService.getProducts(
                1, 25, null, null, null, null, null, true, null, null, null);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertEquals(2, response.getData().getProducts().size());
        assertTrue(response.getData().getAppliedFilters().containsKey("organic"));
        assertEquals(true, response.getData().getAppliedFilters().get("organic"));

        verify(productRepository, times(1)).searchProducts(
                any(), any(), any(), any(), any(), any(), any(), eq(true), any(Pageable.class));
    }

    @Test
    void getProducts_Success_WithOriginFilter() {
        // Arrange
        List<Product> products = Arrays.asList(product2);
        Page<Product> productPage = new PageImpl<>(products);

        when(productRepository.searchProducts(
                any(), any(), any(), any(), any(), any(), eq(Product.Origin.LOCAL), any(), any(Pageable.class)))
                .thenReturn(productPage);

        // Act
        ApiResponse<ProductListResponseDto> response = productService.getProducts(
                1, 25, null, null, null, null, "local", null, null, null, null);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertEquals(1, response.getData().getProducts().size());
        assertEquals("Xoài cát Hòa Lộc", response.getData().getProducts().get(0).getName());

        verify(productRepository, times(1)).searchProducts(
                any(), any(), any(), any(), any(), any(), eq(Product.Origin.LOCAL), any(), any(Pageable.class));
    }

    @Test
    void getProducts_Success_WithPagination() {
        // Arrange
        List<Product> products = Arrays.asList(product1, product2);
        Page<Product> productPage = new PageImpl<>(products,
                org.springframework.data.domain.PageRequest.of(1, 2), 5);

        when(productRepository.searchProducts(
                any(), any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
                .thenReturn(productPage);

        // Act
        ApiResponse<ProductListResponseDto> response = productService.getProducts(
                2, 2, null, null, null, null, null, null, null, null, null);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertEquals(2, response.getData().getPagination().getCurrentPage());
        assertEquals(2, response.getData().getPagination().getPageSize());
        assertEquals(5, response.getData().getPagination().getTotalItems());
        assertEquals(3, response.getData().getPagination().getTotalPages());
        assertTrue(response.getData().getPagination().getHasNextPage());
        assertTrue(response.getData().getPagination().getHasPreviousPage());
    }

    @Test
    void getProducts_Success_WithSortByPrice() {
        // Arrange
        List<Product> products = Arrays.asList(product2, product3, product1);
        Page<Product> productPage = new PageImpl<>(products);

        when(productRepository.searchProducts(
                any(), any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
                .thenReturn(productPage);

        // Act
        ApiResponse<ProductListResponseDto> response = productService.getProducts(
                1, 25, null, null, null, null, null, null, "price", "asc", null);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertEquals("price", response.getData().getAppliedFilters().get("sortBy"));
        assertEquals("asc", response.getData().getAppliedFilters().get("sortOrder"));
    }

    @Test
    void getProducts_Error_RepositoryException() {
        // Arrange
        when(productRepository.searchProducts(
                any(), any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
                .thenThrow(new RuntimeException("Database error"));

        // Act
        ApiResponse<ProductListResponseDto> response = productService.getProducts(
                1, 25, null, null, null, null, null, null, null, null, null);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getResultCd());
        assertTrue(response.getMessage().contains("Failed to fetch products"));
        assertNull(response.getData());
    }

    // ==================== GET NEW ARRIVALS TESTS ====================

    @Test
    void getNewArrivals_Success_WithDefaultLimit() {
        // Arrange
        List<Product> products = Arrays.asList(product3, product1, product2);
        when(productRepository.findNewArrivals(any(Pageable.class)))
                .thenReturn(products);

        // Act
        ApiResponse<List<ProductSummaryDto>> response = productService.getNewArrivals(null);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertEquals("Success", response.getMessage());
        assertNotNull(response.getData());
        assertEquals(3, response.getData().size());
        assertEquals("Dưa lưới Nhật Bản", response.getData().get(0).getName());
        assertEquals(3, response.getData().get(0).getProductId());

        verify(productRepository, times(1)).findNewArrivals(any(Pageable.class));
    }

    @Test
    void getNewArrivals_Success_WithCustomLimit() {
        // Arrange
        List<Product> products = Arrays.asList(product3, product1);
        when(productRepository.findNewArrivals(any(Pageable.class)))
                .thenReturn(products);

        // Act
        ApiResponse<List<ProductSummaryDto>> response = productService.getNewArrivals(5);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertEquals(2, response.getData().size());
        assertTrue(response.getData().get(0).getTags().contains("NEW"));

        verify(productRepository, times(1)).findNewArrivals(any(Pageable.class));
    }

    @Test
    void getNewArrivals_Success_EmptyList() {
        // Arrange
        when(productRepository.findNewArrivals(any(Pageable.class)))
                .thenReturn(Arrays.asList());

        // Act
        ApiResponse<List<ProductSummaryDto>> response = productService.getNewArrivals(10);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertEquals(0, response.getData().size());
    }

    @Test
    void getNewArrivals_Error_RepositoryException() {
        // Arrange
        when(productRepository.findNewArrivals(any(Pageable.class)))
                .thenThrow(new RuntimeException("Database error"));

        // Act
        ApiResponse<List<ProductSummaryDto>> response = productService.getNewArrivals(10);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getResultCd());
        assertTrue(response.getMessage().contains("Failed to fetch new arrivals"));
        assertNull(response.getData());
    }

    // ==================== GET TRENDING PRODUCTS TESTS ====================

    @Test
    void getTrendingProducts_Success_WithDefaultLimit() {
        // Arrange
        List<Product> products = Arrays.asList(product2, product1, product3);
        when(productRepository.findTrendingProducts(any(Pageable.class)))
                .thenReturn(products);

        // Act
        ApiResponse<List<ProductSummaryDto>> response = productService.getTrendingProducts(null);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertEquals("Success", response.getMessage());
        assertNotNull(response.getData());
        assertEquals(3, response.getData().size());
        assertEquals("Xoài cát Hòa Lộc", response.getData().get(0).getName());
        assertEquals(600, response.getData().get(0).getSoldCount());

        verify(productRepository, times(1)).findTrendingProducts(any(Pageable.class));
    }

    @Test
    void getTrendingProducts_Success_WithCustomLimit() {
        // Arrange
        List<Product> products = Arrays.asList(product2, product1);
        when(productRepository.findTrendingProducts(any(Pageable.class)))
                .thenReturn(products);

        // Act
        ApiResponse<List<ProductSummaryDto>> response = productService.getTrendingProducts(2);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertEquals(2, response.getData().size());
        assertTrue(response.getData().get(0).getTags().contains("TRENDING"));

        verify(productRepository, times(1)).findTrendingProducts(any(Pageable.class));
    }

    @Test
    void getTrendingProducts_Success_EmptyList() {
        // Arrange
        when(productRepository.findTrendingProducts(any(Pageable.class)))
                .thenReturn(Arrays.asList());

        // Act
        ApiResponse<List<ProductSummaryDto>> response = productService.getTrendingProducts(10);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getResultCd());
        assertEquals(0, response.getData().size());
    }

    @Test
    void getTrendingProducts_Error_RepositoryException() {
        // Arrange
        when(productRepository.findTrendingProducts(any(Pageable.class)))
                .thenThrow(new RuntimeException("Database error"));

        // Act
        ApiResponse<List<ProductSummaryDto>> response = productService.getTrendingProducts(10);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getResultCd());
        assertTrue(response.getMessage().contains("Failed to fetch trending products"));
        assertNull(response.getData());
    }

    // ==================== TAG GENERATION TESTS ====================

    @Test
    void productDto_ShouldHaveCorrectTags_ForNewProduct() {
        // Arrange
        List<Product> products = Arrays.asList(product3);
        Page<Product> productPage = new PageImpl<>(products);

        when(productRepository.searchProducts(
                any(), any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
                .thenReturn(productPage);

        // Act
        ApiResponse<ProductListResponseDto> response = productService.getProducts(
                1, 25, null, null, null, null, null, null, null, null, null);

        // Assert
        ProductDto dto = response.getData().getProducts().get(0);
        assertTrue(dto.getTags().contains("NEW"), "Should have NEW tag");
        assertTrue(dto.getTags().contains("SALE"), "Should have SALE tag");
        assertTrue(dto.getTags().contains("ORGANIC"), "Should have ORGANIC tag");
    }

    @Test
    void productDto_ShouldHaveCorrectTags_ForTrendingProduct() {
        // Arrange
        List<Product> products = Arrays.asList(product2);
        Page<Product> productPage = new PageImpl<>(products);

        when(productRepository.searchProducts(
                any(), any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
                .thenReturn(productPage);

        // Act
        ApiResponse<ProductListResponseDto> response = productService.getProducts(
                1, 25, null, null, null, null, null, null, null, null, null);

        // Assert
        ProductDto dto = response.getData().getProducts().get(0);
        assertTrue(dto.getTags().contains("HOT"), "Should have HOT tag (soldCount > 100)");
        assertTrue(dto.getTags().contains("TRENDING"),
                "Should have TRENDING tag (soldCount > 500 && viewCount > 1000)");
        assertFalse(dto.getTags().contains("NEW"), "Should not have NEW tag");
        assertFalse(dto.getTags().contains("SALE"), "Should not have SALE tag");
    }
}
