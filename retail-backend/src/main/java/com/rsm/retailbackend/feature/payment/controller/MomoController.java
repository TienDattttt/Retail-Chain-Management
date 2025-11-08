package com.rsm.retailbackend.feature.payment.controller;

import com.rsm.retailbackend.feature.inventory.service.InventoryService;
import com.rsm.retailbackend.feature.payment.service.PaymentServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/momo")
@Slf4j
public class MomoController {

    private final PaymentServiceImpl paymentService;
    private final InventoryService inventoryService;
    private final JdbcTemplate jdbcTemplate;

    @PostMapping("/ipn-handler")
    public ResponseEntity<Void> handleIpn(@RequestBody Map<String, Object> payload) {
        try {
            log.info("IPN nhận từ MoMo: {}", payload);

            Integer resultCode = (Integer) payload.get("resultCode");
            String orderId = (String) payload.get("orderId");
            Long transId = ((Number) payload.get("transId")).longValue();
            BigDecimal amount = new BigDecimal(payload.get("amount").toString());

            if (resultCode == 0) {
                log.info("Giao dịch MOMO thành công. OrderId={}, Amount={}", orderId, amount);

                //  Gọi service xác nhận thanh toán
                paymentService.confirmMomoPayment(orderId, amount, transId);

                //  Lấy InvoiceId từ DB để trừ tồn kho
                Integer invoiceId = jdbcTemplate.queryForObject(
                        "SELECT InvoiceId FROM Payments WHERE TransactionCode = ?",
                        Integer.class,
                        orderId
                );

                List<Map<String, Object>> details = jdbcTemplate.queryForList(
                        "SELECT ProductId, Quantity, i.BranchId " +
                                "FROM InvoiceDetails d JOIN Invoices i ON i.InvoiceId = d.InvoiceId " +
                                "WHERE d.InvoiceId = ?", invoiceId
                );

                for (Map<String, Object> row : details) {
                    Integer branchId = (Integer) row.get("BranchId");
                    Integer productId = (Integer) row.get("ProductId");
                    Integer quantity = (Integer) row.get("Quantity");

                    inventoryService.deductInventoryForSale(branchId, productId, quantity);
                }

                log.info("Đã trừ tồn kho cho hóa đơn {}", invoiceId);
            } else {
                log.warn("Giao dịch MOMO thất bại. resultCode={}, message={}",
                        resultCode, payload.get("message"));
            }

            // Phản hồi 204 như MoMo yêu cầu
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            log.error("Lỗi xử lý IPN MOMO: {}", e.getMessage(), e);
            return ResponseEntity.noContent().build();
        }
    }
}
