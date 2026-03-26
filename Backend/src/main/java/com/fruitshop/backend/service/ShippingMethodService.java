package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ShippingMethodDto;
import java.util.List;

public interface ShippingMethodService {
    ApiResponse<List<ShippingMethodDto>> getAllShippingMethods();
}
