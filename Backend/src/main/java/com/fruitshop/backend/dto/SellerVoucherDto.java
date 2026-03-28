package com.fruitshop.backend.dto;

import com.fruitshop.backend.model.Voucher;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerVoucherDto {
    private Integer voucherId;
    private String code;
    private BigDecimal discountValue;
    private Voucher.DiscountType discountType;
    private BigDecimal minOrderValue;
    private LocalDateTime expiredDate;
    private String status;
}
