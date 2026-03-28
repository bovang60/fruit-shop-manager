package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ShopDto;
import com.fruitshop.backend.dto.ShopRejectDto;
import com.fruitshop.backend.model.Shop;
import com.fruitshop.backend.service.ShopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ShopDto>>> getShops(
            @RequestParam(name = "status", required = false) Shop.ShopStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(shopService.getShopsByStatus(status, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShopDto>> getShop(@PathVariable(name = "id") Integer id) {
        return ResponseEntity.ok(shopService.getShopById(id));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<ShopDto>> approveShop(@PathVariable(name = "id") Integer id) {
        return ResponseEntity.ok(shopService.approveShop(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<ShopDto>> rejectShop(
            @PathVariable(name = "id") Integer id,
            @Valid @RequestBody ShopRejectDto rejectDto) {
        return ResponseEntity.ok(shopService.rejectShop(id, rejectDto));
    }
    
    @PutMapping("/{id}/suspend")
    public ResponseEntity<ApiResponse<ShopDto>> suspendShop(@PathVariable(name = "id") Integer id) {
        return ResponseEntity.ok(shopService.suspendShop(id));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<ShopDto>> activateShop(@PathVariable(name = "id") Integer id) {
        return ResponseEntity.ok(shopService.activateShop(id));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<ShopDto>> registerSeller(@Valid @RequestBody com.fruitshop.backend.dto.RegisterShopDto registerShopDto) {
        return ResponseEntity.ok(shopService.registerSeller(registerShopDto));
    }

    @GetMapping("/check-name")
    public ResponseEntity<ApiResponse<Boolean>> checkShopName(@RequestParam(name = "name") String name) {
        boolean exists = shopService.isShopNameExists(name);
        String message = exists ? "Tên cửa hàng đã tồn tại" : "Tên cửa hàng có thể sử dụng";
        return ResponseEntity.ok(ApiResponse.success(message, exists));
    }
    @GetMapping("/check-status/{ownerId}")
    public ResponseEntity<ApiResponse<ShopDto>> checkShopStatus(@PathVariable Integer ownerId) {
        return ResponseEntity.ok(shopService.checkShopStatus(ownerId));
    }

    @GetMapping("/can-register/{ownerId}")
    public ResponseEntity<ApiResponse<Boolean>> canRegister(@PathVariable Integer ownerId) {
        return ResponseEntity.ok(shopService.canRegister(ownerId));
    }
}
