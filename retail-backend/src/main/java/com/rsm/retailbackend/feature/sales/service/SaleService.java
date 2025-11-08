package com.rsm.retailbackend.feature.sales.service;

import com.rsm.retailbackend.entity.Invoice;
import com.rsm.retailbackend.feature.sales.dto.SaleRequest;

public interface SaleService {
    Invoice processSale(SaleRequest request);
}
