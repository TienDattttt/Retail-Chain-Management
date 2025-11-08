package com.rsm.retailbackend.feature.inventory.service;

public interface InventoryService {
    void deductInventoryForSale(Integer branchId, Integer productId, Integer quantity);
}
