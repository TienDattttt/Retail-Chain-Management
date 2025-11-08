package com.rsm.retailbackend.feature.sales.service;

import com.rsm.retailbackend.entity.Invoice;
import com.rsm.retailbackend.entity.InvoiceDetail;
import com.rsm.retailbackend.feature.invoice.service.InvoiceService;
import com.rsm.retailbackend.feature.payment.service.PaymentService;
import com.rsm.retailbackend.feature.inventory.service.InventoryService;
import com.rsm.retailbackend.feature.sales.dto.SaleRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Transactional
public class SaleServiceImpl implements SaleService {

    private final InvoiceService invoiceService;
    private final PaymentService paymentService;
    private final InventoryService inventoryService;

    public SaleServiceImpl(InvoiceService invoiceService,
                           PaymentService paymentService,
                           InventoryService inventoryService) {
        this.invoiceService = invoiceService;
        this.paymentService = paymentService;
        this.inventoryService = inventoryService;
    }

    @Override
    public Invoice processSale(SaleRequest request) {
        System.out.println("Bắt đầu xử lý bán hàng cho mã: " + request.getCode());

        Invoice invoice = invoiceService.createInvoice(
                request.getCode(),
                request.getBranchId(),
                request.getCustomerId(),
                request.getTotal(),
                request.getTotalPayment(),
                request.getDiscount(),
                request.getDiscountRatio(),
                request.getDescription(),
                request.getPaymentMethod(),
                request.getCreatedBy(),
                request.getDetails()
        );

        String method = request.getPaymentMethod().toUpperCase();

        switch (method) {
            case "CASH" -> {
                paymentService.createPayment(invoice.getId(), request.getTotalPayment(), "CASH", request.getCreatedBy());
                for (InvoiceDetail d : request.getDetails()) {
                    inventoryService.deductInventoryForSale(request.getBranchId(), d.getProduct().getId(), d.getQuantity());
                }
                System.out.printf("Hoàn tất thanh toán tiền mặt cho hóa đơn %s%n", invoice.getCode());
            }
            case "MOMO" -> {
                Map<String, Object> momoResult = (Map<String, Object>)
                        paymentService.createPayment(invoice.getId(), request.getTotalPayment(), "MOMO", request.getCreatedBy());

                String payUrl = (String) momoResult.get("payUrl");
                invoice.setDescription(payUrl); // Lưu tạm để controller dùng
                System.out.printf("Đang chờ thanh toán MoMo cho hóa đơn %s (PaymentId=%s)%n",
                        invoice.getCode(), momoResult.get("paymentId"));
            }
            default -> throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ: " + method);
        }

        return invoice;
    }

}
