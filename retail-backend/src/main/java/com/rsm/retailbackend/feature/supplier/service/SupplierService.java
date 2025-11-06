package com.rsm.retailbackend.feature.supplier.service;

import com.rsm.retailbackend.feature.supplier.dto.SupplierDto;

import java.util.List;

public interface SupplierService {

    List<SupplierDto> getAll();

    SupplierDto getById(Integer id);

    SupplierDto upsert(SupplierDto dto);
}
