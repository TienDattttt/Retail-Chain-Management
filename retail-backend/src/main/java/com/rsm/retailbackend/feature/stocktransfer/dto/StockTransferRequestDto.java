package com.rsm.retailbackend.feature.stocktransfer.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StockTransferRequestDto {

    private Integer fromWarehouseId;   // Kho tổng
    private Integer toBranchId;        // Chi nhánh nhận
    private String description;
    private Integer createdBy;

    private List<StockTransferItemDto> items;
}
