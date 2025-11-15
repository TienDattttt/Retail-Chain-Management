package com.rsm.retailbackend.feature.purchase.service;

import com.rsm.retailbackend.feature.purchase.dto.PurchaseOrderItemDto;
import com.rsm.retailbackend.feature.purchase.dto.PurchaseOrderRequest;
import com.rsm.retailbackend.feature.purchase.dto.PurchaseOrderResponse;
import com.rsm.retailbackend.feature.purchase.repository.PurchaseOrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository repo;

    public PurchaseOrderServiceImpl(PurchaseOrderRepository repo) {
        this.repo = repo;
    }

    @Override
    public PurchaseOrderResponse process(PurchaseOrderRequest request) {

        var result = repo.processPurchaseOrder(
                request.getSupplierId(),
                request.getCreatedBy(),
                request.getExpectedDeliveryDate(),
                request.getDeliveryDate(),
                request.getDescription(),
                request.getTotal(),
                request.getTotalPayment(),
                request.getDiscount(),
                request.getDiscountRatio()
        );

        Integer poId = (Integer) result.get("purchaseOrderId");
        Integer batchId = (Integer) result.get("batchId");

        for (PurchaseOrderItemDto item : request.getItems()) {

            repo.addDetail(
                    poId,
                    item.getProductId(),
                    item.getQuantity(),
                    item.getUnitPrice(),
                    batchId,
                    item.getExpiredDate()
            );

            repo.addInventoryLot(
                    item.getProductId(),
                    item.getQuantity(),
                    batchId,
                    item.getExpiredDate()
            );

            repo.updateTotalInventory(item.getProductId(), item.getQuantity());
        }

        return new PurchaseOrderResponse(
                poId,
                (String) result.get("purchaseOrderCode"),
                batchId,
                (String) result.get("lotCode")
        );
    }
}
