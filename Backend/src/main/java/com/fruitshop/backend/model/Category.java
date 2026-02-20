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

    @Enumerated(EnumType.STRING)
    private CategoryStatus status = CategoryStatus.ACTIVE;

    @OneToMany(mappedBy = "category")
    private List<Fruit> fruits;

    public enum CategoryStatus {
        ACTIVE, INACTIVE
    }
}
