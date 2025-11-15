package com.rsm.retailbackend.feature.stocktransfer.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StockTransferItemDto {
    private Integer productId;
    private Integer quantity;
}
