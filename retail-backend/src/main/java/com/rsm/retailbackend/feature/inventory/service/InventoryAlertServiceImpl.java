package com.rsm.retailbackend.feature.inventory.service;

import com.rsm.retailbackend.entity.InventoryAlert;
import com.rsm.retailbackend.entity.ProductInventory;
import com.rsm.retailbackend.entity.ProductInventoryLot;
import com.rsm.retailbackend.feature.inventory.dto.InventoryAlertDto;
import com.rsm.retailbackend.feature.inventory.repository.InventoryAlertRepository;
import com.rsm.retailbackend.feature.product.repository.ProductInventoryLotRepository;
import com.rsm.retailbackend.feature.product.repository.ProductInventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class InventoryAlertServiceImpl implements InventoryAlertService {

    private final ProductInventoryRepository productInventoryRepository;
    private final ProductInventoryLotRepository lotRepository;
    private final InventoryAlertRepository alertRepository;
    private final SimpMessagingTemplate messagingTemplate;

    private static final String TYPE_LOW_STOCK = "LOW_STOCK";
    private static final String TYPE_NEAR_EXPIRY = "NEAR_EXPIRY";
    private static final String TYPE_EXPIRED = "EXPIRED";

    // ============================================================
    // 1) LOW STOCK
    // ============================================================
    @Override
    public void scanLowStockAlerts() {

        var lowStocks = productInventoryRepository.findLowStockInventories();

        for (ProductInventory pi : lowStocks) {

            Integer productId = pi.getProduct().getId();
            Integer branchId = pi.getBranch() != null ? pi.getBranch().getId() : null;
            Integer warehouseId = pi.getWarehouse() != null ? pi.getWarehouse().getId() : null;

            Optional<InventoryAlert> existing =
                    alertRepository.findFirstByAlertTypeAndProduct_IdAndBranch_IdAndWarehouse_IdAndResolvedDateIsNull(
                            TYPE_LOW_STOCK, productId, branchId, warehouseId
                    );

            if (existing.isPresent()) continue;

            InventoryAlert alert = new InventoryAlert();
            alert.setProduct(pi.getProduct());
            alert.setBranch(pi.getBranch());
            alert.setWarehouse(pi.getWarehouse());
            alert.setAlertType(TYPE_LOW_STOCK);

            alert.setMessage(String.format(
                    "Tồn kho thấp: %s (Available=%d, Min=%d)",
                    pi.getProduct().getName(),
                    pi.getOnHand() - pi.getReserved(),
                    pi.getMinThreshold()
            ));

            alert.setQuantity(pi.getOnHand() - pi.getReserved());
            alert.setCreatedDate(Instant.now());
            alert.setIsRead(false);

            alertRepository.save(alert);

            //  LOW STOCK -> lotId = null, inventoryId = pi.getId()
            sendAlertToWs(alert, null, pi.getId());
        }
    }

    // ============================================================
    // 2) EXPIRY CHECK
    // ============================================================
    @Override
    public void scanExpiryAlerts() {

        LocalDate today = LocalDate.now();

        var expiredLots =
                lotRepository.findByExpiredDateIsNotNullAndExpiredDateLessThanAndOnHandGreaterThan(today, 0);

        for (ProductInventoryLot lot : expiredLots) {
            createExpiryAlert(lot, TYPE_EXPIRED);
        }

        var nearExpiredLots =
                lotRepository.findByExpiredDateIsNotNullAndExpiredDateLessThanEqualAndOnHandGreaterThan(
                        today.plusDays(30), 0
                );

        for (ProductInventoryLot lot : nearExpiredLots) {

            var piOpt = findInventoryOfLot(lot);
            if (piOpt.isEmpty()) continue;

            ProductInventory pi = piOpt.get();
            Integer warningDays = pi.getExpiryWarningDays();

            if (warningDays == null || warningDays <= 0) continue;

            long daysLeft = java.time.temporal.ChronoUnit.DAYS.between(today, lot.getExpiredDate());

            if (daysLeft < 0 || daysLeft > warningDays) continue;

            createExpiryAlert(lot, TYPE_NEAR_EXPIRY);
        }
    }

    // Tìm inventory tương ứng 1 lô
    private Optional<ProductInventory> findInventoryOfLot(ProductInventoryLot lot) {
        return productInventoryRepository.findByProduct_IdAndBranch_IdAndWarehouse_Id(
                lot.getProduct().getId(),
                lot.getBranch() != null ? lot.getBranch().getId() : null,
                lot.getWarehouse() != null ? lot.getWarehouse().getId() : null
        );
    }

    // ============================================================
    // Tạo Alert Hết hạn / Sắp hết hạn
    // ============================================================
    private void createExpiryAlert(ProductInventoryLot lot, String type) {

        Integer productId = lot.getProduct().getId();
        Integer branchId = lot.getBranch() != null ? lot.getBranch().getId() : null;
        Integer warehouseId = lot.getWarehouse() != null ? lot.getWarehouse().getId() : null;

        Optional<InventoryAlert> existing =
                alertRepository.findFirstByAlertTypeAndProduct_IdAndBranch_IdAndWarehouse_IdAndResolvedDateIsNull(
                        type, productId, branchId, warehouseId
                );

        if (existing.isPresent()) return;

        // tìm inventory
        Optional<ProductInventory> invOpt = findInventoryOfLot(lot);
        Integer inventoryId = invOpt.map(ProductInventory::getId).orElse(null);

        InventoryAlert alert = new InventoryAlert();
        alert.setProduct(lot.getProduct());
        alert.setBranch(lot.getBranch());
        alert.setWarehouse(lot.getWarehouse());
        alert.setAlertType(type);

        alert.setMessage(String.format(
                "%s: %s - lô sắp/đã hết hạn (%s), tồn lô = %d",
                type.equals(TYPE_EXPIRED) ? "Hết hạn" : "Sắp hết hạn",
                lot.getProduct().getName(),
                lot.getExpiredDate(),
                lot.getOnHand()
        ));

        alert.setQuantity(lot.getOnHand());
        alert.setExpiredDate(lot.getExpiredDate());
        alert.setCreatedDate(Instant.now());
        alert.setIsRead(false);

        alertRepository.save(alert);

        sendAlertToWs(alert, lot.getId(), inventoryId);
    }

    // ============================================================
    // Gửi WebSocket
    // ============================================================
    private void sendAlertToWs(InventoryAlert alert, Integer lotId, Integer inventoryId) {

        InventoryAlertDto dto = new InventoryAlertDto(
                alert.getId(),
                alert.getProduct().getId(),
                alert.getProduct().getName(),
                alert.getBranch() != null ? alert.getBranch().getId() : null,
                alert.getWarehouse() != null ? alert.getWarehouse().getId() : null,
                lotId,
                inventoryId,
                alert.getAlertType(),
                alert.getMessage(),
                alert.getQuantity(),
                alert.getExpiredDate(),
                alert.getCreatedDate()
        );

        messagingTemplate.convertAndSend("/topic/inventory-alerts", dto);

        if (dto.getBranchId() != null) {
            messagingTemplate.convertAndSend("/topic/inventory-alerts/branch/" + dto.getBranchId(), dto);
        }
        if (dto.getWarehouseId() != null) {
            messagingTemplate.convertAndSend("/topic/inventory-alerts/warehouse/" + dto.getWarehouseId(), dto);
        }
    }
}
