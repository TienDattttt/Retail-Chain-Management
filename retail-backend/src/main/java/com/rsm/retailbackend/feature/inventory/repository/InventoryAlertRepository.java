package com.rsm.retailbackend.feature.inventory.repository;

import com.rsm.retailbackend.entity.InventoryAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryAlertRepository extends JpaRepository<InventoryAlert, Integer> {

    Optional<InventoryAlert> findFirstByAlertTypeAndProduct_IdAndBranch_IdAndWarehouse_IdAndResolvedDateIsNull(
            String alertType, Integer productId, Integer branchId, Integer warehouseId
    );
}
