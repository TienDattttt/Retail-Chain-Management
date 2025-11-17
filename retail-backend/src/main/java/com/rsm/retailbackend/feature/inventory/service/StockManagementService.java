package com.rsm.retailbackend.feature.inventory.service;

import com.rsm.retailbackend.feature.inventory.dto.StockFilterDto;
import com.rsm.retailbackend.feature.inventory.dto.StockManagementDto;
import org.springframework.data.domain.Page;

public interface StockManagementService {
    Page<StockManagementDto> getStockManagement(StockFilterDto filter);
}