package com.rsm.retailbackend.feature.sales.controller;

import com.rsm.retailbackend.entity.Invoice;
import com.rsm.retailbackend.feature.sales.dto.SaleRequest;
import com.rsm.retailbackend.feature.sales.service.SaleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping("/process")
    @PreAuthorize("hasAnyAuthority('1','2','3')")
    public ResponseEntity<Map<String, Object>> processSale(@RequestBody SaleRequest request) {
        Invoice invoice = saleService.processSale(request);

        String method = request.getPaymentMethod().toUpperCase();
        String message = switch (method) {
            case "CASH" -> "Thanh toán tiền mặt thành công";
            case "MOMO" -> "Tạo giao dịch MoMo thành công, chờ người dùng thanh toán";
            case "VNPAY" -> "Tạo giao dịch VNPAY thành công, chờ người dùng thanh toán";
            default -> "Phương thức thanh toán không xác định";
        };

        Map<String, Object> response = new java.util.LinkedHashMap<>();
        response.put("message", message);
        response.put("invoiceId", invoice.getId());
        response.put("invoiceCode", invoice.getCode());
        response.put("status", invoice.getStatus().getCode());

        // Nếu là MoMo → trả thêm payUrl để FE redirect
        if ("MOMO".equalsIgnoreCase(method)) {
            response.put("payUrl", invoice.getDescription()); // hoặc lưu payUrl vào Payment, rồi lấy ở đây
        }

        return ResponseEntity.ok(response);
    }

}
