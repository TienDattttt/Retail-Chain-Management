package com.rsm.retailbackend.feature.customer.service;

import com.rsm.retailbackend.feature.customer.dto.CustomerDto;

import java.util.List;

public interface CustomerService {
    List<CustomerDto> getAllForAdmin(Integer branchId);
    List<CustomerDto> getAllForManager(Integer branchId);
    CustomerDto getById(Integer id);
    CustomerDto getByPhone(String phone);
    CustomerDto upsert(CustomerDto dto);
}
