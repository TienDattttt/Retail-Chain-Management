package com.rsm.retailbackend.feature.supplier.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
public class SupplierDto {
    private Integer id;
    private String code;
    private String name;
    private String contactNumber;
    private String email;
    private String address;
    private String wardName;
    private String organization;
    private String taxCode;
    private String comments;
    private String description;
    private Boolean isActive;
    private Integer branchId;     // có thể null
    private BigDecimal debt;
    private BigDecimal totalInvoiced;
    private String createdBy;
    private Instant createdDate;
    private Instant modifiedDate;
}
