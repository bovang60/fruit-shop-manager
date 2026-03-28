package com.fruitshop.backend.service.impl;

import com.fruitshop.backend.model.Shop;
import com.fruitshop.backend.model.Voucher;
import com.fruitshop.backend.repository.ShopRepository;
import com.fruitshop.backend.repository.VoucherRepository;
import com.fruitshop.backend.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;
    private final ShopRepository shopRepository;

    @Override
    public List<Voucher> getVouchersByShop(Integer shopId) {
        return voucherRepository.findByShop_ShopIdOrderByExpiredDateDesc(shopId);
    }

    @Override
    @Transactional
    public Voucher createVoucher(Voucher voucher, Integer shopId) {
        if (voucherRepository.existsByCodeAndShop_ShopId(voucher.getCode(), shopId)) {
            throw new RuntimeException("Mã giảm giá này đã tồn tại trong cửa hàng của bạn!");
        }

        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cửa hàng!"));

        voucher.setShop(shop);
        return voucherRepository.save(voucher);
    }

    @Override
    @Transactional
    public Voucher updateVoucher(Integer voucherId, Voucher details) {
        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại!"));

        voucher.setCode(details.getCode());
        voucher.setDiscountValue(details.getDiscountValue());
        voucher.setDiscountType(details.getDiscountType());
        voucher.setMinOrderValue(details.getMinOrderValue());
        voucher.setExpiredDate(details.getExpiredDate());
        voucher.setStatus(details.getStatus());

        return voucherRepository.save(voucher);
    }

    @Override
    @Transactional
    public void deleteVoucher(Integer voucherId) {
        if (!voucherRepository.existsById(voucherId)) {
            throw new RuntimeException("Mã giảm giá không tồn tại!");
        }
        voucherRepository.deleteById(voucherId);
    }
}
