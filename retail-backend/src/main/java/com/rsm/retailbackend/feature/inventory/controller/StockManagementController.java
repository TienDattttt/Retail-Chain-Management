package com.rsm.retailbackend.feature.inventory.controller;

import com.rsm.retailbackend.feature.inventory.dto.StockFilterDto;
import com.rsm.retailbackend.feature.inventory.dto.StockManagementDto;
import com.rsm.retailbackend.feature.inventory.service.StockManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stock-management")
@RequiredArgsConstructor
public class StockManagementController {

    private final StockManagementService stockManagementService;

    @GetMapping
    public ResponseEntity<Page<StockManagementDto>> getStockManagement(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer branchId,
            @RequestParam(required = false) Integer warehouseId,
            @RequestParam(defaultValue = "ALL") String stockStatus,
            @RequestParam(defaultValue = "productName") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {

        StockFilterDto filter = StockFilterDto.builder()
            .searchTerm(searchTerm)
            .categoryId(categoryId)
            .branchId(branchId)
            .warehouseId(warehouseId)
            .stockStatus(stockStatus)
            .sortBy(sortBy)
            .sortDirection(sortDirection)
            .page(page)
            .size(size)
            .build();

        Page<StockManagementDto> result = stockManagementService.getStockManagement(filter);
        return ResponseEntity.ok(result);
    }
}