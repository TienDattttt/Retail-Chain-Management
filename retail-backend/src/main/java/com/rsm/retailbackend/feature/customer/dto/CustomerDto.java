package com.rsm.retailbackend.feature.customer.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
public class CustomerDto {
    private Integer id;
    private String code;
    private String name;
    private String contactNumber;
    private String address;
    private String email;
    private Boolean isActive;
    private Integer branchId;
    private LocalDate birthDate;
    private Instant createdDate;
}
