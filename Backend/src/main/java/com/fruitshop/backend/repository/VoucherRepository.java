package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    // Xem danh sách voucher của một Shop cụ thể
    List<Voucher> findByShop_ShopIdOrderByExpiredDateDesc(Integer shopId);

    // Kiểm tra mã code đã tồn tại trong Shop chưa
    boolean existsByCodeAndShop_ShopId(String code, Integer shopId);
}