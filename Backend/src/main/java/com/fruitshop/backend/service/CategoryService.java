package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.CategoryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {
    ApiResponse<Page<CategoryDto>> getCategories(String search, com.fruitshop.backend.model.Category.CategoryStatus status, Boolean sortByProductCount, Pageable pageable);
    ApiResponse<CategoryDto> getCategoryById(Integer id);
    ApiResponse<CategoryDto> createCategory(CategoryDto categoryDto);
    ApiResponse<CategoryDto> updateCategory(Integer id, CategoryDto categoryDto);
    ApiResponse<CategoryDto> toggleCategoryStatus(Integer id);
    ApiResponse<CategoryDto> deleteCategory(Integer id);
    ApiResponse<java.util.List<CategoryDto>> getActiveCategoriesForFilter();
}
