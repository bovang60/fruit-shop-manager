package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "shop_documents")
public class ShopDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "document_id")
    private Integer documentId;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false, foreignKey = @ForeignKey(name = "FK_shop_documents_shop"))
    private Shop shop;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false)
    private DocumentType documentType;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "file_type", length = 10)
    private String fileType;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "created_by", foreignKey = @ForeignKey(name = "FK_shop_documents_user"))
    private User createdBy;

    public enum DocumentType {
        BUSINESS_LICENSE, FOOD_SAFETY, ID_CARD, OTHER
    }
}
