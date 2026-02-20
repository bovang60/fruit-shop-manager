package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.ShopDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ShopDocumentRepository extends JpaRepository<ShopDocument, Integer> {
    List<ShopDocument> findByShopShopId(Integer shopId);
}
