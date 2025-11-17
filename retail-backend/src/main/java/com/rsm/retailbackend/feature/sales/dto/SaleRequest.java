package com.rsm.retailbackend.feature.sales.dto;

import com.rsm.retailbackend.entity.InvoiceDetail;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class SaleRequest {
    private String code;
    private Integer branchId;
    private Integer customerId;
    private BigDecimal total;
    private BigDecimal totalPayment;
    private BigDecimal discount;
    private BigDecimal discountRatio;
    private String description;
    private String paymentMethod; // "CASH", "MOMO", "VNPAY"
    private Integer createdBy;
    private List<InvoiceDetail> details;
}