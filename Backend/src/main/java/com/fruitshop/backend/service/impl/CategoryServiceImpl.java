package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.CategoryDto;
import com.fruitshop.backend.model.Category;
import com.fruitshop.backend.repository.CategoryRepository;
import com.fruitshop.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Page<CategoryDto> getCategories(String search, Boolean sortByFruitCount, Pageable pageable) {
        Page<Category> categories;
        if (search != null && !search.isEmpty()) {
            categories = categoryRepository.findByCategoryNameContainingIgnoreCase(search, pageable);
        } else if (Boolean.TRUE.equals(sortByFruitCount)) {
            categories = categoryRepository.findAllOrderByFruitCountDesc(pageable);
        } else {
            categories = categoryRepository.findAll(pageable);
        }
        return categories.map(this::convertToDto);
    }

    @Override
    public CategoryDto getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return convertToDto(category);
    }

    @Override
    public CategoryDto createCategory(CategoryDto categoryDto) {
        Category category = new Category();
        category.setCategoryName(categoryDto.getCategoryName());
        category.setDescription(categoryDto.getDescription());
        category.setStatus(Category.CategoryStatus.ACTIVE);
        return convertToDto(categoryRepository.save(category));
    }

    @Override
    public CategoryDto updateCategory(Integer id, CategoryDto categoryDto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setCategoryName(categoryDto.getCategoryName());
        category.setDescription(categoryDto.getDescription());
        return convertToDto(categoryRepository.save(category));
    }

    @Override
    public CategoryDto toggleCategoryStatus(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        if (category.getStatus() == Category.CategoryStatus.ACTIVE) {
            category.setStatus(Category.CategoryStatus.INACTIVE);
        } else {
            category.setStatus(Category.CategoryStatus.ACTIVE);
        }
        return convertToDto(categoryRepository.save(category));
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
