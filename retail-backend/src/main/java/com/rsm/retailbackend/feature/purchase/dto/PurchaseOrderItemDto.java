package com.rsm.retailbackend.feature.purchase.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PurchaseOrderItemDto {
    private Integer productId;
    private Integer quantity;
    private BigDecimal unitPrice;
    private LocalDate expiredDate;
}
