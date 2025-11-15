package com.rsm.retailbackend.feature.stocktransfer.controller;

import com.rsm.retailbackend.feature.stocktransfer.dto.StockTransferRequestDto;
import com.rsm.retailbackend.feature.stocktransfer.dto.StockTransferResponseDto;
import com.rsm.retailbackend.feature.stocktransfer.service.StockTransferService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stock-transfers")
@PreAuthorize("hasAnyAuthority('1')")
public class StockTransferController {

    private final StockTransferService service;

    public StockTransferController(StockTransferService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<StockTransferResponseDto> create(@RequestBody StockTransferRequestDto dto) {
        return ResponseEntity.ok(service.transfer(dto));
    }
}
