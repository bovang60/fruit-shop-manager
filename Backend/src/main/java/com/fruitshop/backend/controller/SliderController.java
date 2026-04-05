package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.SliderDto;
import com.fruitshop.backend.service.FileStorageService;
import com.fruitshop.backend.service.SliderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/sliders")
@RequiredArgsConstructor
@Slf4j
public class SliderController {

    private final SliderService sliderService;
    private final FileStorageService fileStorageService;

    /**
     * Get all active sliders for homepage display
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SliderDto>>> getActiveSliders() {
        log.info("GET /api/sliders/active");
        return ResponseEntity.ok(sliderService.getActiveSliders());
    }

    /**
     * Get all sliders (Admin only)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<SliderDto>>> getAllSliders() {
        log.info("GET /api/sliders");
        return ResponseEntity.ok(sliderService.getAllSliders());
    }

    /**
     * Get slider by ID (Admin only)
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SliderDto>> getSliderById(@PathVariable Integer id) {
        log.info("GET /api/sliders/{}", id);
        return ResponseEntity.ok(sliderService.getSliderById(id));
    }

    /**
     * Create a new slider with image upload (Admin only)
     * Content-Type: multipart/form-data
     * Fields: title (required), description, status, image (file, required)
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<SliderDto>> createSlider(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "status", required = false, defaultValue = "true") Boolean status,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            log.info("POST /api/sliders - Title: {}", title);

            String imageUrl = null;
            if (imageFile != null && !imageFile.isEmpty()) {
                if (!fileStorageService.isValidImageType(imageFile.getContentType())) {
                    return ResponseEntity.badRequest()
                            .body(ApiResponse.error("Invalid file type. Only PNG, JPG, GIF are allowed."));
                }
                if (imageFile.getSize() > 5 * 1024 * 1024) {
                    return ResponseEntity.badRequest()
                            .body(ApiResponse.error("File size exceeds limit. Maximum 5MB allowed."));
                }
                imageUrl = fileStorageService.storeFile(imageFile, "sliders", 0);
            }

            SliderDto sliderDto = new SliderDto();
            sliderDto.setTitle(title);
            sliderDto.setDescription(description);
            sliderDto.setStatus(status);
            sliderDto.setImageUrl(imageUrl);

            return ResponseEntity.ok(sliderService.createSlider(sliderDto));
        } catch (IOException e) {
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Failed to upload image. Please try again later."));
        }
    }

    /**
     * Update an existing slider with optional image re-upload (Admin only)
     * Content-Type: multipart/form-data
     * Fields: title, description, status, image (optional new file)
     */
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<SliderDto>> updateSlider(
            @PathVariable Integer id,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "status", required = false) Boolean status,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            log.info("PUT /api/sliders/{}", id);

            SliderDto sliderDto = new SliderDto();
            sliderDto.setTitle(title);
            sliderDto.setDescription(description);
            sliderDto.setStatus(status);

            if (imageFile != null && !imageFile.isEmpty()) {
                if (!fileStorageService.isValidImageType(imageFile.getContentType())) {
                    return ResponseEntity.badRequest()
                            .body(ApiResponse.error("Invalid file type. Only PNG, JPG, GIF are allowed."));
                }
                if (imageFile.getSize() > 5 * 1024 * 1024) {
                    return ResponseEntity.badRequest()
                            .body(ApiResponse.error("File size exceeds limit. Maximum 5MB allowed."));
                }
                // uploadSliderImage handles deleting old file and saving new one
                return ResponseEntity.ok(sliderService.uploadSliderImage(id, imageFile));
            }

            return ResponseEntity.ok(sliderService.updateSlider(id, sliderDto));
        } catch (IOException e) {
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Failed to upload image. Please try again later."));
        }
    }

    /**
     * Delete a slider (Admin only)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteSlider(@PathVariable Integer id) {
        log.info("DELETE /api/sliders/{}", id);
        return ResponseEntity.ok(sliderService.deleteSlider(id));
    }

    /**
     * Toggle slider status (Active/Inactive) (Admin only)
     */
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<String>> toggleSliderStatus(@PathVariable Integer id) {
        log.info("PATCH /api/sliders/{}/toggle-status", id);
        return ResponseEntity.ok(sliderService.toggleSliderStatus(id));
    }
}
