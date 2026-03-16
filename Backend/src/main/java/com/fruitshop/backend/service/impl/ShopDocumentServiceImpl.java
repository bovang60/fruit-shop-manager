package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ShopDocumentDto;
import com.fruitshop.backend.model.Shop;
import com.fruitshop.backend.model.ShopDocument;
import com.fruitshop.backend.repository.ShopDocumentRepository;
import com.fruitshop.backend.repository.ShopRepository;
import com.fruitshop.backend.service.ShopDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShopDocumentServiceImpl implements ShopDocumentService {

    private final ShopDocumentRepository shopDocumentRepository;
    private final ShopRepository shopRepository;

    private static final String UPLOAD_DIR = "uploads/business-documents/";
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "pdf");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    @Override
    @Transactional
    public ApiResponse<ShopDocumentDto> uploadDocument(Integer shopId, String documentType, MultipartFile file) {
        // 1. Validation
        if (file.isEmpty()) {
            return ApiResponse.error("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            return ApiResponse.error("File size exceeds 5MB limit");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            return ApiResponse.error("Invalid file name");
        }

        String extension = getFileExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            return ApiResponse.error("Only JPG, JPEG, PNG, and PDF files are allowed");
        }

        // 2. Check Shop
        Shop shop = shopRepository.findById(shopId)
                .orElse(null);
        if (shop == null) {
            return ApiResponse.error("Shop not found");
        }

        try {
            // 3. Save File
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String newFilename = UUID.randomUUID().toString() + "." + extension;
            Path targetLocation = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // 4. Save to Database
            ShopDocument doc = new ShopDocument();
            doc.setShop(shop);
            doc.setFilePath(targetLocation.toString().replace("\\", "/"));
            doc.setFileType(extension);
            
            // Map string to enum
            try {
                doc.setDocumentType(ShopDocument.DocumentType.valueOf(documentType.toUpperCase()));
            } catch (IllegalArgumentException e) {
                return ApiResponse.error("Invalid document type: " + documentType + ". Allowed: BUSINESS_LICENSE, FOOD_SAFETY, ID_CARD, OTHER");
            }
            
            doc.setCreatedAt(LocalDateTime.now());
            
            ShopDocument savedDoc = shopDocumentRepository.save(doc);

            // 5. Return Response
            return ApiResponse.success("Document uploaded successfully", convertToDto(savedDoc));

        } catch (IOException e) {
            return ApiResponse.error("Could not save file: " + e.getMessage());
        }
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex + 1);
    }

    private ShopDocumentDto convertToDto(ShopDocument doc) {
        return ShopDocumentDto.builder()
                .documentId(doc.getDocumentId())
                .shopId(doc.getShop().getShopId())
                .documentType(doc.getDocumentType())
                .filePath(doc.getFilePath())
                .fileType(doc.getFileType())
                .createdAt(doc.getCreatedAt())
                .build();
    }
}
