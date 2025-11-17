package com.rsm.retailbackend.feature.purchase.repository;

import com.rsm.retailbackend.entity.PurchaseOrder;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public interface PurchaseOrderRepositoryCustom {
    List<PurchaseOrder> findPurchaseOrdersWithFilters(
        String searchTerm,
        Integer supplierId,
        Integer warehouseId,
        Integer statusId,
        Instant purchaseDateFrom,
        Instant purchaseDateTo
    );

    Long countPurchaseOrdersWithFilters(
        String searchTerm,
        Integer supplierId,
        Integer warehouseId,
        Integer statusId,
        Instant purchaseDateFrom,
        Instant purchaseDateTo
    );

    Map<String, Object> processPurchaseOrder(
        Integer supplierId,
        Integer createdBy,
        Object expectedDelivery,
        Object deliveryDate,
        String description,
        Object total,
        Object totalPayment,
        Object discount,
        Object discountRatio
    );

    void addDetail(Integer poId, Integer productId, Integer quantity,
                   Object unitPrice, Integer batchId, Object expiredDate);

    void addInventoryLot(Integer productId, Integer quantity,
                         Integer batchId, Object expiredDate);

    void updateTotalInventory(Integer productId, Integer quantity);
}