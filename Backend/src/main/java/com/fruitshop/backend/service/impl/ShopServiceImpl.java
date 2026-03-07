package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ShopDto;
import com.fruitshop.backend.dto.ShopRejectDto;
import com.fruitshop.backend.model.Shop;
import com.fruitshop.backend.model.ShopDocument;
import com.fruitshop.backend.repository.ShopRepository;
import com.fruitshop.backend.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class ShopServiceImpl implements ShopService {

    @Autowired
    private ShopRepository shopRepository;

    @Override
    public ApiResponse<Page<ShopDto>> getShopsByStatus(Shop.ShopStatus status, Pageable pageable) {
        Page<Shop> shops;
        if (status == null) {
            shops = shopRepository.findAll(pageable);
        } else {
            shops = shopRepository.findByStatus(status, pageable);
        }
        Page<ShopDto> shopDtos = shops.map(this::convertToDto);
        return ApiResponse.success("Shops retrieved successfully", shopDtos);
    }

    @Override
    public ApiResponse<ShopDto> getShopById(Integer id) {
        Shop shop = shopRepository.findById(id).orElse(null);
        if (shop == null) {
            return ApiResponse.error("Shop not found");
        }
        return ApiResponse.success("Shop retrieved successfully", convertToDto(shop));
    }

    @Override
    @Transactional
    public ApiResponse<ShopDto> approveShop(Integer id) {
        Shop shop = shopRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Đơn xin không còn tồn tại"));
        shop.setStatus(Shop.ShopStatus.APPROVED);
        shop.setRejectReason(null);
        Shop savedShop = shopRepository.save(shop);
        return ApiResponse.success("Shop approved successfully", convertToDto(savedShop));
    }

    @Override
    @Transactional
    public ApiResponse<ShopDto> rejectShop(Integer id, ShopRejectDto rejectDto) {
        Shop shop = shopRepository.findById(id).orElse(null);
        if (shop == null) {
            return ApiResponse.error("Shop not found");
        }

        // Validate feedback
        if (rejectDto.getReason() == null) {
            throw new IllegalArgumentException("Phản hồi chi tiết là null");
        }
        if (rejectDto.getReason().length() > 255) {
            throw new IllegalArgumentException("Phản hồi chi tiết nhiều hơn 255 ký tự");
        }

        shop.setStatus(Shop.ShopStatus.REJECTED);
        shop.setRejectReason(rejectDto.getReason());
        Shop savedShop = shopRepository.save(shop);
        return ApiResponse.success("Shop rejected successfully", convertToDto(savedShop));
    }

    @Override
    @Transactional
    public ApiResponse<ShopDto> suspendShop(Integer id) {
        // Note: Shop.ShopStatus does not have SUSPENDED status (only PENDING, APPROVED,
        // REJECTED)
        // Implementing as changing to REJECTED for now
        Shop shop = shopRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Shop not found"));
        shop.setStatus(Shop.ShopStatus.REJECTED);
        shop.setRejectReason("Shop suspended by admin");
        Shop savedShop = shopRepository.save(shop);
        return ApiResponse.success("Shop suspended successfully", convertToDto(savedShop));
    }

    private ShopDto convertToDto(Shop shop) {
        ShopDto dto = new ShopDto();
        dto.setShopId(shop.getShopId());
        dto.setShopName(shop.getShopName());
        dto.setDescription(shop.getDescription());
        dto.setCreatedAt(shop.getCreatedAt());
        dto.setStatus(shop.getStatus());
        dto.setRejectReason(shop.getRejectReason());

        if (shop.getOwner() != null) {
            dto.setOwnerId(shop.getOwner().getUserId());
            dto.setOwnerName(shop.getOwner().getFullName());
            dto.setOwnerEmail(shop.getOwner().getEmail());
            dto.setOwnerPhone(shop.getOwner().getPhoneNumber());
            // In the new schema there is no address in users table directly anymore?
            // Wait, let's check users table again.
        }

        if (shop.getDocuments() != null) {
            dto.setDocumentUrls(shop.getDocuments().stream()
                    .map(ShopDocument::getFilePath)
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}
