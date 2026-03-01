package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.CategoryDto;
import com.fruitshop.backend.model.Category;
import com.fruitshop.backend.repository.CategoryRepository;
import com.fruitshop.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public ApiResponse<Page<CategoryDto>> getCategories(String search, Boolean sortByFruitCount, Pageable pageable) {
        Page<Category> categories;
        if (search != null && !search.isEmpty()) {
            categories = categoryRepository.findByCategoryNameContainingIgnoreCase(search, pageable);
        } else if (Boolean.TRUE.equals(sortByFruitCount)) {
            categories = categoryRepository.findAllOrderByFruitCountDesc(pageable);
        } else {
            categories = categoryRepository.findAll(pageable);
        }
        Page<CategoryDto> categoryDtos = categories.map(this::convertToDto);
        return ApiResponse.success("Categories retrieved successfully", categoryDtos);
    }

    @Override
    public ApiResponse<CategoryDto> getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id).orElse(null);
        if (category == null) {
            return ApiResponse.error("Category not found");
        }
        return ApiResponse.success("Category retrieved successfully", convertToDto(category));
    }

    @Override
    @Transactional
    public ApiResponse<CategoryDto> createCategory(CategoryDto categoryDto) {
        Category category = new Category();
        category.setCategoryName(categoryDto.getCategoryName());
        category.setDescription(categoryDto.getDescription());
        category.setStatus(Category.CategoryStatus.ACTIVE);
        Category savedCategory = categoryRepository.save(category);
        return ApiResponse.success("Category created successfully", convertToDto(savedCategory));
    }

    @Override
    @Transactional
    public ApiResponse<CategoryDto> updateCategory(Integer id, CategoryDto categoryDto) {
        Category category = categoryRepository.findById(id).orElse(null);
        if (category == null) {
            return ApiResponse.error("Category not found");
        }
        category.setCategoryName(categoryDto.getCategoryName());
        category.setDescription(categoryDto.getDescription());
        Category updatedCategory = categoryRepository.save(category);
        return ApiResponse.success("Category updated successfully", convertToDto(updatedCategory));
    }

    @Override
    @Transactional
    public ApiResponse<CategoryDto> toggleCategoryStatus(Integer id) {
        Category category = categoryRepository.findById(id).orElse(null);
        if (category == null) {
            return ApiResponse.error("Category not found");
        }
        if (category.getStatus() == Category.CategoryStatus.ACTIVE) {
            category.setStatus(Category.CategoryStatus.INACTIVE);
        } else {
            category.setStatus(Category.CategoryStatus.ACTIVE);
        }
        Category updatedCategory = categoryRepository.save(category);
        return ApiResponse.success("Category status toggled successfully", convertToDto(updatedCategory));
    }

    private CategoryDto convertToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setCategoryId(category.getCategoryId());
        dto.setCategoryName(category.getCategoryName());
        dto.setDescription(category.getDescription());
        dto.setStatus(category.getStatus());
        dto.setFruitCount(category.getFruits() != null ? (long) category.getFruits().size() : 0L);
        return dto;
    }
}
