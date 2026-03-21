package com.fruitshop.backend.service;

import com.fruitshop.backend.model.Fruit;
import java.util.List;

public interface FruitService {
    Fruit createFruit(Fruit fruit, Integer shopId);
    Fruit updateFruit(Integer fruitId, Fruit fruitDetails);
    Fruit updateFruitStatus(Integer fruitId, Fruit.FruitStatus status);
    void deleteFruit(Integer fruitId);
    List<Fruit> getFruitsByShop(Integer shopId);
    Fruit getFruitById(Integer fruitId);
}
