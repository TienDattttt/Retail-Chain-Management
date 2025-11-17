package com.rsm.retailbackend.feature.purchase.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrderFilterDto {
    private String searchTerm;
    private Integer supplierId;
    private Integer warehouseId;
    private Integer statusId;
    private Instant purchaseDateFrom;
    private Instant purchaseDateTo;
    @Builder.Default
    private String sortBy = "createdDate";
    @Builder.Default
    private String sortDirection = "DESC";
    @Builder.Default
    private Integer page = 0;
    @Builder.Default
    private Integer size = 20;
}