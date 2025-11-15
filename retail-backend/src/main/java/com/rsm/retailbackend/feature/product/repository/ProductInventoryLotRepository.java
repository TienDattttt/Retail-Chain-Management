package com.rsm.retailbackend.feature.product.repository;

import com.rsm.retailbackend.entity.ProductInventoryLot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ProductInventoryLotRepository extends JpaRepository<ProductInventoryLot, Integer> {

    // Lô hết hạn
    List<ProductInventoryLot> findByExpiredDateIsNotNullAndExpiredDateLessThanAndOnHandGreaterThan(
            LocalDate today, int minOnHand
    );

    // Lô sắp hết hạn
    List<ProductInventoryLot> findByExpiredDateIsNotNullAndExpiredDateLessThanEqualAndOnHandGreaterThan(
            LocalDate date, int minOnHand
    );

    @Modifying
    @Query("UPDATE ProductInventoryLot l SET l.onHand = 0 WHERE l.id = :lotId")
    void clearLotQuantity(@Param("lotId") Integer lotId);
}


