package com.fruitshop.backend.service;

import com.fruitshop.backend.model.Product;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface FruitService {
    Product createFruit(Product product, Integer shopId);
    Product updateFruit(Integer productId, Product productDetails);
    Product uploadFruitImage(Integer productId, MultipartFile imageFile);
    Product updateFruitStatus(Integer productId, Boolean isActive);
    void deleteFruit(Integer fruitId);
    List<Product> getFruitsByShop(Integer shopId);
    Product getFruitById(Integer productId);
}
