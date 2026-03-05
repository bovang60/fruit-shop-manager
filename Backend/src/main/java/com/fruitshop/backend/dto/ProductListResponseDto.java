package com.fruitshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductListResponseDto {
    private List<ProductDto> products;
    private PaginationDto pagination;
    private Map<String, Object> appliedFilters;
}
