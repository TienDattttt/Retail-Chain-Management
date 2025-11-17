package com.rsm.retailbackend.feature.stocktransfer.service;

import com.rsm.retailbackend.entity.StockTransfer;
import com.rsm.retailbackend.entity.StockTransferDetail;
import com.rsm.retailbackend.feature.stocktransfer.dto.*;
import com.rsm.retailbackend.feature.stocktransfer.repository.StockTransferRepository;
import com.rsm.retailbackend.feature.stocktransfer.repository.StockTransferJpaRepository;
import com.rsm.retailbackend.feature.stocktransfer.repository.StockTransferDetailJpaRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StockTransferServiceImpl implements StockTransferService {

    private final StockTransferRepository repo;
    private final StockTransferJpaRepository jpaRepo;
    private final StockTransferDetailJpaRepository detailJpaRepo;

    public StockTransferServiceImpl(
            StockTransferRepository repo,
            StockTransferJpaRepository jpaRepo,
            StockTransferDetailJpaRepository detailJpaRepo) {
        this.repo = repo;
        this.jpaRepo = jpaRepo;
        this.detailJpaRepo = detailJpaRepo;
    }

    @Override
    public StockTransferResponseDto transfer(StockTransferRequestDto dto) {

        var header = repo.createTransfer(
                dto.getFromWarehouseId(),
                dto.getToBranchId(),
                dto.getDescription(),
                dto.getCreatedBy()
        );

        Integer transferId = (Integer) header.get("transferId");

        for (StockTransferItemDto item : dto.getItems()) {
            repo.addDetail(
                    transferId,
                    item.getProductId(),
                    item.getQuantity(),
                    dto.getFromWarehouseId(),
                    dto.getToBranchId()
            );
        }

        return new StockTransferResponseDto(
                transferId,
                (String) header.get("transferCode")
        );
    }

    @Override
    public Page<StockTransferListDto> getAllTransfers(String searchTerm, Integer fromWarehouseId, 
                                                    Integer toBranchId, String transferDateFrom, 
                                                    String transferDateTo, String status, Pageable pageable) {
        
        // Parse date strings to Instant
        Instant dateFrom = null;
        Instant dateTo = null;
        
        if (transferDateFrom != null && !transferDateFrom.isEmpty()) {
            try {
                LocalDate localDate = LocalDate.parse(transferDateFrom, DateTimeFormatter.ISO_LOCAL_DATE);
                dateFrom = localDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
            } catch (Exception e) {
                // Ignore invalid date format
            }
        }
        
        if (transferDateTo != null && !transferDateTo.isEmpty()) {
            try {
                LocalDate localDate = LocalDate.parse(transferDateTo, DateTimeFormatter.ISO_LOCAL_DATE);
                dateTo = localDate.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant();
            } catch (Exception e) {
                // Ignore invalid date format
            }
        }

        // Query database with filters
        Page<StockTransfer> transfers = jpaRepo.findAllWithFilters(
                searchTerm, fromWarehouseId, toBranchId, 
                dateFrom, dateTo, status, pageable);

        // Convert to DTO
        return transfers.map(this::convertToListDto);
    }

    private StockTransferListDto convertToListDto(StockTransfer transfer) {
        StockTransferListDto dto = new StockTransferListDto();
        dto.setId(transfer.getId());
        dto.setTransferCode(transfer.getTransferCode());
        dto.setFromWarehouseName(transfer.getFromWarehouse() != null ? transfer.getFromWarehouse().getName() : "N/A");
        dto.setToBranchName(transfer.getToBranch() != null ? transfer.getToBranch().getName() : "N/A");
        dto.setDescription(transfer.getDescription());
        dto.setTransferDate(transfer.getTransferDate() != null ? 
                LocalDateTime.ofInstant(transfer.getTransferDate(), ZoneId.systemDefault()) : null);
        dto.setStatus(transfer.getStatus() != null ? transfer.getStatus().getName() : "N/A");
        dto.setCreatedDate(transfer.getCreatedDate() != null ? 
                LocalDateTime.ofInstant(transfer.getCreatedDate(), ZoneId.systemDefault()) : null);

        // Get aggregated data for this transfer
        Integer totalProducts = detailJpaRepo.countDistinctProductsByStockTransferId(transfer.getId());
        Integer totalQuantity = detailJpaRepo.sumQuantityByStockTransferId(transfer.getId());
        
        dto.setTotalProducts(totalProducts != null ? totalProducts : 0);
        dto.setTotalQuantity(totalQuantity != null ? totalQuantity : 0);

        return dto;
    }

    @Override
    public StockTransferDetailDto getTransferDetail(Integer id) {
        // Get transfer with related entities
        StockTransfer transfer = jpaRepo.findByIdWithDetails(id);
        if (transfer == null) {
            throw new RuntimeException("Stock transfer not found with id: " + id);
        }

        // Get transfer details
        List<StockTransferDetail> details = detailJpaRepo.findByStockTransferIdWithProduct(id);

        // Convert to DTO
        StockTransferDetailDto dto = new StockTransferDetailDto();
        dto.setId(transfer.getId());
        dto.setTransferCode(transfer.getTransferCode());
        dto.setFromWarehouseName(transfer.getFromWarehouse() != null ? transfer.getFromWarehouse().getName() : "N/A");
        dto.setToBranchName(transfer.getToBranch() != null ? transfer.getToBranch().getName() : "N/A");
        dto.setDescription(transfer.getDescription());
        dto.setTransferDate(transfer.getTransferDate() != null ? 
                LocalDateTime.ofInstant(transfer.getTransferDate(), ZoneId.systemDefault()) : null);
        dto.setStatus(transfer.getStatus() != null ? transfer.getStatus().getName() : "N/A");
        dto.setCreatedDate(transfer.getCreatedDate() != null ? 
                LocalDateTime.ofInstant(transfer.getCreatedDate(), ZoneId.systemDefault()) : null);

        // Convert detail items
        List<StockTransferDetailItemDto> itemDtos = details.stream()
                .map(this::convertToDetailItemDto)
                .collect(Collectors.toList());
        dto.setItems(itemDtos);

        return dto;
    }

    private StockTransferDetailItemDto convertToDetailItemDto(StockTransferDetail detail) {
        StockTransferDetailItemDto dto = new StockTransferDetailItemDto();
        dto.setProductId(detail.getProduct().getId());
        dto.setProductName(detail.getProduct().getName());
        dto.setProductCode(detail.getProduct().getCode());
        dto.setQuantity(detail.getQuantity());
        dto.setUnit(detail.getProduct().getUnit() != null ? detail.getProduct().getUnit() : "N/A");
        return dto;
    }

    @Override
    public void deleteTransfer(Integer id) {
        // Check if transfer exists
        if (!jpaRepo.existsById(id)) {
            throw new RuntimeException("Stock transfer not found with id: " + id);
        }

        // Delete transfer details first (due to foreign key constraint)
        List<StockTransferDetail> details = detailJpaRepo.findByStockTransferIdWithProduct(id);
        detailJpaRepo.deleteAll(details);

        // Delete transfer
        jpaRepo.deleteById(id);
    }
}
