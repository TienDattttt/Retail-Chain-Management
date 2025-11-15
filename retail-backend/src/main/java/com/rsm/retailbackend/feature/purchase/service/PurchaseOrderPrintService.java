package com.rsm.retailbackend.feature.purchase.service;

import com.rsm.retailbackend.feature.purchase.repository.PurchaseOrderPrintRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PurchaseOrderPrintService {

    private final PurchaseOrderPrintRepository repo;

    public PurchaseOrderPrintService(PurchaseOrderPrintRepository repo) {
        this.repo = repo;
    }

    public Map<String, Object> getPrintData(Integer id) {
        return repo.getPrintData(id);
    }
}
