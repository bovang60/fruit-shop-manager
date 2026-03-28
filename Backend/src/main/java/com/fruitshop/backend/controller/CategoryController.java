package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.CategoryDto;
import com.fruitshop.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/filter-list")
    public ResponseEntity<ApiResponse<java.util.List<CategoryDto>>> getActiveCategoriesForFilter() {
        return ResponseEntity.ok(categoryService.getActiveCategoriesForFilter());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CategoryDto>>> getCategories(
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "status", required = false) com.fruitshop.backend.model.Category.CategoryStatus status,
            @RequestParam(name = "sortByProductCount", defaultValue = "false") Boolean sortByProductCount,
            Pageable pageable) {
        return ResponseEntity.ok(categoryService.getCategories(search, status, sortByProductCount, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> getCategory(@PathVariable(name = "id") Integer id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(@RequestBody CategoryDto categoryDto) {
        return ResponseEntity.ok(categoryService.createCategory(categoryDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> updateCategory(
            @PathVariable(name = "id") Integer id,
            @RequestBody CategoryDto categoryDto) {
        return ResponseEntity.ok(categoryService.updateCategory(id, categoryDto));
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<CategoryDto>> toggleStatus(@PathVariable(name = "id") Integer id) {
        return ResponseEntity.ok(categoryService.toggleCategoryStatus(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> deleteCategory(@PathVariable(name = "id") Integer id) {
        return ResponseEntity.ok(categoryService.deleteCategory(id));
    }
}
