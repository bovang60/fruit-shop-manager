package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "category_name", nullable = false)
    private String categoryName;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "status")
    @Convert(converter = CategoryStatus.CategoryStatusConverter.class)
    private CategoryStatus status = CategoryStatus.ACTIVE;

    @OneToMany(mappedBy = "category")
    private List<Fruit> fruits;

    @Column(name = "created_at", updatable = false)
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

    public enum CategoryStatus {
        ACTIVE, INACTIVE;

        @Converter(autoApply = true)
        public static class CategoryStatusConverter implements AttributeConverter<CategoryStatus, String> {
            @Override
            public String convertToDatabaseColumn(CategoryStatus status) {
                return status == null ? null : status.name().toLowerCase();
            }

            @Override
            public CategoryStatus convertToEntityAttribute(String value) {
                if (value == null)
                    return null;
                return CategoryStatus.valueOf(value.toUpperCase());
            }
        }
    }
}
