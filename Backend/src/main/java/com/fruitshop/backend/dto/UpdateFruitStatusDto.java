package com.fruitshop.backend.dto;

import com.fruitshop.backend.model.Fruit;
import lombok.Data;

@Data
public class UpdateFruitStatusDto {
    private Fruit.FruitStatus status;
}
