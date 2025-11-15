package com.rsm.retailbackend.feature.purchase.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class PurchaseOrderPrintRepository {

    @PersistenceContext
    private EntityManager em;

    public Map<String, Object> getPrintData(Integer purchaseOrderId) {

        var query = em.createNativeQuery("EXEC sp_GetPurchaseOrderForPrint :id");

        query.setParameter("id", purchaseOrderId);

        List<Object[]> list = query.getResultList();

        // --- Nếu không có PO ---
        if (list == null || list.isEmpty()) return null;

        // Map header
        Object[] header = list.get(0);

        Map<String, Object> data = new HashMap<>();
        data.put("purchaseOrderId", header[0]);
        data.put("purchaseOrderCode", header[1]);
        data.put("purchaseDate", header[2]);
        data.put("expectedDeliveryDate", header[3]);
        data.put("deliveryDate", header[4]);
        data.put("description", header[5]);
        data.put("total", header[6]);
        data.put("totalPayment", header[7]);
        data.put("discount", header[8]);
        data.put("discountRatio", header[9]);

        data.put("supplier", Map.of(
                "supplierId", header[10],
                "name", header[11],
                "address", header[12],
                "phone", header[13]
        ));

        data.put("warehouse", Map.of(
                "warehouseId", header[14],
                "name", header[15],
                "address", header[16]
        ));

        // Chi tiết: gọi SP và lấy result thứ 2
        var detailsQuery = em.createNativeQuery(
                "SELECT d.PurchaseOrderDetailId, d.ProductId, p.Name, p.Description, " +
                        "d.UnitPrice, d.Quantity, d.UnitPrice * d.Quantity AS Total, d.ExpiredDate " +
                        "FROM PurchaseOrderDetails d " +
                        "JOIN Products p ON p.ProductId = d.ProductId " +
                        "WHERE d.PurchaseOrderId = :id"
        );

        detailsQuery.setParameter("id", purchaseOrderId);

        List<Object[]> rows = detailsQuery.getResultList();

        List<Map<String, Object>> items = new ArrayList<>();

        for (Object[] r : rows) {
            items.add(Map.of(
                    "detailId", r[0],
                    "productId", r[1],
                    "name", r[2],
                    "description", r[3],
                    "unitPrice", r[4],
                    "quantity", r[5],
                    "total", r[6],
                    "expiredDate", r[7]
            ));
        }

        data.put("items", items);

        return data;
    }
}

