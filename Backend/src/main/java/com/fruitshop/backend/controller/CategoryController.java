package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.CategoryDto;
import com.fruitshop.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin("*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<Page<CategoryDto>> getCategories(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "false") Boolean sortByFruitCount,
            Pageable pageable) {
        return ResponseEntity.ok(categoryService.getCategories(search, sortByFruitCount, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategory(@PathVariable Integer id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto) {
        return ResponseEntity.ok(categoryService.createCategory(categoryDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable Integer id,
            @RequestBody CategoryDto categoryDto) {
        return ResponseEntity.ok(categoryService.updateCategory(id, categoryDto));
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<CategoryDto> toggleStatus(@PathVariable Integer id) {
        return ResponseEntity.ok(categoryService.toggleCategoryStatus(id));
    }
}
