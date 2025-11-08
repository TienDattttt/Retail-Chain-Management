package com.rsm.retailbackend.feature.sales.controller;

import com.rsm.retailbackend.entity.Invoice;
import com.rsm.retailbackend.feature.sales.dto.SaleRequest;
import com.rsm.retailbackend.feature.sales.service.SaleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping("/process")
    @PreAuthorize("hasAnyAuthority('1','2','3')")
    public ResponseEntity<Map<String, Object>> processSale(@RequestBody SaleRequest request) {
        Invoice invoice = saleService.processSale(request);

        return ResponseEntity.ok(Map.of(
                "message", "Thanh toán tiền mặt thành công",
                "invoiceId", invoice.getId(),
                "invoiceCode", invoice.getCode(),
                "status", invoice.getStatus().getCode()
        ));
    }
}
