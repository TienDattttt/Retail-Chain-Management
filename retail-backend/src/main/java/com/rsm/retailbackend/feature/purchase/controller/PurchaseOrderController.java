package com.rsm.retailbackend.feature.purchase.controller;

import com.rsm.retailbackend.feature.purchase.dto.PurchaseOrderRequest;
import com.rsm.retailbackend.feature.purchase.dto.PurchaseOrderResponse;
import com.rsm.retailbackend.feature.purchase.service.PurchaseOrderPrintService;
import com.rsm.retailbackend.feature.purchase.service.PurchaseOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
