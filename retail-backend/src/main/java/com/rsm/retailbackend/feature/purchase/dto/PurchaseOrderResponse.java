package com.rsm.retailbackend.feature.purchase.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PurchaseOrderResponse {
    private Integer purchaseOrderId;
    private String purchaseOrderCode;
    private Integer batchId;
    private String lotCode;
}
