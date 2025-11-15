package com.rsm.retailbackend.feature.replenishment.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import jakarta.persistence.ParameterMode;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class ReplenishmentRequestRepository {

    @PersistenceContext
    private EntityManager em;

    public Map<String, Object> createRequest(Integer branchId, String description, Integer createdBy) {

        StoredProcedureQuery sp = em
                .createStoredProcedureQuery("sp_CreateReplenishmentRequest")
                .registerStoredProcedureParameter("BranchId", Integer.class, ParameterMode.IN)
                .registerStoredProcedureParameter("Description", String.class, ParameterMode.IN)
                .registerStoredProcedureParameter("CreatedBy", Integer.class, ParameterMode.IN)
                .registerStoredProcedureParameter("RequestId", Integer.class, ParameterMode.OUT)
                .registerStoredProcedureParameter("RequestCode", String.class, ParameterMode.OUT);

        sp.setParameter("BranchId", branchId);
        sp.setParameter("Description", description);
        sp.setParameter("CreatedBy", createdBy);

        sp.execute();

        Integer id = (Integer) sp.getOutputParameterValue("RequestId");
        String code = (String) sp.getOutputParameterValue("RequestCode");

        return Map.of(
                "requestId", id,
                "requestCode", code
        );
    }

    public void addDetail(Integer requestId, Integer productId, Integer quantity) {

        var q = em.createNativeQuery(
                "EXEC sp_AddReplenishmentDetail :rid, :pid, :qty"
        );

        q.setParameter("rid", requestId);
        q.setParameter("pid", productId);
        q.setParameter("qty", quantity);

        q.executeUpdate();
    }
}
