package com.rsm.retailbackend.feature.stocktransfer.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class StockTransferRepository {

    @PersistenceContext
    private EntityManager em;

    public Map<String, Object> createTransfer(
            Integer fromWarehouseId,
            Integer toBranchId,
            String description,
            Integer createdBy
    ) {
        StoredProcedureQuery sp = em
                .createStoredProcedureQuery("sp_CreateStockTransfer")
                .registerStoredProcedureParameter("FromWarehouseId", Integer.class, ParameterMode.IN)
                .registerStoredProcedureParameter("ToBranchId", Integer.class, ParameterMode.IN)
                .registerStoredProcedureParameter("Description", String.class, ParameterMode.IN)
                .registerStoredProcedureParameter("CreatedBy", Integer.class, ParameterMode.IN)
                .registerStoredProcedureParameter("TransferId", Integer.class, ParameterMode.OUT)
                .registerStoredProcedureParameter("TransferCode", String.class, ParameterMode.OUT);

        sp.setParameter("FromWarehouseId", fromWarehouseId);
        sp.setParameter("ToBranchId", toBranchId);
        sp.setParameter("Description", description);
        sp.setParameter("CreatedBy", createdBy);

        sp.execute();

        Integer id = (Integer) sp.getOutputParameterValue("TransferId");
        String code = (String) sp.getOutputParameterValue("TransferCode");

        return Map.of(
                "transferId", id,
                "transferCode", code
        );
    }

    public void addDetail(
            Integer transferId,
            Integer productId,
            Integer quantity,
            Integer fromWarehouseId,
            Integer toBranchId
    ) {
        var q = em.createNativeQuery(
                "EXEC sp_AddStockTransferDetail :tid, :pid, :qty, :fromW, :toB"
        );

        q.setParameter("tid", transferId);
        q.setParameter("pid", productId);
        q.setParameter("qty", quantity);
        q.setParameter("fromW", fromWarehouseId);
        q.setParameter("toB", toBranchId);

        q.executeUpdate();
    }
}
