package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ShippingMethodDto;
import com.fruitshop.backend.model.ShippingMethod;
import com.fruitshop.backend.repository.ShippingMethodRepository;
import com.fruitshop.backend.service.ShippingMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShippingMethodServiceImpl implements ShippingMethodService {

    @Autowired
    private ShippingMethodRepository shippingMethodRepository;

    @Override
    public ApiResponse<List<ShippingMethodDto>> getAllShippingMethods() {
        List<ShippingMethod> methods = shippingMethodRepository.findByIsAvailableTrue();
        // List<ShippingMethod> methods = shippingMethodRepository.findAll();
        List<ShippingMethodDto> dtos = methods.stream().map(this::convertToDto).collect(Collectors.toList());
        return ApiResponse.success("Lấy danh sách phương thức vận chuyển thành công", dtos);
    }

    private ShippingMethodDto convertToDto(ShippingMethod method) {
        ShippingMethodDto dto = new ShippingMethodDto();
        dto.setMethodId(method.getMethodId());
        dto.setMethodName(method.getMethodName());
        dto.setDescription(method.getDescription());
        dto.setFixedFee(method.getFixedFee());
        dto.setIsAvailable(method.getIsAvailable());
        return dto;
    }
}
