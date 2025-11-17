package com.rsm.retailbackend.feature.inventory.service;

import com.rsm.retailbackend.entity.ProductInventory;
import com.rsm.retailbackend.feature.inventory.dto.StockFilterDto;
import com.rsm.retailbackend.feature.inventory.dto.StockManagementDto;
import com.rsm.retailbackend.feature.product.repository.ProductInventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockManagementServiceImpl implements StockManagementService {

    private final ProductInventoryRepository productInventoryRepository;

    @Override
    public Page<StockManagementDto> getStockManagement(StockFilterDto filter) {
        // Get filtered data
        List<ProductInventory> inventories = productInventoryRepository.findStockWithFilters(
            filter.getSearchTerm(),
            filter.getCategoryId(),
            filter.getBranchId(),
            filter.getWarehouseId()
        );

        // Apply stock status filter
        List<StockManagementDto> filteredDtos = inventories.stream()
            .map(this::convertToDto)
            .filter(dto -> matchesStockStatus(dto, filter.getStockStatus()))
            .collect(Collectors.toList());

        // Apply sorting
        filteredDtos = applySorting(filteredDtos, filter.getSortBy(), filter.getSortDirection());

        // Apply pagination
        int start = filter.getPage() * filter.getSize();
        int end = Math.min(start + filter.getSize(), filteredDtos.size());
        List<StockManagementDto> paginatedDtos = filteredDtos.subList(start, end);

        PageRequest pageRequest = PageRequest.of(filter.getPage(), filter.getSize());
        return new PageImpl<>(paginatedDtos, pageRequest, filteredDtos.size());
    }

    private StockManagementDto convertToDto(ProductInventory inventory) {
        String stockStatus = determineStockStatus(inventory.getAvailable(), inventory.getMinThreshold());
        
        return StockManagementDto.builder()
            .productId(inventory.getProduct().getId())
            .productCode(inventory.getProduct().getCode())
            .productName(inventory.getProduct().getName())
            .categoryName(inventory.getProduct().getCategory() != null ? 
                inventory.getProduct().getCategory().getCategoryName() : null)
            .imageUrl(inventory.getProduct().getImageUrl())
            .retailPrice(inventory.getProduct().getRetailPrice())
            .unit(inventory.getProduct().getUnit())
            .branchId(inventory.getBranch() != null ? inventory.getBranch().getId() : null)
            .branchName(inventory.getBranch() != null ? inventory.getBranch().getName() : "Kho tổng công ty")
            .warehouseId(inventory.getWarehouse() != null ? inventory.getWarehouse().getId() : null)
            .warehouseName(inventory.getWarehouse() != null ? inventory.getWarehouse().getName() : null)
            .onHand(inventory.getOnHand())
            .reserved(inventory.getReserved())
            .available(inventory.getAvailable())
            .minThreshold(inventory.getMinThreshold())
            .lastUpdated(inventory.getLastUpdated())
            .stockStatus(stockStatus)
            .build();
    }

    private String determineStockStatus(Integer available, Integer minThreshold) {
        if (available == null || available == 0) {
            return "OUT_OF_STOCK";
        }
        if (minThreshold != null && available <= minThreshold) {
            return "LOW_STOCK";
        }
        return "NORMAL";
    }

    private boolean matchesStockStatus(StockManagementDto dto, String stockStatus) {
        if (stockStatus == null || "ALL".equals(stockStatus)) {
            return true;
        }
        return stockStatus.equals(dto.getStockStatus());
    }

    private List<StockManagementDto> applySorting(List<StockManagementDto> dtos, String sortBy, String sortDirection) {
        boolean ascending = "ASC".equalsIgnoreCase(sortDirection);
        
        switch (sortBy) {
            case "productCode":
                return dtos.stream()
                    .sorted((a, b) -> ascending ? 
                        a.getProductCode().compareTo(b.getProductCode()) :
                        b.getProductCode().compareTo(a.getProductCode()))
                    .collect(Collectors.toList());
            case "categoryName":
                return dtos.stream()
                    .sorted((a, b) -> {
                        String catA = a.getCategoryName() != null ? a.getCategoryName() : "";
                        String catB = b.getCategoryName() != null ? b.getCategoryName() : "";
                        return ascending ? catA.compareTo(catB) : catB.compareTo(catA);
                    })
                    .collect(Collectors.toList());
            case "available":
                return dtos.stream()
                    .sorted((a, b) -> ascending ? 
                        Integer.compare(a.getAvailable(), b.getAvailable()) :
                        Integer.compare(b.getAvailable(), a.getAvailable()))
                    .collect(Collectors.toList());
            case "branchName":
                return dtos.stream()
                    .sorted((a, b) -> {
                        String branchA = a.getBranchName() != null ? a.getBranchName() : "";
                        String branchB = b.getBranchName() != null ? b.getBranchName() : "";
                        return ascending ? branchA.compareTo(branchB) : branchB.compareTo(branchA);
                    })
                    .collect(Collectors.toList());
            default: // productName
                return dtos.stream()
                    .sorted((a, b) -> ascending ? 
                        a.getProductName().compareTo(b.getProductName()) :
                        b.getProductName().compareTo(a.getProductName()))
                    .collect(Collectors.toList());
        }
    }
}