package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.ShopDto;
import com.fruitshop.backend.dto.ShopRejectDto;
import com.fruitshop.backend.model.Shop;
import com.fruitshop.backend.model.User;
import com.fruitshop.backend.model.Fruit;
import com.fruitshop.backend.model.ShopShippingConfig;
import com.fruitshop.backend.model.ShopShippingConfigId;
import com.fruitshop.backend.model.ShippingMethod;
import com.fruitshop.backend.repository.ShopRepository;
import com.fruitshop.backend.repository.UserRepository;
import com.fruitshop.backend.repository.FruitRepository;
import com.fruitshop.backend.repository.ShopShippingConfigRepository;
import com.fruitshop.backend.repository.ShippingMethodRepository;
import com.fruitshop.backend.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    private final FruitRepository fruitRepository;
    private final ShopShippingConfigRepository shopShippingConfigRepository;
    private final ShippingMethodRepository shippingMethodRepository;

    @Override
    public ApiResponse<Page<ShopDto>> getShopsByStatus(Shop.ShopStatus status, Pageable pageable) {
        Page<Shop> shops;
        if (status == null) {
            shops = shopRepository.findAll(pageable);
        } else {
            shops = shopRepository.findByStatus(status, pageable);
        }
        Page<ShopDto> shopDtos = shops.map(this::convertToDto);
        return ApiResponse.success("Lấy danh sách cửa hàng thành công", shopDtos);
    }

    @Override
    public ApiResponse<ShopDto> getShopById(Integer id) {
        Shop shop = shopRepository.findById(id).orElse(null);
        if (shop == null) {
            return ApiResponse.error("Không tìm thấy cửa hàng");
        }
        return ApiResponse.success("Lấy thông tin cửa hàng thành công", convertToDto(shop));
    }

    @Override
    @Transactional
    public ApiResponse<ShopDto> registerSeller(com.fruitshop.backend.dto.RegisterShopDto dto) {
        User owner = userRepository.findById(dto.getOwnerId()).orElse(null);
        if (owner == null) {
            return ApiResponse.error("Không tìm thấy thông tin chủ sở hữu");
        }

        Optional<Shop> existingShopOpt = shopRepository.findByOwner_UserId(dto.getOwnerId());
        if (existingShopOpt.isPresent()) {
            Shop existingShop = existingShopOpt.get();
            if (existingShop.getStatus() == Shop.ShopStatus.APPROVED) {
                return ApiResponse.error("Bạn đã mở shop thành công rồi");
            } else if (existingShop.getStatus() == Shop.ShopStatus.PENDING) {
                return ApiResponse.error("Đơn đăng ký của bạn đang chờ phê duyệt");
            } else if (existingShop.getStatus() == Shop.ShopStatus.SUSPENDED) {
                return ApiResponse.error("Shop của bạn đang bị đình chỉ");
            } else if (existingShop.getStatus() == Shop.ShopStatus.REJECTED) {
                // Nếu bị từ chối, xóa đơn cũ để cho phép đăng ký lại
                shopShippingConfigRepository.deleteByShop_ShopId(existingShop.getShopId());
                shopRepository.delete(existingShop);
            }
        }

        if (shopRepository.existsByShopName(dto.getShopName())) {
            return ApiResponse.error("Tên cửa hàng đã tồn tại, vui lòng chọn tên khác");
        }

        if (dto.getTaxCode() != null && !dto.getTaxCode().isEmpty() && shopRepository.existsByTaxCode(dto.getTaxCode())) {
            return ApiResponse.error("Mã số thuế đã được sử dụng, vui lòng kiểm tra lại");
        }

        Shop shop = new Shop();
        shop.setShopName(dto.getShopName());
        shop.setOwner(owner);
        shop.setDescription(dto.getDescription());
        shop.setAddress(dto.getAddress());
        shop.setTaxCode(dto.getTaxCode());
        shop.setShopType(dto.getShopType());
        shop.setBusinessName(dto.getBusinessName());
        shop.setBusinessAddress(dto.getBusinessAddress());
        shop.setPickupAddress(dto.getPickupAddress());
        shop.setStatus(Shop.ShopStatus.PENDING);
        shop.setRegDate(java.time.LocalDate.now());

        Shop savedShop = shopRepository.save(shop);

        if (dto.getShippingMethodIds() != null && !dto.getShippingMethodIds().isEmpty()) {
            for (Integer methodId : dto.getShippingMethodIds()) {
                ShippingMethod method = shippingMethodRepository.findById(methodId).orElse(null);
                if (method != null) {
                    ShopShippingConfig config = new ShopShippingConfig();
                    ShopShippingConfigId configId = new ShopShippingConfigId(savedShop.getShopId(), methodId);
                    config.setId(configId);
                    config.setShop(savedShop);
                    config.setShippingMethod(method);
                    config.setIsActive(true);
                    shopShippingConfigRepository.save(config);
                }
            }
        }

        return ApiResponse.success("Gửi đơn đăng ký mở cửa hàng thành công", convertToDto(savedShop));
    }

    @Override
    @Transactional
    public ApiResponse<ShopDto> approveShop(Integer id) {
        Shop shop = shopRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Đơn xin không còn tồn tại"));
        shop.setStatus(Shop.ShopStatus.APPROVED);
        shop.setRejectReason(null);
        Shop savedShop = shopRepository.save(shop);
        
        // Cập nhật role của chủ shop lên SELLER
        User owner = savedShop.getOwner();
        if (owner != null && owner.getRole() != User.Role.SELLER) {
            owner.setRole(User.Role.SELLER);
            userRepository.save(owner);
        }
        
        return ApiResponse.success("Đã duyệt đơn đăng ký cửa hàng thành công", convertToDto(savedShop));
    }

    @Override
    @Transactional
    public ApiResponse<ShopDto> rejectShop(Integer id, ShopRejectDto rejectDto) {
        Shop shop = shopRepository.findById(id).orElse(null);
        if (shop == null) {
            return ApiResponse.error("Không tìm thấy cửa hàng");
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
        return ApiResponse.success("Đã từ chối đơn đăng ký mở cửa hàng", convertToDto(savedShop));
    }

    @Override
    @Transactional
    public ApiResponse<ShopDto> suspendShop(Integer id) {
        Shop shop = shopRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Không tìm thấy cửa hàng"));
        shop.setStatus(Shop.ShopStatus.SUSPENDED);
        shop.setRejectReason("Cửa hàng bị đình chỉ hoạt động bởi quản trị viên");
        Shop savedShop = shopRepository.save(shop);
        
        // Hủy quyền SELLER của user khi bị đình chỉ
        User owner = savedShop.getOwner();
        if (owner != null && owner.getRole() == User.Role.SELLER) {
            owner.setRole(User.Role.CUSTOMER);
            userRepository.save(owner);
        }
        
        // Ẩn toàn bộ sản phẩm của Shop
        java.util.List<Fruit> fruits = fruitRepository.findByShopShopId(id);
        if (fruits != null && !fruits.isEmpty()) {
            for (Fruit fruit : fruits) {
                fruit.setStatus(Fruit.FruitStatus.HIDDEN);
            }
            fruitRepository.saveAll(fruits);
        }
        
        return ApiResponse.success("Đã đình chỉ cửa hàng thành công", convertToDto(savedShop));
    }

    @Override
    public boolean isShopNameExists(String shopName) {
        return shopRepository.existsByShopName(shopName);
    }

    @Override
    public ApiResponse<ShopDto> checkShopStatus(Integer ownerId) {
        return shopRepository.findByOwner_UserId(ownerId)
                .map(shop -> ApiResponse.success("Đã tìm thấy thông tin shop của người dùng", convertToDto(shop)))
                .orElse(ApiResponse.error("Người dùng chưa có shop hoặc đơn đăng ký"));
    }

    @Override
    public ApiResponse<Boolean> canRegister(Integer ownerId) {
        Optional<Shop> shopOpt = shopRepository.findByOwner_UserId(ownerId);
        if (shopOpt.isEmpty()) {
            return ApiResponse.success("Bạn có thể đăng ký mở shop", true);
        }
        
        Shop shop = shopOpt.get();
        if (shop.getStatus() == Shop.ShopStatus.REJECTED) {
            return ApiResponse.success("Đơn đăng ký trước đó bị từ chối, bạn có thể đăng ký lại", true);
        }
        
        String message;
        if (shop.getStatus() == Shop.ShopStatus.APPROVED) {
            message = "Bạn đã mở shop thành công rồi";
        } else if (shop.getStatus() == Shop.ShopStatus.PENDING) {
            message = "Đơn đăng ký của bạn đang chờ phê duyệt";
        } else {
            message = "Shop của bạn đang bị đình chỉ";
        }
        
        return ApiResponse.success(message, false);
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

        dto.setRegDate(shop.getRegDate());
        dto.setAddress(shop.getAddress());
        dto.setTaxCode(shop.getTaxCode());
        dto.setShopType(shop.getShopType());
        dto.setBusinessName(shop.getBusinessName());
        dto.setBusinessAddress(shop.getBusinessAddress());
        dto.setPickupAddress(shop.getPickupAddress());

        return dto;
    }
}
