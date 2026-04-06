package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.model.Product;
import com.fruitshop.backend.model.Shop;
import com.fruitshop.backend.repository.ProductRepository;
import com.fruitshop.backend.repository.ShopRepository;
import com.fruitshop.backend.service.FileStorageService;
import com.fruitshop.backend.service.FruitService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FruitServiceImpl implements FruitService {

    private final ProductRepository productRepository;
    private final ShopRepository shopRepository;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public Product createFruit(Product product, Integer shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cửa hàng!"));
        product.setShop(shop);
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateFruit(Integer productId, Product productDetails) {
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm!"));

        existingProduct.setName(productDetails.getName());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setStock(productDetails.getStock());
        existingProduct.setCategory(productDetails.getCategory());
        existingProduct.setDescription(productDetails.getDescription());
        existingProduct.setImageUrl(productDetails.getImageUrl());
        existingProduct.setIsActive(productDetails.getIsActive());
        existingProduct.setDiscount(productDetails.getDiscount());
        existingProduct.setOriginalPrice(productDetails.getOriginalPrice());
        existingProduct.setUnit(productDetails.getUnit());
        existingProduct.setOrigin(productDetails.getOrigin());
        existingProduct.setIsOrganic(productDetails.getIsOrganic());

        return productRepository.save(existingProduct);
    }

    @Override
    @Transactional
    public Product uploadFruitImage(Integer productId, MultipartFile imageFile) {
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm!"));

        try {
            String oldImageUrl = existingProduct.getImageUrl();
            String imageUrl = fileStorageService.storeFile(imageFile, "products", productId);
            existingProduct.setImageUrl(imageUrl);
            Product savedProduct = productRepository.save(existingProduct);

            if (oldImageUrl != null && !oldImageUrl.isBlank()) {
                fileStorageService.deleteFile(oldImageUrl);
            }

            return savedProduct;
        } catch (IOException ex) {
            throw new RuntimeException("Tải ảnh sản phẩm thất bại!");
        }
    }

    @Override
    @Transactional
    public Product updateFruitStatus(Integer productId, Boolean isActive) {
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm!"));
        existingProduct.setIsActive(isActive);
        return productRepository.save(existingProduct);
    }

    @Override
    @Transactional
    public void deleteFruit(Integer fruitId) {
        if (!productRepository.existsById(fruitId)) {
            throw new RuntimeException("Sản phẩm không tồn tại!");
        }
        productRepository.deleteById(fruitId);
    }

    @Override
    public List<Product> getFruitsByShop(Integer shopId) {
        return productRepository.findByShop_ShopId(shopId);
    }

    @Override
    public Product getFruitById(Integer productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm!"));
    }
}
