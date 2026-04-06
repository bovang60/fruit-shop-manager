package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.SliderDto;
import com.fruitshop.backend.model.Slider;
import com.fruitshop.backend.repository.SliderRepository;
import com.fruitshop.backend.service.FileStorageService;
import com.fruitshop.backend.service.SliderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SliderServiceImpl implements SliderService {

    private final SliderRepository sliderRepository;
    private final FileStorageService fileStorageService;

    @Override
    public ApiResponse<List<SliderDto>> getAllSliders() {
        try {
            List<Slider> sliders = sliderRepository.findAll();
            List<SliderDto> dtos = sliders.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return ApiResponse.success(dtos);
        } catch (Exception e) {
            log.error("Failed to fetch all sliders: {}", e.getMessage());
            return ApiResponse.error("Failed to fetch sliders: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<List<SliderDto>> getActiveSliders() {
        try {
            List<Slider> sliders = sliderRepository.findByStatusTrueOrderByCreatedAtDesc();
            List<SliderDto> dtos = sliders.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return ApiResponse.success(dtos);
        } catch (Exception e) {
            log.error("Failed to fetch active sliders: {}", e.getMessage());
            return ApiResponse.error("Failed to fetch active sliders: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<SliderDto> getSliderById(Integer sliderId) {
        try {
            Slider slider = sliderRepository.findById(sliderId)
                    .orElseThrow(() -> new RuntimeException("Slider not found with ID: " + sliderId));
            return ApiResponse.success(convertToDto(slider));
        } catch (Exception e) {
            log.error("Failed to fetch slider: {}", e.getMessage());
            return ApiResponse.error("Failed to fetch slider: " + e.getMessage());
        }
    }

    private static final int MAX_ACTIVE_SLIDERS = 5;

    @Override
    @Transactional
    public ApiResponse<SliderDto> createSlider(SliderDto sliderDto) {
        try {
            if (sliderDto.getTitle() == null || sliderDto.getTitle().trim().isEmpty()) {
                return ApiResponse.error("Slider title is required");
            }
            if (sliderDto.getImageUrl() == null || sliderDto.getImageUrl().trim().isEmpty()) {
                return ApiResponse.error("Slider image URL is required");
            }

            boolean requestedStatus = sliderDto.getStatus() != null ? sliderDto.getStatus() : true;
            String message = "Slider created successfully";

            // Nếu muốn thêm slider ACTIVE nhưng đã đủ 5 → tự động set INACTIVE và cảnh báo
            if (requestedStatus && sliderRepository.countByStatusTrue() >= MAX_ACTIVE_SLIDERS) {
                requestedStatus = false;
                message = "Tạo slider thành công nhưng được đặt thành ẨN: không thể hiển thị quá " + MAX_ACTIVE_SLIDERS + " slider cùng lúc";
                log.warn("Max active sliders reached ({}). New slider will be set to INACTIVE.", MAX_ACTIVE_SLIDERS);
            }

            Slider slider = new Slider();
            slider.setTitle(sliderDto.getTitle());
            slider.setImageUrl(sliderDto.getImageUrl());
            slider.setDescription(sliderDto.getDescription());
            slider.setStatus(requestedStatus);

            Slider savedSlider = sliderRepository.save(slider);
            return ApiResponse.success(message, convertToDto(savedSlider));
        } catch (Exception e) {
            log.error("Failed to create slider: {}", e.getMessage());
            return ApiResponse.error("Failed to create slider: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ApiResponse<SliderDto> updateSlider(Integer sliderId, SliderDto sliderDto) {
        try {
            Slider existingSlider = sliderRepository.findById(sliderId)
                    .orElseThrow(() -> new RuntimeException("Slider not found with ID: " + sliderId));

            if (sliderDto.getTitle() != null && !sliderDto.getTitle().trim().isEmpty()) {
                existingSlider.setTitle(sliderDto.getTitle());
            }
            if (sliderDto.getImageUrl() != null && !sliderDto.getImageUrl().trim().isEmpty()) {
                existingSlider.setImageUrl(sliderDto.getImageUrl());
            }
            if (sliderDto.getDescription() != null) {
                existingSlider.setDescription(sliderDto.getDescription());
            }
            if (sliderDto.getStatus() != null) {
                existingSlider.setStatus(sliderDto.getStatus());
            }

            Slider updatedSlider = sliderRepository.save(existingSlider);
            return ApiResponse.success("Slider updated successfully", convertToDto(updatedSlider));
        } catch (Exception e) {
            log.error("Failed to update slider: {}", e.getMessage());
            return ApiResponse.error("Failed to update slider: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ApiResponse<String> deleteSlider(Integer sliderId) {
        try {
            if (!sliderRepository.existsById(sliderId)) {
                return ApiResponse.error("Slider not found with ID: " + sliderId);
            }
            sliderRepository.deleteById(sliderId);
            return ApiResponse.success("Slider deleted successfully", null);
        } catch (Exception e) {
            log.error("Failed to delete slider: {}", e.getMessage());
            return ApiResponse.error("Failed to delete slider: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ApiResponse<String> toggleSliderStatus(Integer sliderId) {
        try {
            Slider slider = sliderRepository.findById(sliderId)
                    .orElseThrow(() -> new RuntimeException("Slider not found with ID: " + sliderId));

            boolean currentStatus = slider.getStatus();

            // Nếu đang muốn ACTIVE hóa slider mà đã đủ 5 active → từ chối
            if (!currentStatus && sliderRepository.countByStatusTrue() >= MAX_ACTIVE_SLIDERS) {
                return ApiResponse.error("Không thể hiển thị quá " + MAX_ACTIVE_SLIDERS + " slider cùng lúc");
            }

            slider.setStatus(!currentStatus);
            sliderRepository.save(slider);

            String statusMsg = slider.getStatus() ? "activated" : "deactivated";
            return ApiResponse.success("Slider " + statusMsg + " successfully", null);
        } catch (Exception e) {
            log.error("Failed to toggle slider status: {}", e.getMessage());
            return ApiResponse.error("Failed to toggle slider status: " + e.getMessage());
        }
    }

    // Helper Method
    private SliderDto convertToDto(Slider slider) {
        SliderDto dto = new SliderDto();
        dto.setSliderId(slider.getSliderId());
        dto.setTitle(slider.getTitle());
        dto.setImageUrl(slider.getImageUrl());
        dto.setDescription(slider.getDescription());
        dto.setStatus(slider.getStatus());
        return dto;
    }

    @Override
    @Transactional
    public ApiResponse<SliderDto> uploadSliderImage(Integer sliderId, MultipartFile imageFile) throws IOException {
        try {
            Slider slider = sliderRepository.findById(sliderId)
                    .orElseThrow(() -> new RuntimeException("Slider not found with ID: " + sliderId));

            // Delete old image if exists
            if (slider.getImageUrl() != null && !slider.getImageUrl().isEmpty()) {
                fileStorageService.deleteFile(slider.getImageUrl());
            }

            // Store new image under "sliders" subfolder, reusing sliderId as identifier
            String imageUrl = fileStorageService.storeFile(imageFile, "sliders", sliderId);

            slider.setImageUrl(imageUrl);
            Slider updatedSlider = sliderRepository.save(slider);

            log.info("Uploaded image for slider ID {}: {}", sliderId, imageUrl);
            return ApiResponse.success("Image uploaded successfully", convertToDto(updatedSlider));
        } catch (RuntimeException e) {
            log.error("Failed to upload slider image: {}", e.getMessage());
            return ApiResponse.error(e.getMessage());
        }
    }
}
