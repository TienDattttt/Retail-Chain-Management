package com.rsm.retailbackend.feature.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockFilterDto {
    private String searchTerm;
    private Integer categoryId;
    private Integer branchId;
    private Integer warehouseId;
    private String stockStatus; // ALL, LOW_STOCK, OUT_OF_STOCK
    @Builder.Default
    private String sortBy = "productName";
    @Builder.Default
    private String sortDirection = "ASC";
    @Builder.Default
    private Integer page = 0;
    @Builder.Default
    private Integer size = 20;
}