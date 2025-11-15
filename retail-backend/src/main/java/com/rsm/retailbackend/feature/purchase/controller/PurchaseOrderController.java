package com.rsm.retailbackend.feature.purchase.controller;

import com.rsm.retailbackend.feature.purchase.dto.PurchaseOrderRequest;
import com.rsm.retailbackend.feature.purchase.dto.PurchaseOrderResponse;
import com.rsm.retailbackend.feature.purchase.service.PurchaseOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/purchase-orders")
@PreAuthorize("hasAnyAuthority('1')")
public class PurchaseOrderController {

    private final PurchaseOrderService service;

    public PurchaseOrderController(PurchaseOrderService service) {
        this.service = service;
    }

    @PostMapping("/process")
    public ResponseEntity<PurchaseOrderResponse> process(@RequestBody PurchaseOrderRequest request) {
        return ResponseEntity.ok(service.process(request));
    }
}
