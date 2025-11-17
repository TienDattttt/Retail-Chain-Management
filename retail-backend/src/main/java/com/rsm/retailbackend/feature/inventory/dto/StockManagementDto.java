package com.rsm.retailbackend.feature.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockManagementDto {
    private Integer productId;
    private String productCode;
    private String productName;
    private String categoryName;
    private String imageUrl;
    private BigDecimal retailPrice;
    private String unit;
    
    // Location info
    private Integer branchId;
    private String branchName;
    private Integer warehouseId;
    private String warehouseName;
    
    // Stock info
    private Integer onHand;
    private Integer reserved;
    private Integer available;
    private Integer minThreshold;
    private Instant lastUpdated;
    
    // Status
    private String stockStatus; // LOW_STOCK, OUT_OF_STOCK, NORMAL
}