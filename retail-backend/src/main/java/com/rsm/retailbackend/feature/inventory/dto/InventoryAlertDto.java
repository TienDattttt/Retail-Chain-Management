package com.rsm.retailbackend.feature.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.Instant;

@Data
@AllArgsConstructor
public class InventoryAlertDto {
    private Integer alertId;
    private Integer productId;
    private String productName;
    private Integer branchId;
    private Integer warehouseId;
    private String alertType;      // LOW_STOCK / NEAR_EXPIRY / EXPIRED
    private String message;
    private Integer quantity;
    private LocalDate expiredDate;
    private Instant createdDate;
}
