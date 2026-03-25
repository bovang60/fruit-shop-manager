package com.fruitshop.backend.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {
    /**
     * Store uploaded file and return its URL
     * 
     * @param file      The file to store
     * @param subFolder Subfolder to store in (e.g., "avatars")
     * @param userId    User ID for filename generation
     * @return Full URL to the stored file
     * @throws IOException If file cannot be stored
     */
    String storeFile(MultipartFile file, String subFolder, Integer userId) throws IOException;

    /**
     * Delete file by URL
     * 
     * @param imageUrl Full URL of the file to delete
     */
    void deleteFile(String imageUrl);

    /**
     * Validate if file is a valid image
     * 
     * @param contentType Content type of the file
     * @return true if valid image type
     */
    boolean isValidImageType(String contentType);
}
