package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ShippingMethodDto;
import com.fruitshop.backend.service.ShippingMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shipping-methods")
@RequiredArgsConstructor
public class ShippingMethodController {

    private final ShippingMethodService shippingMethodService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShippingMethodDto>>> getAllShippingMethods() {
        return ResponseEntity.ok(shippingMethodService.getAllShippingMethods());
    }
}
