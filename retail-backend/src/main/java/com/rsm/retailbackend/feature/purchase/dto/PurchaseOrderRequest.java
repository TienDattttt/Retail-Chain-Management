package com.rsm.retailbackend.feature.purchase.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PurchaseOrderRequest {

    private Integer supplierId;
    private LocalDateTime expectedDeliveryDate;
    private LocalDateTime deliveryDate;
    private String description;

    private BigDecimal total;
    private BigDecimal totalPayment;
    private BigDecimal discount;
    private BigDecimal discountRatio;

    private Integer createdBy;

    private List<PurchaseOrderItemDto> items;
}
