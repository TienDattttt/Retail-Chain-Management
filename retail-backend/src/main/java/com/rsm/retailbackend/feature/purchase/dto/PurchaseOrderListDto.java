package com.rsm.retailbackend.feature.purchase.dto;

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
public class PurchaseOrderListDto {
    private Integer purchaseOrderId;
    private String code;
    private Instant purchaseDate;
    private Integer warehouseId;
    private String warehouseName;
    private Integer supplierId;
    private String supplierName;
    private BigDecimal totalPayment;
    private String description;
    private Integer statusId;
    private String statusName;
    private Instant createdDate;
    private Instant expectedDeliveryDate;
    private Instant deliveryDate;
}