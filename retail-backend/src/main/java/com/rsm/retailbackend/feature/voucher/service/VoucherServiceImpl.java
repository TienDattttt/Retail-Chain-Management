
package com.rsm.retailbackend.feature.voucher.service;

import com.rsm.retailbackend.entity.Voucher;
import com.rsm.retailbackend.exception.BusinessException;
import com.rsm.retailbackend.feature.voucher.dto.VoucherDto;
import com.rsm.retailbackend.feature.voucher.repository.VoucherRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;

    public VoucherServiceImpl(VoucherRepository voucherRepository) {
        this.voucherRepository = voucherRepository;
    }

    @Override
    public List<VoucherDto> getAll() {
        return voucherRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public VoucherDto getById(Integer id) {
        Voucher v = voucherRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy voucher", HttpStatus.NOT_FOUND.value()));
        return toDto(v);
    }

    @Override
    public VoucherDto getByCode(String code) {
        Voucher v = voucherRepository.findByCode(code)
                .orElseThrow(() -> new BusinessException("Không tìm thấy voucher với mã: " + code, HttpStatus.NOT_FOUND.value()));
        return toDto(v);
    }

    private VoucherDto toDto(Voucher v) {
        VoucherDto dto = new VoucherDto();
        dto.setId(v.getId());
        dto.setCode(v.getCode());
        dto.setVoucherCampaignId(v.getVoucherCampaign() != null ? v.getVoucherCampaign().getId() : null);
        dto.setStartDate(v.getStartDate());
        dto.setEndDate(v.getEndDate());
        dto.setIsUsed(v.getIsUsed());
        dto.setUsedDate(v.getUsedDate());
        dto.setCustomerId(v.getCustomer() != null ? v.getCustomer().getId() : null);
        dto.setOrderId(v.getInvoice() != null ? v.getInvoice().getId() : null);
        dto.setDiscountValue(v.getDiscountValue());
        return dto;
    }
}
