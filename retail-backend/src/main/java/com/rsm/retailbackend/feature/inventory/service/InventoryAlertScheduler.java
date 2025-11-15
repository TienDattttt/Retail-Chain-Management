package com.rsm.retailbackend.feature.inventory.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class InventoryAlertScheduler {

    private final InventoryAlertService alertService;

    // 1 phút quét 1 lần (để demo), thực tế 5-15 phút hay 1h
    @Scheduled(fixedDelayString = "${app.inventory-alert.scan-interval-ms:60000}")
    public void scan() {
        log.info("Running inventory alert scheduler...");
        alertService.scanLowStockAlerts();
        alertService.scanExpiryAlerts();
    }
}
