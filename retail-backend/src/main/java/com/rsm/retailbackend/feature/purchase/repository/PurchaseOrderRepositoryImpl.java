package com.rsm.retailbackend.feature.purchase.repository;

import com.rsm.retailbackend.entity.PurchaseOrder;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class PurchaseOrderRepositoryImpl implements PurchaseOrderRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<PurchaseOrder> findPurchaseOrdersWithFilters(
        String searchTerm,
        Integer supplierId,
        Integer warehouseId,
        Integer statusId,
        Instant purchaseDateFrom,
        Instant purchaseDateTo
    ) {
        String jpql = "SELECT po FROM PurchaseOrder po " +
                     "LEFT JOIN FETCH po.warehouse w " +
                     "LEFT JOIN FETCH po.supplier s " +
                     "LEFT JOIN FETCH po.status st " +
                     "WHERE (:searchTerm IS NULL OR LOWER(po.code) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
                     "       OR LOWER(s.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
                     "AND (:supplierId IS NULL OR po.supplier.id = :supplierId) " +
                     "AND (:warehouseId IS NULL OR po.warehouse.id = :warehouseId) " +
                     "AND (:statusId IS NULL OR po.status.id = :statusId) " +
                     "AND (:purchaseDateFrom IS NULL OR po.purchaseDate >= :purchaseDateFrom) " +
                     "AND (:purchaseDateTo IS NULL OR po.purchaseDate <= :purchaseDateTo) " +
                     "ORDER BY po.createdDate DESC";

        return em.createQuery(jpql, PurchaseOrder.class)
                .setParameter("searchTerm", searchTerm)
                .setParameter("supplierId", supplierId)
                .setParameter("warehouseId", warehouseId)
                .setParameter("statusId", statusId)
                .setParameter("purchaseDateFrom", purchaseDateFrom)
                .setParameter("purchaseDateTo", purchaseDateTo)
                .getResultList();
    }

    @Override
    public Long countPurchaseOrdersWithFilters(
        String searchTerm,
        Integer supplierId,
        Integer warehouseId,
        Integer statusId,
        Instant purchaseDateFrom,
        Instant purchaseDateTo
    ) {
        String jpql = "SELECT COUNT(po) FROM PurchaseOrder po " +
                     "LEFT JOIN po.supplier s " +
                     "WHERE (:searchTerm IS NULL OR LOWER(po.code) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
                     "       OR LOWER(s.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
                     "AND (:supplierId IS NULL OR po.supplier.id = :supplierId) " +
                     "AND (:warehouseId IS NULL OR po.warehouse.id = :warehouseId) " +
                     "AND (:statusId IS NULL OR po.status.id = :statusId) " +
                     "AND (:purchaseDateFrom IS NULL OR po.purchaseDate >= :purchaseDateFrom) " +
                     "AND (:purchaseDateTo IS NULL OR po.purchaseDate <= :purchaseDateTo)";

        return em.createQuery(jpql, Long.class)
                .setParameter("searchTerm", searchTerm)
                .setParameter("supplierId", supplierId)
                .setParameter("warehouseId", warehouseId)
                .setParameter("statusId", statusId)
                .setParameter("purchaseDateFrom", purchaseDateFrom)
                .setParameter("purchaseDateTo", purchaseDateTo)
                .getSingleResult();
    }

    @Override
    public Map<String, Object> processPurchaseOrder(
            Integer supplierId,
            Integer createdBy,
            Object expectedDelivery,
            Object deliveryDate,
            String description,
            Object total,
            Object totalPayment,
            Object discount,
            Object discountRatio
    ) {
        var query = em.createNativeQuery(
                "EXEC sp_ProcessPurchaseOrder :supplierId, :createdBy, :expectedDelivery, :deliveryDate, " +
                        ":description, :total, :totalPayment, :discount, :discountRatio"
        );

        query.setParameter("supplierId", supplierId);
        query.setParameter("createdBy", createdBy);
        query.setParameter("expectedDelivery", expectedDelivery);
        query.setParameter("deliveryDate", deliveryDate);
        query.setParameter("description", description);
        query.setParameter("total", total);
        query.setParameter("totalPayment", totalPayment);
        query.setParameter("discount", discount);
        query.setParameter("discountRatio", discountRatio);

        Object[] result = (Object[]) query.getSingleResult();

        Map<String, Object> map = new HashMap<>();
        map.put("purchaseOrderId", result[0]);
        map.put("purchaseOrderCode", result[1]);
        map.put("batchId", result[2]);
        map.put("lotCode", result[3]);

        return map;
    }

    @Override
    public void addDetail(Integer poId, Integer productId, Integer quantity,
                          Object unitPrice, Integer batchId, Object expiredDate) {

        var q = em.createNativeQuery(
                "EXEC sp_AddPurchaseOrderDetail :poId, :productId, :qty, :unitPrice, :batchId, :expired"
        );

        q.setParameter("poId", poId);
        q.setParameter("productId", productId);
        q.setParameter("qty", quantity);
        q.setParameter("unitPrice", unitPrice);
        q.setParameter("batchId", batchId);
        q.setParameter("expired", expiredDate);

        q.executeUpdate();
    }

    @Override
    public void addInventoryLot(Integer productId, Integer quantity,
                                Integer batchId, Object expiredDate) {

        var q = em.createNativeQuery(
                "EXEC sp_AddInventoryLot :productId, 1, :batchId, :expired, :qty"
        );

        q.setParameter("productId", productId);
        q.setParameter("batchId", batchId);
        q.setParameter("expired", expiredDate);
        q.setParameter("qty", quantity);

        q.executeUpdate();
    }

    @Override
    public void updateTotalInventory(Integer productId, Integer quantity) {
        var q = em.createNativeQuery(
                "EXEC sp_UpdateInventoryAfterPurchase 1, :productId, :qty"
        );

        q.setParameter("productId", productId);
        q.setParameter("qty", quantity);

        q.executeUpdate();
    }
}