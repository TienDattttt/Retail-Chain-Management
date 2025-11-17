package com.rsm.retailbackend.feature.product.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductUnitDto {
    private Integer id;
    private Integer productId;
    private String unitName;
    private BigDecimal conversionRate;
    private Boolean isBaseUnit;
    private Instant createdDate;
}