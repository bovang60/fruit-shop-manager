package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.WishlistResponseDto;
import com.fruitshop.backend.model.Product;
import com.fruitshop.backend.model.User;
import com.fruitshop.backend.model.Wishlist;
import com.fruitshop.backend.repository.ProductRepository;
import com.fruitshop.backend.repository.UserRepository;
import com.fruitshop.backend.repository.WishlistRepository;
import com.fruitshop.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ApiResponse<String> addToWishlist(Integer userId, Integer productId) {
        try {
            if (wishlistRepository.existsByUser_UserIdAndProduct_ProductId(userId, productId)) {
                return ApiResponse.success("Already in wishlist", null);
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            Wishlist wishlist = new Wishlist();
            wishlist.setUser(user);
            wishlist.setProduct(product);
            
            wishlistRepository.save(wishlist);

            return ApiResponse.success("Added to wishlist successfully", null);
        } catch (Exception e) {
            return ApiResponse.error("Failed to add: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ApiResponse<String> removeFromWishlist(Integer userId, Integer productId) {
        try {
            wishlistRepository.deleteByUserIdAndProductId(userId, productId);
            return ApiResponse.success("Removed from wishlist", null);
        } catch (Exception e) {
            return ApiResponse.error("Failed to remove: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<List<WishlistResponseDto>> getWishlist(Integer userId) {
        try {
            List<Wishlist> items = wishlistRepository.findAllWithProductsByUserId(userId);
            List<WishlistResponseDto> dtos = items.stream().map(item -> {
                Product p = item.getProduct();
                return WishlistResponseDto.builder()
                        .wishlistId(item.getWishlistId())
                        .productId(p.getProductId())
                        .productName(p.getName())
                        .price(p.getPrice())
                        .imageUrl(p.getImageUrl())
                        .category(p.getCategory() != null ? p.getCategory().getCategoryName() : null)
                        .shopId(p.getShop() != null ? p.getShop().getShopId() : null)
                        .shopName(p.getShop() != null ? p.getShop().getShopName() : null)
                        .addedAt(item.getCreatedAt())
                        .build();
            }).collect(Collectors.toList());
            
            return ApiResponse.success("Success", dtos);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
