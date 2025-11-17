
package com.rsm.retailbackend.feature.voucher.service;

import com.rsm.retailbackend.feature.voucher.dto.VoucherCampaignDto;
import com.rsm.retailbackend.feature.voucher.dto.VoucherDto;

import java.util.List;

public interface VoucherCampaignService {
    List<VoucherCampaignDto> getAll();
    VoucherCampaignDto getById(Integer id);
    VoucherCampaignDto upsert(VoucherCampaignDto dto);
    List<VoucherDto> generateVouchers(Integer campaignId, Integer quantity);
}
