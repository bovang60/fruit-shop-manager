package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ShopDocumentDto;
import org.springframework.web.multipart.MultipartFile;

public interface ShopDocumentService {
    ApiResponse<ShopDocumentDto> uploadDocument(Integer shopId, String documentType, MultipartFile file);
}
