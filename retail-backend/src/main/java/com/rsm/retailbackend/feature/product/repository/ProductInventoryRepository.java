package com.rsm.retailbackend.feature.product.repository;

import com.rsm.retailbackend.entity.ProductInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductInventoryRepository extends JpaRepository<ProductInventory, Integer> {

    List<ProductInventory> findByProduct_Id(Integer productId);

    Optional<ProductInventory> findByProduct_IdAndBranch_Id(Integer productId, Integer branchId);

    Optional<ProductInventory> findByProduct_IdAndBranch_IdAndWarehouse_Id(
            Integer productId, Integer branchId, Integer warehouseId);

    @Query("""
       SELECT pi FROM ProductInventory pi
       WHERE pi.minThreshold IS NOT NULL
         AND (pi.onHand - pi.reserved) <= pi.minThreshold
       """)
    List<ProductInventory> findLowStockInventories();

    @Modifying
    @Query("""
       UPDATE ProductInventory pi
       SET pi.onHand = (
           SELECT COALESCE(SUM(l.onHand), 0)
           FROM ProductInventoryLot l
           WHERE l.product.id = pi.product.id
             AND l.branch.id = pi.branch.id
             AND l.warehouse.id = pi.warehouse.id
       )
       WHERE pi.id = :inventoryId
       """)
    void recalcOnHand(@Param("inventoryId") Integer inventoryId);

}