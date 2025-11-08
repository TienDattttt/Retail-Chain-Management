package com.rsm.retailbackend.feature.invoice.service;

import com.rsm.retailbackend.entity.Invoice;
import com.rsm.retailbackend.entity.InvoiceDetail;

import java.math.BigDecimal;
import java.util.List;

public interface InvoiceService {
    Invoice createInvoice(String code,
                          Integer branchId,
                          Integer customerId,
                          BigDecimal total,
                          BigDecimal totalPayment,
                          BigDecimal discount,
                          BigDecimal discountRatio,
                          String description,
                          String paymentMethod,
                          Integer createdBy,
                          List<InvoiceDetail> details);
}
