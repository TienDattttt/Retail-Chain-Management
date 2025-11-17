package com.rsm.retailbackend.feature.stocktransfer.controller;

import com.rsm.retailbackend.feature.stocktransfer.dto.StockTransferRequestDto;
import com.rsm.retailbackend.feature.stocktransfer.dto.StockTransferResponseDto;
import com.rsm.retailbackend.feature.stocktransfer.dto.StockTransferListDto;
import com.rsm.retailbackend.feature.stocktransfer.dto.StockTransferDetailDto;
import com.rsm.retailbackend.feature.stocktransfer.service.StockTransferService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @GetMapping
    public ResponseEntity<Page<StockTransferListDto>> getAll(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Integer fromWarehouseId,
            @RequestParam(required = false) Integer toBranchId,
            @RequestParam(required = false) String transferDateFrom,
            @RequestParam(required = false) String transferDateTo,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return ResponseEntity.ok(service.getAllTransfers(
                searchTerm, fromWarehouseId, toBranchId, 
                transferDateFrom, transferDateTo, status, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockTransferDetailDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getTransferDetail(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.deleteTransfer(id);
        return ResponseEntity.ok().build();
    }
}
