package com.rsm.retailbackend.feature.stocktransfer.service;

import com.rsm.retailbackend.feature.stocktransfer.dto.StockTransferRequestDto;
import com.rsm.retailbackend.feature.stocktransfer.dto.StockTransferResponseDto;

public interface StockTransferService {
    StockTransferResponseDto transfer(StockTransferRequestDto dto);
}
