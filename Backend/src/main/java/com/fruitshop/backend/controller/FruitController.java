package com.fruitshop.backend.controller;

import com.fruitshop.backend.model.Fruit;
import com.fruitshop.backend.service.FruitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/fruits")
@RequiredArgsConstructor
@CrossOrigin("*")
public class FruitController {

    private final FruitService fruitService;

    // Lấy danh sách sản phẩm của Shop mình
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<Fruit>> getMyFruits(@PathVariable Integer shopId) {
        return ResponseEntity.ok(fruitService.getFruitsByShop(shopId));
    }

    // Tạo mới sản phẩm
    @PostMapping("/{shopId}")
    public ResponseEntity<Fruit> addFruit(@PathVariable Integer shopId, @RequestBody Fruit fruit) {
        return ResponseEntity.ok(fruitService.createFruit(fruit, shopId));
    }

    // Cập nhật sản phẩm
    @PutMapping("/{fruitId}")
    public ResponseEntity<Fruit> updateFruit(@PathVariable Integer fruitId, @RequestBody Fruit fruit) {
        return ResponseEntity.ok(fruitService.updateFruit(fruitId, fruit));
    }

    // Xóa sản phẩm
    @DeleteMapping("/{fruitId}")
    public ResponseEntity<String> deleteFruit(@PathVariable Integer fruitId) {
        fruitService.deleteFruit(fruitId);
        return ResponseEntity.ok("Xóa sản phẩm thành công!");
    }
}