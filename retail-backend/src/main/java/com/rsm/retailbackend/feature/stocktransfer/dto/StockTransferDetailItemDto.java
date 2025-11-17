package com.rsm.retailbackend.feature.stocktransfer.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StockTransferDetailItemDto {
    private Integer productId;
    private String productName;
    private String productCode;
    private Integer quantity;
    private String unit;
}