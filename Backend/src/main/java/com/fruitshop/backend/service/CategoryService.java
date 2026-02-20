package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.CategoryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {
    Page<CategoryDto> getCategories(String search, Boolean sortByFruitCount, Pageable pageable);
    CategoryDto getCategoryById(Integer id);
    CategoryDto createCategory(CategoryDto categoryDto);
    CategoryDto updateCategory(Integer id, CategoryDto categoryDto);
    CategoryDto toggleCategoryStatus(Integer id);
}
