package com.fruitshop.backend.service;

import com.fruitshop.backend.model.Voucher;
import java.util.List;

public interface VoucherService {
    List<Voucher> getVouchersByShop(Integer shopId);
    Voucher createVoucher(Voucher voucher, Integer shopId);
    Voucher updateVoucher(Integer voucherId, Voucher voucherDetails);
    void deleteVoucher(Integer voucherId);
}