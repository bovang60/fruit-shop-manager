package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sliders")
public class Slider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slider_id")
    private Integer sliderId;

    @Column(columnDefinition = "NVARCHAR(255)", nullable = false)
    private String title;

    @Column(name = "image_url", columnDefinition = "NVARCHAR(500)", nullable = false)
    private String imageUrl;

    @Column(columnDefinition = "NVARCHAR(500)")
    private String description;

    @Column(name = "status")
    private Boolean status = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
