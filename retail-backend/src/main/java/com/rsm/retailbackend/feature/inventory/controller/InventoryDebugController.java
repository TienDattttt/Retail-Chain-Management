package com.rsm.retailbackend.feature.inventory.controller;

import com.rsm.retailbackend.feature.inventory.service.InventoryAlertService;
import com.rsm.retailbackend.feature.common.dto.MessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
public class InventoryDebugController {

    private final InventoryAlertService alertService;

    @GetMapping("/test-scan-low-stock")
    public ResponseEntity<MessageResponse> testLowStockScan() {
        alertService.scanLowStockAlerts();
        return ResponseEntity.ok(new MessageResponse("Đã chạy scan Low Stock!"));
    }

    @GetMapping("/test-scan-expiry")
    public ResponseEntity<MessageResponse> testExpiryScan() {
        alertService.scanExpiryAlerts();
        return ResponseEntity.ok(new MessageResponse("Đã chạy scan Expiry!"));
    }
}
