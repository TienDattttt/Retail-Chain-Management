package com.rsm.retailbackend.feature.stocktransfer.repository;

import com.rsm.retailbackend.entity.StockTransferDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockTransferDetailJpaRepository extends JpaRepository<StockTransferDetail, Integer> {

    @Query("""
        SELECT std FROM StockTransferDetail std 
        LEFT JOIN FETCH std.product p
        LEFT JOIN FETCH p.category
        WHERE std.stockTransfer.id = :stockTransferId
        ORDER BY std.id
        """)
    List<StockTransferDetail> findByStockTransferIdWithProduct(@Param("stockTransferId") Integer stockTransferId);

    @Query("""
        SELECT COUNT(DISTINCT std.product.id) FROM StockTransferDetail std 
        WHERE std.stockTransfer.id = :stockTransferId
        """)
    Integer countDistinctProductsByStockTransferId(@Param("stockTransferId") Integer stockTransferId);

    @Query("""
        SELECT COALESCE(SUM(std.quantity), 0) FROM StockTransferDetail std 
        WHERE std.stockTransfer.id = :stockTransferId
        """)
    Integer sumQuantityByStockTransferId(@Param("stockTransferId") Integer stockTransferId);
}