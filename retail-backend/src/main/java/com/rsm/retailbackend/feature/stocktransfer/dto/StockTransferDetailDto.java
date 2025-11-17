package com.rsm.retailbackend.feature.stocktransfer.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class StockTransferDetailDto {
    private Integer id;
    private String transferCode;
    private String fromWarehouseName;
    private String toBranchName;
    private String description;
    private LocalDateTime transferDate;
    private String status;
    private LocalDateTime createdDate;
    private List<StockTransferDetailItemDto> items;
}