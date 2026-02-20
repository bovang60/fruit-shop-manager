package com.fruitshop.backend.dto;

import com.fruitshop.backend.model.Category;
import lombok.Data;

@Data
public class CategoryDto {
    private Integer categoryId;
    private String categoryName;
    private String description;
    private Category.CategoryStatus status;
    private Long fruitCount;
}
