package com.rsm.retailbackend.feature.stocktransfer.repository;

import com.rsm.retailbackend.entity.StockTransfer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public interface StockTransferJpaRepository extends JpaRepository<StockTransfer, Integer> {

    @Query("""
        SELECT st FROM StockTransfer st 
        LEFT JOIN FETCH st.fromWarehouse fw
        LEFT JOIN FETCH st.toBranch tb
        LEFT JOIN FETCH st.status s
        WHERE (:searchTerm IS NULL OR 
               LOWER(st.transferCode) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
               LOWER(tb.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')))
        AND (:fromWarehouseId IS NULL OR st.fromWarehouse.id = :fromWarehouseId)
        AND (:toBranchId IS NULL OR st.toBranch.id = :toBranchId)
        AND (:transferDateFrom IS NULL OR st.transferDate >= :transferDateFrom)
        AND (:transferDateTo IS NULL OR st.transferDate <= :transferDateTo)
        AND (:status IS NULL OR s.name = :status)
        ORDER BY st.createdDate DESC
        """)
    Page<StockTransfer> findAllWithFilters(
            @Param("searchTerm") String searchTerm,
            @Param("fromWarehouseId") Integer fromWarehouseId,
            @Param("toBranchId") Integer toBranchId,
            @Param("transferDateFrom") Instant transferDateFrom,
            @Param("transferDateTo") Instant transferDateTo,
            @Param("status") String status,
            Pageable pageable
    );

    @Query("""
        SELECT st FROM StockTransfer st 
        LEFT JOIN FETCH st.fromWarehouse fw
        LEFT JOIN FETCH st.toBranch tb
        LEFT JOIN FETCH st.status s
        LEFT JOIN FETCH st.createdBy cb
        WHERE st.id = :id
        """)
    StockTransfer findByIdWithDetails(@Param("id") Integer id);
}