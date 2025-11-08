package com.rsm.retailbackend.feature.sales.service;

import com.rsm.retailbackend.entity.Invoice;
import com.rsm.retailbackend.entity.InvoiceDetail;
import com.rsm.retailbackend.feature.invoice.service.InvoiceService;
import com.rsm.retailbackend.feature.payment.service.PaymentService;
import com.rsm.retailbackend.feature.inventory.service.InventoryService;
import com.rsm.retailbackend.feature.sales.dto.SaleRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        System.out.println("🧾 Bắt đầu xử lý bán hàng cho mã: " + request.getCode());

        // Tạo hóa đơn + chi tiết hóa đơn
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

        // Nếu thanh toán tiền mặt → tạo payment & trừ tồn kho
        if ("CASH".equalsIgnoreCase(request.getPaymentMethod())) {
            paymentService.createPayment(invoice.getId(), request.getTotalPayment(), "CASH", request.getCreatedBy());

            for (InvoiceDetail d : request.getDetails()) {
                inventoryService.deductInventoryForSale(request.getBranchId(), d.getProduct().getId(), d.getQuantity());
            }

            System.out.printf("Hoàn tất thanh toán tiền mặt cho hóa đơn %s%n", request.getCode());
        }

        // Các phương thức MOMO/VNPAY sẽ xử lý callback sau
        return invoice;
    }
}
