package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.ShopDto;
import com.fruitshop.backend.dto.ShopRejectDto;
import com.fruitshop.backend.model.Shop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ShopService {
    Page<ShopDto> getShopsByStatus(Shop.ShopStatus status, Pageable pageable);
    ShopDto getShopById(Integer id);
    ShopDto approveShop(Integer id);
    ShopDto rejectShop(Integer id, ShopRejectDto rejectDto);
    ShopDto suspendShop(Integer id); // Toggle suspend/active
}
