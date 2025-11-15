package com.rsm.retailbackend.feature.purchase.repository;

import org.springframework.stereotype.Repository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.HashMap;
import java.util.Map;

@Repository
public class PurchaseOrderRepository {

    @PersistenceContext
    private EntityManager em;

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

    public void updateTotalInventory(Integer productId, Integer quantity) {
        var q = em.createNativeQuery(
                "EXEC sp_UpdateInventoryAfterPurchase 1, :productId, :qty"
        );

        q.setParameter("productId", productId);
        q.setParameter("qty", quantity);

        q.executeUpdate();
    }
}
