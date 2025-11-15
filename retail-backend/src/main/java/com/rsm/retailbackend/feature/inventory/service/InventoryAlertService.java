package com.rsm.retailbackend.feature.inventory.service;

public interface InventoryAlertService {

    void scanLowStockAlerts();

    void scanExpiryAlerts();
}
