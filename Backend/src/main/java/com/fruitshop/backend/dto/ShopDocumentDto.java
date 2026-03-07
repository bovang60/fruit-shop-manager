package com.fruitshop.backend.dto;

import com.fruitshop.backend.model.ShopDocument;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopDocumentDto {
    private Integer documentId;
    private Integer shopId;
    private ShopDocument.DocumentType documentType;
    private String filePath;
    private String fileType;
    private LocalDateTime createdAt;
}
