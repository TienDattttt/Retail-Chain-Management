
package com.rsm.retailbackend.feature.voucher.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
public class VoucherDto {
    private Integer id;
    private String code;
    private Integer voucherCampaignId;
    private Instant startDate;
    private Instant endDate;
    private Boolean isUsed;
    private Instant usedDate;
    private Integer customerId;
    private Integer orderId;
    private BigDecimal discountValue;
}
