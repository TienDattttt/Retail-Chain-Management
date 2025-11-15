package com.rsm.retailbackend.feature.stocktransfer.dto;

import lombok.Getter;

@Getter
public class StockTransferResponseDto {

    private final Integer transferId;
    private final String transferCode;

    public StockTransferResponseDto(Integer transferId, String transferCode) {
        this.transferId = transferId;
        this.transferCode = transferCode;
    }
}
