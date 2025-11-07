// feature/voucher/dto/VoucherCampaignDto.java
package com.rsm.retailbackend.feature.voucher.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
public class VoucherCampaignDto {
    private Integer id;
    private String code;
    private String name;
    private String description;
    private Instant startDate;
    private Instant endDate;
    private Boolean isActive;
    private Integer branchId;
    private Short discountType;      // 1 = fixed, 2 = percent
    private BigDecimal discountValue;
    private BigDecimal minOrderValue;
    private BigDecimal maxDiscountValue;
    private Integer quantity;
    private Integer usedQuantity;
    private Integer remainingQuantity;
    private Boolean isAutoGenerate;
    private Boolean isUnlimited;
}
