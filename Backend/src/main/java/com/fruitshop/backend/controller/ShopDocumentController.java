package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ShopDocumentDto;
import com.fruitshop.backend.service.ShopDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/shop-documents")
@RequiredArgsConstructor
public class ShopDocumentController {

    private final ShopDocumentService shopDocumentService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<ShopDocumentDto>> uploadDocument(
            @RequestParam("shopId") Integer shopId,
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file) {
        
        return ResponseEntity.ok(shopDocumentService.uploadDocument(shopId, documentType, file));
    }
}
