package com.rsm.retailbackend.feature.purchase.repository;

import com.rsm.retailbackend.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer>, PurchaseOrderRepositoryCustom {

}
