package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.CategoryDto;
import com.fruitshop.backend.model.Category;
import com.fruitshop.backend.repository.CategoryRepository;
import com.fruitshop.backend.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CategoryHandlerTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Name="Fruit", Description=null -> Success
    @Test
    void testCreateCategory_Success() {
        CategoryDto dto = new CategoryDto();
        dto.setCategoryName("Fruit");
        dto.setStatus(Category.CategoryStatus.ACTIVE);
        dto.setDescription(null);

        Category category = new Category();
        category.setCategoryId(1);
        category.setStatus(Category.CategoryStatus.ACTIVE);
        category.setCategoryName("Fruit");
        category.setDescription(null);

        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        CategoryDto result = categoryService.createCategory(dto);

        assertNotNull(result);
        assertEquals("Fruit", result.getCategoryName());
        assertEquals(Category.CategoryStatus.ACTIVE, result.getStatus());
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    // Name=null, Description=null -> "Tên là null"
    @Test
    void testCreateCategory_NameNull() {
        CategoryDto dto = new CategoryDto();
        dto.setStatus(Category.CategoryStatus.ACTIVE);
        dto.setCategoryName(null);
        dto.setDescription(null);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            categoryService.createCategory(dto);
        });

        assertEquals("Tên là null", exception.getMessage());
        verify(categoryRepository, never()).save(any());
    }

    // Name="Fr", Description=null -> "Tên dưới 4 kí tự"
    @Test
    void testCreateCategory_NameTooShort() {
        CategoryDto dto = new CategoryDto();
        dto.setCategoryName("Fr");
        dto.setDescription(null);
        dto.setStatus(Category.CategoryStatus.ACTIVE);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            categoryService.createCategory(dto);
        });

        assertEquals("Tên dưới 4 kí tự", exception.getMessage());
        verify(categoryRepository, never()).save(any());
    }

    // Name="Fruit", Description > 255 chars -> "Miêu tả nhiều hơn 255 ký tự"
    @Test
    void testCreateCategory_DescriptionTooLong() {
        CategoryDto dto = new CategoryDto();
        dto.setStatus(Category.CategoryStatus.ACTIVE);
        dto.setCategoryName("Fruit");
        StringBuilder longDescription = new StringBuilder();
        for (int i = 0; i < 256; i++) {
            longDescription.append("a");
        }
        dto.setDescription(longDescription.toString());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            categoryService.createCategory(dto);
        });

        assertEquals("Miêu tả nhiều hơn 255 ký tự", exception.getMessage());
        verify(categoryRepository, never()).save(any());
    }

    // Name > 100 chars, Description="Fresh Fruit" -> "Tên nhiều hơn 100 ký tự"
    @Test
    void testCreateCategory_NameTooLong() {
        CategoryDto dto = new CategoryDto();
        dto.setCategoryName(null);
        StringBuilder longName = new StringBuilder();
        for (int i = 0; i < 101; i++) {
            longName.append("a");
        }
        dto.setCategoryName(longName.toString());
        dto.setStatus(Category.CategoryStatus.INACTIVE);
        dto.setDescription("Fresh Fruit");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            categoryService.createCategory(dto);
        });

        assertEquals("Tên nhiều hơn 100 ký tự", exception.getMessage());
        verify(categoryRepository, never()).save(any());
    }

    @Test
    void testUpdateCategory_Success() {
        Integer id = 1;
        CategoryDto dto = new CategoryDto();
        dto.setStatus(Category.CategoryStatus.ACTIVE);
        dto.setCategoryName("Updated Fruit");
        dto.setDescription("Updated Description");

        Category existingCategory = new Category();
        existingCategory.setCategoryId(id);
        existingCategory.setStatus(Category.CategoryStatus.ACTIVE);
        existingCategory.setCategoryName("Old Fruit");

        when(categoryRepository.findById(id)).thenReturn(Optional.of(existingCategory));
        when(categoryRepository.save(any(Category.class))).thenReturn(existingCategory);

        CategoryDto result = categoryService.updateCategory(id, dto);

        assertNotNull(result);
        assertEquals("Updated Fruit", result.getCategoryName());
        assertEquals(Category.CategoryStatus.ACTIVE, result.getStatus());
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void testUpdateCategory_NotFound() {
        Integer id = 99;
        CategoryDto dto = new CategoryDto();
        dto.setCategoryName("Updated Fruit");
        dto.setStatus(Category.CategoryStatus.ACTIVE);

        when(categoryRepository.findById(id)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            categoryService.updateCategory(id, dto);
        });

        assertEquals("Category not found", exception.getMessage());
        verify(categoryRepository, never()).save(any());
    }

    @Test
    void testUpdateCategory_ValidationError() {
        Integer id = 1;
        CategoryDto dto = new CategoryDto();
        dto.setStatus(Category.CategoryStatus.INACTIVE);
        dto.setCategoryName("Fr"); // Too short

        Category existingCategory = new Category();
        existingCategory.setCategoryId(id);
        existingCategory.setStatus(Category.CategoryStatus.INACTIVE);

        when(categoryRepository.findById(id)).thenReturn(Optional.of(existingCategory));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            categoryService.updateCategory(id, dto);
        });

        assertEquals("Tên dưới 4 kí tự", exception.getMessage());
        verify(categoryRepository, never()).save(any());
    }
}
