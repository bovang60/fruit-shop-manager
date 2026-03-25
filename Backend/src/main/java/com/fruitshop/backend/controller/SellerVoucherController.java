package com.fruitshop.backend.controller;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.SellerVoucherDto;
import com.fruitshop.backend.model.Voucher;
import com.fruitshop.backend.service.VoucherService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seller/vouchers")
@RequiredArgsConstructor
public class SellerVoucherController {

    private final VoucherService voucherService;

    // Use Case: View voucher list
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<ApiResponse<List<SellerVoucherDto>>> getVouchers(@PathVariable Integer shopId) {
        try {
            List<Voucher> vouchers = voucherService.getVouchersByShop(shopId);
            List<SellerVoucherDto> voucherDtos = vouchers.stream()
                    .map(this::toDto)
                    .toList();
            return ResponseEntity.ok(ApiResponse.success("Tải danh sách mã giảm giá thành công", voucherDtos));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    // Use Case: Create Voucher
    @PostMapping("/shop/{shopId}")
    public ResponseEntity<ApiResponse<SellerVoucherDto>> create(
            @PathVariable Integer shopId,
            @RequestBody Voucher voucher) {
        try {
            Voucher createdVoucher = voucherService.createVoucher(voucher, shopId);
            return ResponseEntity.ok(ApiResponse.success("Tạo mã giảm giá thành công!", toDto(createdVoucher)));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    // Use Case: Update Voucher
    @PutMapping("/{voucherId}")
    public ResponseEntity<ApiResponse<SellerVoucherDto>> update(
            @PathVariable Integer voucherId,
            @RequestBody Voucher voucher) {
        try {
            Voucher updatedVoucher = voucherService.updateVoucher(voucherId, voucher);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật mã giảm giá thành công!", toDto(updatedVoucher)));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    // Use Case: Delete Voucher
    @DeleteMapping("/{voucherId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer voucherId) {
        try {
            voucherService.deleteVoucher(voucherId);
            return ResponseEntity.ok(ApiResponse.success("Xóa mã giảm giá thành công!", null));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.error(ex.getMessage()));
        }
    }

    private SellerVoucherDto toDto(Voucher voucher) {
        if (voucher == null) {
            return null;
        }
        return SellerVoucherDto.builder()
                .voucherId(voucher.getVoucherId())
                .code(voucher.getCode())
                .discountValue(voucher.getDiscountValue())
                .discountType(voucher.getDiscountType())
                .minOrderValue(voucher.getMinOrderValue())
                .expiredDate(voucher.getExpiredDate())
                .status(voucher.getStatus())
                .build();
    }
}
