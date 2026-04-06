package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.SellerProductDto;
import com.fruitshop.backend.dto.UpdateProductStatusDto;
import com.fruitshop.backend.model.Product;
import com.fruitshop.backend.service.FruitService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fruitshop.backend.service.FileStorageService;

@RestController
@RequestMapping({"/api/seller/fruits", "/api/fruits"})
@RequiredArgsConstructor
public class FruitController {

    private final FruitService fruitService;
    private final FileStorageService fileStorageService;

    // Lấy danh sách sản phẩm của Shop mình
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<ApiResponse<List<SellerProductDto>>> getMyFruits(@PathVariable Integer shopId) {
        try {
            List<Product> products = fruitService.getFruitsByShop(shopId);
            List<SellerProductDto> productDtos = products.stream()
                    .map(this::toDto)
                    .toList();
            return ResponseEntity.ok(ApiResponse.success("Tải danh sách sản phẩm thành công", productDtos));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    // Lấy chi tiết sản phẩm theo ID
    @GetMapping("/{fruitId}")
    public ResponseEntity<ApiResponse<SellerProductDto>> getFruitById(@PathVariable Integer fruitId) {
        try {
            Product product = fruitService.getFruitById(fruitId);
            return ResponseEntity.ok(ApiResponse.success("Tải thông tin sản phẩm thành công", toDto(product)));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    // Tạo mới sản phẩm
    @PostMapping("/{shopId}")
    public ResponseEntity<ApiResponse<SellerProductDto>> addFruit(
            @PathVariable Integer shopId,
            @RequestBody Product product) {
        try {
            Product createdProduct = fruitService.createFruit(product, shopId);
            return ResponseEntity.ok(ApiResponse.success("Tạo sản phẩm thành công!", toDto(createdProduct)));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    // Cập nhật sản phẩm
    @PutMapping("/{fruitId}")
    public ResponseEntity<ApiResponse<SellerProductDto>> updateFruit(
            @PathVariable Integer fruitId,
            @RequestBody Product product) {
        try {
            Product updatedProduct = fruitService.updateFruit(fruitId, product);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật sản phẩm thành công!", toDto(updatedProduct)));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    // Upload ảnh sản phẩm từ file
    @PostMapping("/{fruitId}/image")
    public ResponseEntity<ApiResponse<SellerProductDto>> uploadFruitImage(
            @PathVariable Integer fruitId,
            @RequestParam("image") MultipartFile imageFile) {
        try {
            if (imageFile.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("No image file provided."));
            }

            if (!fileStorageService.isValidImageType(imageFile.getContentType())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid file type. Only images (PNG, JPG, GIF) are allowed."));
            }

            if (imageFile.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("File size exceeds limit. Maximum 5MB allowed."));
            }

            Product updatedProduct = fruitService.uploadFruitImage(fruitId, imageFile);
            return ResponseEntity.ok(ApiResponse.success("Tải ảnh sản phẩm thành công!", toDto(updatedProduct)));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    // Cập nhật trạng thái sản phẩm
    @PatchMapping("/{fruitId}/status")
    public ResponseEntity<ApiResponse<SellerProductDto>> updateFruitStatus(
            @PathVariable Integer fruitId,
            @RequestBody UpdateProductStatusDto statusDto) {
        try {
            Product updatedProduct = fruitService.updateFruitStatus(fruitId, statusDto.getIsActive());
            return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái sản phẩm thành công!", toDto(updatedProduct)));
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

    private SellerProductDto toDto(Product product) {
        if (product == null) {
            return null;
        }
        Integer categoryId = product.getCategory() != null ? product.getCategory().getCategoryId() : null;
        return SellerProductDto.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .isActive(product.getIsActive())
                .imageUrl(product.getImageUrl())
                .categoryId(categoryId)
                .discount(product.getDiscount())
                .originalPrice(product.getOriginalPrice())
                .unit(product.getUnit())
                .origin(product.getOrigin())
                .isOrganic(product.getIsOrganic())
                .build();
    }
}
