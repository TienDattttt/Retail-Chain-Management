package com.rsm.retailbackend.feature.purchase.controller;

import com.rsm.retailbackend.feature.purchase.dto.*;
import com.rsm.retailbackend.feature.purchase.service.PurchaseOrderPrintService;
import com.rsm.retailbackend.feature.purchase.service.PurchaseOrderService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/purchase-orders")
@PreAuthorize("hasAnyAuthority('1')")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseService;
    private final PurchaseOrderPrintService printService;

    public PurchaseOrderController(
            PurchaseOrderService purchaseService,
            PurchaseOrderPrintService printService
    ) {
        this.purchaseService = purchaseService;
        this.printService = printService;
    }

    @GetMapping
    public ResponseEntity<Page<PurchaseOrderListDto>> getPurchaseOrders(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Integer supplierId,
            @RequestParam(required = false) Integer warehouseId,
            @RequestParam(required = false) Integer statusId,
            @RequestParam(required = false) String purchaseDateFrom,
            @RequestParam(required = false) String purchaseDateTo,
            @RequestParam(defaultValue = "createdDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {

        PurchaseOrderFilterDto filter = PurchaseOrderFilterDto.builder()
            .searchTerm(searchTerm)
            .supplierId(supplierId)
            .warehouseId(warehouseId)
            .statusId(statusId)
            .purchaseDateFrom(purchaseDateFrom != null ? Instant.parse(purchaseDateFrom) : null)
            .purchaseDateTo(purchaseDateTo != null ? Instant.parse(purchaseDateTo) : null)
            .sortBy(sortBy)
            .sortDirection(sortDirection)
            .page(page)
            .size(size)
            .build();

        Page<PurchaseOrderListDto> result = purchaseService.getPurchaseOrders(filter);
        return ResponseEntity.ok(result);
    }
    @PostMapping("/process")
    public ResponseEntity<PurchaseOrderResponse> process(@RequestBody PurchaseOrderRequest request) {
        return ResponseEntity.ok(purchaseService.process(request));
    }

    @GetMapping("/{id}/print")
    public ResponseEntity<?> getPrintData(@PathVariable Integer id) {

        var data = printService.getPrintData(id);

        if (data == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(data);
    }

}
