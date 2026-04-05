package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.*;
import com.fruitshop.backend.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    private ProductDto productDto1;
    private ProductDto productDto2;
    private ProductSummaryDto summaryDto1;
    private ProductSummaryDto summaryDto2;
    private ProductListResponseDto productListResponse;
    private ApiResponse<ProductListResponseDto> productsApiResponse;
    private ApiResponse<List<ProductSummaryDto>> newArrivalsApiResponse;
    private ApiResponse<List<ProductSummaryDto>> trendingApiResponse;

    @BeforeEach
    void setUp() {
        // Setup ProductDto 1
        productDto1 = new ProductDto();
        productDto1.setProductId(1);
        productDto1.setName("Táo Envy Mỹ");
        productDto1.setDescription("Táo Envy size lớn, giòn ngọt");
        productDto1.setPrice(new BigDecimal("250000"));
        productDto1.setOriginalPrice(new BigDecimal("300000"));
        productDto1.setImageUrl("http://example.com/apple.jpg");
        productDto1.setCategory("Trái cây nhập khẩu");
        productDto1.setOrigin("imported");
        productDto1.setIsOrganic(true);
        productDto1.setStock(100);
        productDto1.setUnit("kg");
        productDto1.setRating(new BigDecimal("4.8"));
        productDto1.setReviewCount(50);
        productDto1.setDiscount(17);
        productDto1.setTags(Arrays.asList("SALE", "ORGANIC", "HOT"));
        productDto1.setIsFavorite(false);

        // Setup ProductDto 2
        productDto2 = new ProductDto();
        productDto2.setProductId(2);
        productDto2.setName("Xoài cát Hòa Lộc");
        productDto2.setDescription("Xoài cát đặc sản");
        productDto2.setPrice(new BigDecimal("65000"));
        productDto2.setOriginalPrice(null);
        productDto2.setImageUrl("http://example.com/mango.jpg");
        productDto2.setCategory("Trái cây nội địa");
        productDto2.setOrigin("local");
        productDto2.setIsOrganic(false);
        productDto2.setStock(200);
        productDto2.setUnit("kg");
        productDto2.setRating(new BigDecimal("4.9"));
        productDto2.setReviewCount(150);
        productDto2.setDiscount(0);
        productDto2.setTags(Arrays.asList("HOT", "TRENDING"));
        productDto2.setIsFavorite(false);

        // Setup ProductSummaryDto 1
        summaryDto1 = new ProductSummaryDto();
        summaryDto1.setProductId(1);
        summaryDto1.setName("Táo Envy Mỹ");
        summaryDto1.setPrice(new BigDecimal("250000"));
        summaryDto1.setImageUrl("http://example.com/apple.jpg");
        summaryDto1.setTags(Arrays.asList("NEW", "SALE"));
        summaryDto1.setRating(new BigDecimal("4.8"));
        summaryDto1.setCreatedAt(LocalDateTime.now().minusDays(5));

        // Setup ProductSummaryDto 2
        summaryDto2 = new ProductSummaryDto();
        summaryDto2.setProductId(2);
        summaryDto2.setName("Xoài cát Hòa Lộc");
        summaryDto2.setPrice(new BigDecimal("65000"));
        summaryDto2.setImageUrl("http://example.com/mango.jpg");
        summaryDto2.setTags(Arrays.asList("TRENDING", "HOT"));
        summaryDto2.setRating(new BigDecimal("4.9"));
        summaryDto2.setSoldCount(600);
        summaryDto2.setViewCount(2000);

        // Setup PaginationDto
        PaginationDto paginationDto = new PaginationDto(
                1, 25, 2L, 1, false, false);

        // Setup applied filters
        Map<String, Object> appliedFilters = new HashMap<>();
        appliedFilters.put("sortBy", "popularity");
        appliedFilters.put("sortOrder", "desc");

        // Setup ProductListResponseDto
        productListResponse = new ProductListResponseDto(
                Arrays.asList(productDto1, productDto2),
                paginationDto,
                appliedFilters);

        // Setup API Responses
        productsApiResponse = new ApiResponse<>(0, "Success", productListResponse);
        newArrivalsApiResponse = new ApiResponse<>(0, "Success", Arrays.asList(summaryDto1, summaryDto2));
        trendingApiResponse = new ApiResponse<>(0, "Success", Arrays.asList(summaryDto2, summaryDto1));
    }

    // ==================== GET PRODUCTS TESTS ====================

    @Test
    void getProducts_Success_WithDefaultParameters() throws Exception {
        // Arrange
        when(productService.getProducts(
                anyInt(), anyInt(), any(), any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(productsApiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.message").value("Success"))
                .andExpect(jsonPath("$.data.products").isArray())
                .andExpect(jsonPath("$.data.products", hasSize(2)))
                .andExpect(jsonPath("$.data.products[0].name").value("Táo Envy Mỹ"))
                .andExpect(jsonPath("$.data.products[0].price").value(250000))
                .andExpect(jsonPath("$.data.pagination.currentPage").value(1))
                .andExpect(jsonPath("$.data.pagination.pageSize").value(25))
                .andExpect(jsonPath("$.data.pagination.totalItems").value(2));

        verify(productService, times(1)).getProducts(
                anyInt(), anyInt(), any(), any(), any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    void getProducts_Success_WithSearchParameter() throws Exception {
        // Arrange
        when(productService.getProducts(
                eq(1), eq(25), eq("táo"), any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(productsApiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products")
                .param("search", "táo")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.data.products").isArray());

        verify(productService, times(1)).getProducts(
                eq(1), eq(25), eq("táo"), any(), any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    void getProducts_Success_WithPriceRangeFilter() throws Exception {
        // Arrange
        when(productService.getProducts(
                eq(1), eq(25), any(), any(),
                eq(new BigDecimal("50000")), eq(new BigDecimal("100000")),
                any(), any(), any(), any(), any()))
                .thenReturn(productsApiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products")
                .param("minPrice", "50000")
                .param("maxPrice", "100000")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0));

        verify(productService, times(1)).getProducts(
                eq(1), eq(25), any(), any(),
                eq(new BigDecimal("50000")), eq(new BigDecimal("100000")),
                any(), any(), any(), any(), any());
    }

    @Test
    void getProducts_Success_WithCategoryFilter() throws Exception {
        // Arrange
        when(productService.getProducts(
                eq(1), eq(25), any(), any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(productsApiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products")
                .param("category", "1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0));

        verify(productService, times(1)).getProducts(
                eq(1), eq(25), any(), any(), any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    void getProducts_Success_WithOriginFilter() throws Exception {
        // Arrange
        when(productService.getProducts(
                eq(1), eq(25), any(), any(), any(), any(), eq("local"), any(), any(), any(), any()))
                .thenReturn(productsApiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products")
                .param("origin", "local")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0));

        verify(productService, times(1)).getProducts(
                eq(1), eq(25), any(), any(), any(), any(), eq("local"), any(), any(), any(), any());
    }

    @Test
    void getProducts_Success_WithOrganicFilter() throws Exception {
        // Arrange
        when(productService.getProducts(
                eq(1), eq(25), any(), any(), any(), any(), any(), eq(true), any(), any(), any()))
                .thenReturn(productsApiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products")
                .param("organic", "true")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0));

        verify(productService, times(1)).getProducts(
                eq(1), eq(25), any(), any(), any(), any(), any(), eq(true), any(), any(), any());
    }

    @Test
    void getProducts_Success_WithSortParameters() throws Exception {
        // Arrange
        when(productService.getProducts(
                eq(1), eq(25), any(), any(), any(), any(), any(), any(), eq("price"), eq("asc"), any()))
                .thenReturn(productsApiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products")
                .param("sortBy", "price")
                .param("sortOrder", "asc")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0));

        verify(productService, times(1)).getProducts(
                eq(1), eq(25), any(), any(), any(), any(), any(), any(), eq("price"), eq("asc"), any());
    }

    @Test
    void getProducts_Success_WithPagination() throws Exception {
        // Arrange
        when(productService.getProducts(
                eq(2), eq(10), any(), any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(productsApiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products")
                .param("page", "2")
                .param("pageSize", "10")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0));

        verify(productService, times(1)).getProducts(
                eq(2), eq(10), any(), any(), any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    void getProducts_Success_WithAllFilters() throws Exception {
        // Arrange
        when(productService.getProducts(
                eq(1), eq(20), eq("táo"), any(),
                eq(new BigDecimal("10000")), eq(new BigDecimal("500000")),
                eq("imported"), eq(true), eq("rating"), eq("desc"), any()))
                .thenReturn(productsApiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products")
                .param("page", "1")
                .param("pageSize", "20")
                .param("search", "táo")
                .param("category", "1")
                .param("minPrice", "10000")
                .param("maxPrice", "500000")
                .param("origin", "imported")
                .param("organic", "true")
                .param("sortBy", "rating")
                .param("sortOrder", "desc")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0));

        verify(productService, times(1)).getProducts(
                eq(1), eq(20), eq("táo"), any(),
                eq(new BigDecimal("10000")), eq(new BigDecimal("500000")),
                eq("imported"), eq(true), eq("rating"), eq("desc"), any());
    }

    @Test
    void getProducts_Error_ServiceException() throws Exception {
        // Arrange
        ApiResponse<ProductListResponseDto> errorResponse = new ApiResponse<>(
                1, "Failed to fetch products: Database error", null);

        when(productService.getProducts(
                anyInt(), anyInt(), any(), any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(errorResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value(containsString("Failed to fetch products")))
                .andExpect(jsonPath("$.data").doesNotExist());
    }

    // ==================== GET NEW ARRIVALS TESTS ====================

    @Test
    void getNewArrivals_Success_WithDefaultLimit() throws Exception {
        // Arrange
        when(productService.getNewArrivals(anyInt()))
                .thenReturn(newArrivalsApiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products/new-arrivals")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.message").value("Success"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].productId").value(1))
                .andExpect(jsonPath("$.data[0].name").value("Táo Envy Mỹ"))
                .andExpect(jsonPath("$.data[0].tags", hasItem("NEW")));

        verify(productService, times(1)).getNewArrivals(anyInt());
    }

    @Test
    void getNewArrivals_Success_WithCustomLimit() throws Exception {
        // Arrange
        when(productService.getNewArrivals(eq(5)))
                .thenReturn(newArrivalsApiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products/new-arrivals")
                .param("limit", "5")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.data").isArray());

        verify(productService, times(1)).getNewArrivals(eq(5));
    }

    @Test
    void getNewArrivals_Success_EmptyList() throws Exception {
        // Arrange
        ApiResponse<List<ProductSummaryDto>> emptyResponse = new ApiResponse<>(
                0, "Success", new ArrayList<>());
        when(productService.getNewArrivals(anyInt()))
                .thenReturn(emptyResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products/new-arrivals")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", hasSize(0)));
    }

    @Test
    void getNewArrivals_Error_ServiceException() throws Exception {
        // Arrange
        ApiResponse<List<ProductSummaryDto>> errorResponse = new ApiResponse<>(
                1, "Failed to fetch new arrivals: Database error", null);
        when(productService.getNewArrivals(anyInt()))
                .thenReturn(errorResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products/new-arrivals")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value(containsString("Failed to fetch new arrivals")))
                .andExpect(jsonPath("$.data").doesNotExist());
    }

    // ==================== GET TRENDING PRODUCTS TESTS ====================

    @Test
    void getTrendingProducts_Success_WithDefaultLimit() throws Exception {
        // Arrange
        when(productService.getTrendingProducts(anyInt()))
                .thenReturn(trendingApiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products/trending")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.message").value("Success"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].productId").value(2))
                .andExpect(jsonPath("$.data[0].name").value("Xoài cát Hòa Lộc"))
                .andExpect(jsonPath("$.data[0].tags", hasItem("TRENDING")))
                .andExpect(jsonPath("$.data[0].soldCount").value(600))
                .andExpect(jsonPath("$.data[0].viewCount").value(2000));

        verify(productService, times(1)).getTrendingProducts(anyInt());
    }

    @Test
    void getTrendingProducts_Success_WithCustomLimit() throws Exception {
        // Arrange
        when(productService.getTrendingProducts(eq(8)))
                .thenReturn(trendingApiResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products/trending")
                .param("limit", "8")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.data").isArray());

        verify(productService, times(1)).getTrendingProducts(eq(8));
    }

    @Test
    void getTrendingProducts_Success_EmptyList() throws Exception {
        // Arrange
        ApiResponse<List<ProductSummaryDto>> emptyResponse = new ApiResponse<>(
                0, "Success", new ArrayList<>());
        when(productService.getTrendingProducts(anyInt()))
                .thenReturn(emptyResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products/trending")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(0))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", hasSize(0)));
    }

    @Test
    void getTrendingProducts_Error_ServiceException() throws Exception {
        // Arrange
        ApiResponse<List<ProductSummaryDto>> errorResponse = new ApiResponse<>(
                1, "Failed to fetch trending products: Database error", null);
        when(productService.getTrendingProducts(anyInt()))
                .thenReturn(errorResponse);

        // Act & Assert
        mockMvc.perform(get("/api/products/trending")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCd").value(1))
                .andExpect(jsonPath("$.message").value(containsString("Failed to fetch trending products")))
                .andExpect(jsonPath("$.data").doesNotExist());
    }
}
