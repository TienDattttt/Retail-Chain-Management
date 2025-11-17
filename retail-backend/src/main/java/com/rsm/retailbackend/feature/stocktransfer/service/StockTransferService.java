package com.rsm.retailbackend.feature.stocktransfer.service;

import com.rsm.retailbackend.feature.stocktransfer.dto.StockTransferRequestDto;
import com.rsm.retailbackend.feature.stocktransfer.dto.StockTransferResponseDto;
import com.rsm.retailbackend.feature.stocktransfer.dto.StockTransferListDto;
import com.rsm.retailbackend.feature.stocktransfer.dto.StockTransferDetailDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StockTransferService {
    StockTransferResponseDto transfer(StockTransferRequestDto dto);
    Page<StockTransferListDto> getAllTransfers(String searchTerm, Integer fromWarehouseId, 
                                             Integer toBranchId, String transferDateFrom, 
                                             String transferDateTo, String status, Pageable pageable);
    StockTransferDetailDto getTransferDetail(Integer id);
    void deleteTransfer(Integer id);
}
