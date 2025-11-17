package com.rsm.retailbackend.feature.purchase.service;

import com.rsm.retailbackend.entity.PurchaseOrder;
import com.rsm.retailbackend.feature.purchase.dto.*;
import com.rsm.retailbackend.feature.purchase.repository.PurchaseOrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

    @Override
    public Page<PurchaseOrderListDto> getPurchaseOrders(PurchaseOrderFilterDto filter) {
        // Get filtered data
        List<PurchaseOrder> purchaseOrders = repo.findPurchaseOrdersWithFilters(
            filter.getSearchTerm(),
            filter.getSupplierId(),
            filter.getWarehouseId(),
            filter.getStatusId(),
            filter.getPurchaseDateFrom(),
            filter.getPurchaseDateTo()
        );

        // Convert to DTOs
        List<PurchaseOrderListDto> dtos = purchaseOrders.stream()
            .map(this::convertToListDto)
            .collect(Collectors.toList());

        // Apply sorting
        dtos = applySorting(dtos, filter.getSortBy(), filter.getSortDirection());

        // Apply pagination
        int start = filter.getPage() * filter.getSize();
        int end = Math.min(start + filter.getSize(), dtos.size());
        List<PurchaseOrderListDto> paginatedDtos = dtos.subList(start, end);

        PageRequest pageRequest = PageRequest.of(filter.getPage(), filter.getSize());
        return new PageImpl<>(paginatedDtos, pageRequest, dtos.size());
    }

    private PurchaseOrderListDto convertToListDto(PurchaseOrder po) {
        return PurchaseOrderListDto.builder()
            .purchaseOrderId(po.getId())
            .code(po.getCode())
            .purchaseDate(po.getPurchaseDate())
            .warehouseId(po.getWarehouse() != null ? po.getWarehouse().getId() : null)
            .warehouseName(po.getWarehouse() != null ? po.getWarehouse().getName() : null)
            .supplierId(po.getSupplier() != null ? po.getSupplier().getId() : null)
            .supplierName(po.getSupplier() != null ? po.getSupplier().getName() : null)
            .totalPayment(po.getTotalPayment())
            .description(po.getDescription())
            .statusId(po.getStatus() != null ? po.getStatus().getId() : null)
            .statusName(po.getStatus() != null ? po.getStatus().getName() : null)
            .createdDate(po.getCreatedDate())
            .expectedDeliveryDate(po.getExpectedDeliveryDate())
            .deliveryDate(po.getDeliveryDate())
            .build();
    }

    private List<PurchaseOrderListDto> applySorting(List<PurchaseOrderListDto> dtos, String sortBy, String sortDirection) {
        boolean ascending = "ASC".equalsIgnoreCase(sortDirection);
        
        switch (sortBy) {
            case "code":
                return dtos.stream()
                    .sorted((a, b) -> ascending ? 
                        a.getCode().compareTo(b.getCode()) :
                        b.getCode().compareTo(a.getCode()))
                    .collect(Collectors.toList());
            case "purchaseDate":
                return dtos.stream()
                    .sorted((a, b) -> ascending ? 
                        a.getPurchaseDate().compareTo(b.getPurchaseDate()) :
                        b.getPurchaseDate().compareTo(a.getPurchaseDate()))
                    .collect(Collectors.toList());
            case "supplierName":
                return dtos.stream()
                    .sorted((a, b) -> {
                        String supplierA = a.getSupplierName() != null ? a.getSupplierName() : "";
                        String supplierB = b.getSupplierName() != null ? b.getSupplierName() : "";
                        return ascending ? supplierA.compareTo(supplierB) : supplierB.compareTo(supplierA);
                    })
                    .collect(Collectors.toList());
            case "totalPayment":
                return dtos.stream()
                    .sorted((a, b) -> ascending ? 
                        a.getTotalPayment().compareTo(b.getTotalPayment()) :
                        b.getTotalPayment().compareTo(a.getTotalPayment()))
                    .collect(Collectors.toList());
            default: // createdDate
                return dtos.stream()
                    .sorted((a, b) -> ascending ? 
                        a.getCreatedDate().compareTo(b.getCreatedDate()) :
                        b.getCreatedDate().compareTo(a.getCreatedDate()))
                    .collect(Collectors.toList());
        }
    }
}
