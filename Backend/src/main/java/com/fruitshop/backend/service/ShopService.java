package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ShopDto;
import com.fruitshop.backend.dto.ShopRejectDto;
import com.fruitshop.backend.dto.UpdateSellerShopDto;
import com.fruitshop.backend.model.Shop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ShopService {
    ApiResponse<Page<ShopDto>> getShopsByStatus(Shop.ShopStatus status, Pageable pageable);
    ApiResponse<ShopDto> getShopById(Integer id);
    ApiResponse<ShopDto> approveShop(Integer id);
    ApiResponse<ShopDto> rejectShop(Integer id, ShopRejectDto rejectDto);
    ApiResponse<ShopDto> suspendShop(Integer id); // Toggle suspend/active
    ApiResponse<ShopDto> activateShop(Integer id); 
    ApiResponse<ShopDto> registerSeller(com.fruitshop.backend.dto.RegisterShopDto registerShopDto);
    ApiResponse<ShopDto> updateSellerShop(Integer id, UpdateSellerShopDto updateDto);
    boolean isShopNameExists(String shopName);
    ApiResponse<ShopDto> checkShopStatus(Integer ownerId);
    ApiResponse<Boolean> canRegister(Integer ownerId);
}
