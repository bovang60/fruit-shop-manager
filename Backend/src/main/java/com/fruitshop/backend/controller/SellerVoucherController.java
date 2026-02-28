package com.fruitshop.backend.controller;

import com.fruitshop.backend.model.Voucher;
import com.fruitshop.backend.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/seller/vouchers")
@RequiredArgsConstructor
@CrossOrigin("*")
public class SellerVoucherController {

    private final VoucherService voucherService;

    // Use Case: View voucher list
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<Voucher>> getVouchers(@PathVariable Integer shopId) {
        return ResponseEntity.ok(voucherService.getVouchersByShop(shopId));
    }

    // Use Case: Create Voucher
    @PostMapping("/shop/{shopId}")
    public ResponseEntity<Voucher> create(@PathVariable Integer shopId, @RequestBody Voucher voucher) {
        return ResponseEntity.ok(voucherService.createVoucher(voucher, shopId));
    }

    // Use Case: Update Voucher
    @PutMapping("/{voucherId}")
    public ResponseEntity<Voucher> update(@PathVariable Integer voucherId, @RequestBody Voucher voucher) {
        return ResponseEntity.ok(voucherService.updateVoucher(voucherId, voucher));
    }

    // Use Case: Delete Voucher
    @DeleteMapping("/{voucherId}")
    public ResponseEntity<String> delete(@PathVariable Integer voucherId) {
        voucherService.deleteVoucher(voucherId);
        return ResponseEntity.ok("Xóa voucher thành công!");
    }
}