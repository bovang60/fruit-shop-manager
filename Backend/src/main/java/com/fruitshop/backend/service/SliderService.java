package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.SliderDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface SliderService {
    ApiResponse<List<SliderDto>> getAllSliders();
    ApiResponse<List<SliderDto>> getActiveSliders();
    ApiResponse<SliderDto> getSliderById(Integer sliderId);
    ApiResponse<SliderDto> createSlider(SliderDto sliderDto);
    ApiResponse<SliderDto> updateSlider(Integer sliderId, SliderDto sliderDto);
    ApiResponse<String> deleteSlider(Integer sliderId);
    ApiResponse<String> toggleSliderStatus(Integer sliderId);
    ApiResponse<SliderDto> uploadSliderImage(Integer sliderId, MultipartFile imageFile) throws IOException;
}
