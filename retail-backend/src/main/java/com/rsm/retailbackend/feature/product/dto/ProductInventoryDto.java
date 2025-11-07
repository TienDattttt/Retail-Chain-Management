package com.rsm.retailbackend.feature.product.dto;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductInventoryDto {
    private Integer branchId;
    private Integer warehouseId;
    private Integer onHand;
    private Integer reserved;
    private Integer available;
    private Instant lastUpdated;
}