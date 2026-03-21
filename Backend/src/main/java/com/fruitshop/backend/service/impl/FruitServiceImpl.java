package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.model.Fruit;
import com.fruitshop.backend.model.Shop;
import com.fruitshop.backend.repository.FruitRepository;
import com.fruitshop.backend.repository.ShopRepository;
import com.fruitshop.backend.service.FruitService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FruitServiceImpl implements FruitService {

    private final FruitRepository fruitRepository;
    private final ShopRepository shopRepository;

    @Override
    @Transactional
    public Fruit createFruit(Fruit fruit, Integer shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay cua hang!"));
        fruit.setShop(shop);
        return fruitRepository.save(fruit);
    }

    @Override
    @Transactional
    public Fruit updateFruit(Integer fruitId, Fruit fruitDetails) {
        Fruit existingFruit = fruitRepository.findById(fruitId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay san pham!"));

        existingFruit.setFruitName(fruitDetails.getFruitName());
        existingFruit.setPrice(fruitDetails.getPrice());
        existingFruit.setStockQuantity(fruitDetails.getStockQuantity());
        existingFruit.setCategory(fruitDetails.getCategory());
        existingFruit.setDescription(fruitDetails.getDescription());
        existingFruit.setImageUrl(fruitDetails.getImageUrl());
        existingFruit.setStatus(fruitDetails.getStatus());

        return fruitRepository.save(existingFruit);
    }

    @Override
    @Transactional
    public Fruit updateFruitStatus(Integer fruitId, Fruit.FruitStatus status) {
        Fruit existingFruit = fruitRepository.findById(fruitId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay san pham!"));
        existingFruit.setStatus(status);
        return fruitRepository.save(existingFruit);
    }

    @Override
    @Transactional
    public void deleteFruit(Integer fruitId) {
        if (!fruitRepository.existsById(fruitId)) {
            throw new RuntimeException("San pham khong ton tai!");
        }
        fruitRepository.deleteById(fruitId);
    }

    @Override
    public List<Fruit> getFruitsByShop(Integer shopId) {
        return fruitRepository.findByShop_ShopId(shopId);
    }

    @Override
    public Fruit getFruitById(Integer fruitId) {
        return fruitRepository.findById(fruitId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay san pham!"));
    }
}
