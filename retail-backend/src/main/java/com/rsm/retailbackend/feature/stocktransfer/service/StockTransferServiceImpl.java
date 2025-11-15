package com.rsm.retailbackend.feature.stocktransfer.service;

import com.rsm.retailbackend.feature.stocktransfer.dto.StockTransferItemDto;
import com.rsm.retailbackend.feature.stocktransfer.dto.StockTransferRequestDto;
import com.rsm.retailbackend.feature.stocktransfer.dto.StockTransferResponseDto;
import com.rsm.retailbackend.feature.stocktransfer.repository.StockTransferRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class StockTransferServiceImpl implements StockTransferService {

    private final StockTransferRepository repo;

    public StockTransferServiceImpl(StockTransferRepository repo) {
        this.repo = repo;
    }

    @Override
    public StockTransferResponseDto transfer(StockTransferRequestDto dto) {

        var header = repo.createTransfer(
                dto.getFromWarehouseId(),
                dto.getToBranchId(),
                dto.getDescription(),
                dto.getCreatedBy()
        );

        Integer transferId = (Integer) header.get("transferId");

        for (StockTransferItemDto item : dto.getItems()) {
            repo.addDetail(
                    transferId,
                    item.getProductId(),
                    item.getQuantity(),
                    dto.getFromWarehouseId(),
                    dto.getToBranchId()
            );
        }

        return new StockTransferResponseDto(
                transferId,
                (String) header.get("transferCode")
        );
    }
}
