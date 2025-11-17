package com.rsm.retailbackend.feature.purchase.service;

import com.rsm.retailbackend.feature.purchase.dto.PurchaseOrderFilterDto;
import com.rsm.retailbackend.feature.purchase.dto.PurchaseOrderListDto;
import com.rsm.retailbackend.feature.purchase.dto.PurchaseOrderRequest;
import com.rsm.retailbackend.feature.purchase.dto.PurchaseOrderResponse;
import org.springframework.data.domain.Page;

public interface PurchaseOrderService {
    PurchaseOrderResponse process(PurchaseOrderRequest request);
    Page<PurchaseOrderListDto> getPurchaseOrders(PurchaseOrderFilterDto filter);
}

