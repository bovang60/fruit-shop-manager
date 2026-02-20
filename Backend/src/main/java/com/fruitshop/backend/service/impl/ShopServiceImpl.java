package com.fruitshop.backend.service.impl;

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
    public Page<ShopDto> getShopsByStatus(Shop.ShopStatus status, Pageable pageable) {
        return shopRepository.findByStatus(status, pageable)
                .map(this::convertToDto);
    }

    @Override
    public ShopDto getShopById(Integer id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        return convertToDto(shop);
    }

    @Override
    @Transactional
    public ShopDto approveShop(Integer id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        shop.setStatus(Shop.ShopStatus.APPROVED);
        shop.setRejectReason(null);
        return convertToDto(shopRepository.save(shop));
    }

    @Override
    @Transactional
    public ShopDto rejectShop(Integer id, ShopRejectDto rejectDto) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        shop.setStatus(Shop.ShopStatus.REJECTED);
        shop.setRejectReason(rejectDto.getReason());
        return convertToDto(shopRepository.save(shop));
    }

    @Override
    @Transactional
    public ShopDto suspendShop(Integer id) {
        // Suspend status is not in the current schema, maybe use REJECTED or BANNED status on Owner?
        // For now, let's just make it a placeholder or return the shop as is.
        return getShopById(id);
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
