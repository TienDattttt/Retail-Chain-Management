package com.rsm.retailbackend.feature.purchase.service;

import com.rsm.retailbackend.feature.purchase.dto.PurchaseOrderRequest;
import com.rsm.retailbackend.feature.purchase.dto.PurchaseOrderResponse;

public interface PurchaseOrderService {
    PurchaseOrderResponse process(PurchaseOrderRequest request);
}

