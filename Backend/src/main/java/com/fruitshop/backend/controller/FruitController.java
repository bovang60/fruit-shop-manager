package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.SellerFruitDto;
import com.fruitshop.backend.dto.UpdateFruitStatusDto;
import com.fruitshop.backend.model.Fruit;
import com.fruitshop.backend.service.FruitService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/seller/fruits", "/api/fruits"})
@RequiredArgsConstructor
public class FruitController {

    private final FruitService fruitService;

    // Lấy danh sách sản phẩm của Shop mình
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<ApiResponse<List<SellerFruitDto>>> getMyFruits(@PathVariable Integer shopId) {
        try {
            List<Fruit> fruits = fruitService.getFruitsByShop(shopId);
            List<SellerFruitDto> fruitDtos = fruits.stream()
                    .map(this::toDto)
                    .toList();
            return ResponseEntity.ok(ApiResponse.success("Tải danh sách sản phẩm thành công", fruitDtos));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    // Lấy chi tiết sản phẩm theo ID
    @GetMapping("/{fruitId}")
    public ResponseEntity<ApiResponse<SellerFruitDto>> getFruitById(@PathVariable Integer fruitId) {
        try {
            Fruit fruit = fruitService.getFruitById(fruitId);
            return ResponseEntity.ok(ApiResponse.success("Tải thông tin sản phẩm thành công", toDto(fruit)));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    // Tạo mới sản phẩm
    @PostMapping("/{shopId}")
    public ResponseEntity<ApiResponse<SellerFruitDto>> addFruit(
            @PathVariable Integer shopId,
            @RequestBody Fruit fruit) {
        try {
            Fruit createdFruit = fruitService.createFruit(fruit, shopId);
            return ResponseEntity.ok(ApiResponse.success("Tạo sản phẩm thành công!", toDto(createdFruit)));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    // Cập nhật sản phẩm
    @PutMapping("/{fruitId}")
    public ResponseEntity<ApiResponse<SellerFruitDto>> updateFruit(
            @PathVariable Integer fruitId,
            @RequestBody Fruit fruit) {
        try {
            Fruit updatedFruit = fruitService.updateFruit(fruitId, fruit);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật sản phẩm thành công!", toDto(updatedFruit)));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    // Cập nhật trạng thái sản phẩm
    @PatchMapping("/{fruitId}/status")
    public ResponseEntity<ApiResponse<SellerFruitDto>> updateFruitStatus(
            @PathVariable Integer fruitId,
            @RequestBody UpdateFruitStatusDto statusDto) {
        try {
            Fruit updatedFruit = fruitService.updateFruitStatus(fruitId, statusDto.getStatus());
            return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái sản phẩm thành công!", toDto(updatedFruit)));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    // Xóa sản phẩm
    @DeleteMapping("/{fruitId}")
    public ResponseEntity<ApiResponse<Void>> deleteFruit(@PathVariable Integer fruitId) {
        try {
            fruitService.deleteFruit(fruitId);
            return ResponseEntity.ok(ApiResponse.success("Xóa sản phẩm thành công!", null));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    private SellerFruitDto toDto(Fruit fruit) {
        if (fruit == null) {
            return null;
        }
        Integer categoryId = fruit.getCategory() != null ? fruit.getCategory().getCategoryId() : null;
        return SellerFruitDto.builder()
                .fruitId(fruit.getFruitId())
                .fruitName(fruit.getFruitName())
                .description(fruit.getDescription())
                .price(fruit.getPrice())
                .stockQuantity(fruit.getStockQuantity())
                .status(fruit.getStatus())
                .imageUrl(fruit.getImageUrl())
                .categoryId(categoryId)
                .build();
    }
}
