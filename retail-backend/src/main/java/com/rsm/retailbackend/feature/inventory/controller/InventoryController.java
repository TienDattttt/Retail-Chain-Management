package com.rsm.retailbackend.feature.inventory.controller;

import com.rsm.retailbackend.exception.BusinessException;
import com.rsm.retailbackend.feature.common.dto.MessageResponse;
import com.rsm.retailbackend.feature.inventory.repository.InventoryAlertRepository;
import com.rsm.retailbackend.feature.product.repository.ProductInventoryLotRepository;
import com.rsm.retailbackend.feature.product.repository.ProductInventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final ProductInventoryLotRepository lotRepository;
    private final ProductInventoryRepository inventoryRepository;
    private final InventoryAlertRepository alertRepository;

    @PostMapping("/dispose-expired")
    @Transactional
    public ResponseEntity<MessageResponse> disposeExpired(
            @RequestParam Integer alertId,
            @RequestParam Integer lotId,
            @RequestParam Integer inventoryId
    ) {
        var alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new BusinessException("Không tìm thấy alert"));

        if (!"EXPIRED".equalsIgnoreCase(alert.getAlertType())) {
            throw new BusinessException("Chỉ hỗ trợ hủy cho cảnh báo EXPIRED.");
        }

        lotRepository.clearLotQuantity(lotId);
        inventoryRepository.recalcOnHand(inventoryId);

        alert.setResolvedDate(java.time.Instant.now());
        alert.setIsRead(true);

        return ResponseEntity.ok(new MessageResponse("Đã hủy hàng hết hạn & cập nhật tồn kho."));
    }
}
