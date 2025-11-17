package com.rsm.retailbackend.feature.stocktransfer.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class StockTransferListDto {
    private Integer id;
    private String transferCode;
    private String fromWarehouseName;
    private String toBranchName;
    private Integer totalProducts;
    private Integer totalQuantity;
    private String description;
    private LocalDateTime transferDate;
    private String status;
    private LocalDateTime createdDate;
}