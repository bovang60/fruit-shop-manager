package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ShopDto;
import com.fruitshop.backend.dto.ShopRejectDto;
import com.fruitshop.backend.model.Shop;
import com.fruitshop.backend.service.ShopService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shops")
@CrossOrigin("*")
public class ShopController {

    @Autowired
    private ShopService shopService;

    @GetMapping
    public ResponseEntity<Page<ShopDto>> getShops(
            @RequestParam(required = false) Shop.ShopStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(shopService.getShopsByStatus(status, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShopDto> getShop(@PathVariable Integer id) {
        return ResponseEntity.ok(shopService.getShopById(id));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ShopDto> approveShop(@PathVariable Integer id) {
        return ResponseEntity.ok(shopService.approveShop(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ShopDto> rejectShop(
            @PathVariable Integer id,
            @Valid @RequestBody ShopRejectDto rejectDto) {
        return ResponseEntity.ok(shopService.rejectShop(id, rejectDto));
    }
    
    @PutMapping("/{id}/suspend")
    public ResponseEntity<ShopDto> suspendShop(@PathVariable Integer id) {
        return ResponseEntity.ok(shopService.suspendShop(id));
    }
}
