package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Slf4j
@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Override
    public String storeFile(MultipartFile file, String subFolder, Integer userId) throws IOException {
        // Create directory if not exists
        Path uploadPath = Paths.get(uploadDir, subFolder);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = "user-" + userId + "-" + System.currentTimeMillis() + extension;

        // Save file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        log.info("Stored file: {} at path: {}", filename, filePath);

        // Return full URL
        return baseUrl + "/uploads/" + subFolder + "/" + filename;
    }

    @Override
    public void deleteFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return;
        }

        try {
            // Extract path from URL
            String urlPath = imageUrl.replace(baseUrl, "");
            if (urlPath.startsWith("/")) {
                urlPath = urlPath.substring(1);
            }

            Path filePath = Paths.get(uploadDir).resolve(urlPath.replace("/uploads/", ""));
            Files.deleteIfExists(filePath);
            log.info("Deleted file: {}", filePath);
        } catch (Exception e) {
            log.error("Failed to delete file: " + imageUrl, e);
        }
    }

    @Override
    public boolean isValidImageType(String contentType) {
        return contentType != null && (contentType.equals("image/png") ||
                contentType.equals("image/jpeg") ||
                contentType.equals("image/jpg") ||
                contentType.equals("image/gif"));
    }
}
