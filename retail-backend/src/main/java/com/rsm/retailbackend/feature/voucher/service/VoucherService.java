package com.rsm.retailbackend.feature.voucher.service;

import com.rsm.retailbackend.feature.voucher.dto.VoucherDto;

import java.util.List;

public interface VoucherService {
    List<VoucherDto> getAll();
    VoucherDto getById(Integer id);
    VoucherDto getByCode(String code);
}