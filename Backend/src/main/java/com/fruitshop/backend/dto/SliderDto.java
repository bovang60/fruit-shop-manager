package com.fruitshop.backend.dto;

import lombok.Data;

@Data
public class SliderDto {
    private Integer sliderId;
    private String title;
    private String imageUrl;
    private String description;
    private Boolean status;
}
