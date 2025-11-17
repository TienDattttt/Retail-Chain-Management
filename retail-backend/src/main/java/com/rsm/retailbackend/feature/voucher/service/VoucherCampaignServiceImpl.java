
package com.rsm.retailbackend.feature.voucher.service;

import com.rsm.retailbackend.entity.Branch;
import com.rsm.retailbackend.entity.Status;
import com.rsm.retailbackend.entity.Voucher;
import com.rsm.retailbackend.entity.VoucherCampaign;
import com.rsm.retailbackend.exception.BusinessException;
import com.rsm.retailbackend.feature.branch.repository.BranchRepository;
import com.rsm.retailbackend.feature.status.repository.StatusRepository;
import com.rsm.retailbackend.feature.voucher.dto.VoucherCampaignDto;
import com.rsm.retailbackend.feature.voucher.dto.VoucherDto;
import com.rsm.retailbackend.feature.voucher.repository.VoucherCampaignRepository;
import com.rsm.retailbackend.feature.voucher.repository.VoucherRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class VoucherCampaignServiceImpl implements VoucherCampaignService {

    private final VoucherCampaignRepository campaignRepository;
    private final StatusRepository statusRepository;
    private final BranchRepository branchRepository;
    private final VoucherRepository voucherRepository;

    public VoucherCampaignServiceImpl(VoucherCampaignRepository campaignRepository,
                                      StatusRepository statusRepository,
                                      BranchRepository branchRepository,
                                      VoucherRepository voucherRepository) {
        this.campaignRepository = campaignRepository;
        this.statusRepository = statusRepository;
        this.branchRepository = branchRepository;
        this.voucherRepository = voucherRepository;
    }

    @Override
    public List<VoucherCampaignDto> getAll() {
        return campaignRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public VoucherCampaignDto getById(Integer id) {
        VoucherCampaign vc = campaignRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy chiến dịch", HttpStatus.NOT_FOUND.value()));
        return toDto(vc);
    }

    @Override
    public VoucherCampaignDto upsert(VoucherCampaignDto dto) {
        VoucherCampaign entity;
        boolean creating = (dto.getId() == null);

        if (creating) {
            entity = new VoucherCampaign();
            entity.setCreatedDate(Instant.now());

            if (campaignRepository.existsByCode(dto.getCode())) {
                throw new BusinessException("Mã chiến dịch đã tồn tại", HttpStatus.BAD_REQUEST.value());
            }
        } else {
            entity = campaignRepository.findById(dto.getId())
                    .orElseThrow(() -> new BusinessException("Không tìm thấy chiến dịch", HttpStatus.NOT_FOUND.value()));
        }

        entity.setCode(dto.getCode());
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());

        // active hay không do UI gửi lên
        boolean isActive = dto.getIsActive() != null ? dto.getIsActive() : true;
        entity.setIsActive(isActive);

        entity.setDiscountType(dto.getDiscountType());
        entity.setDiscountValue(dto.getDiscountValue());
        entity.setMinOrderValue(dto.getMinOrderValue());
        entity.setMaxDiscountValue(dto.getMaxDiscountValue());
        entity.setQuantity(dto.getQuantity() != null ? dto.getQuantity() : 0);
        entity.setUsedQuantity(dto.getUsedQuantity() != null ? dto.getUsedQuantity() : 0);
        int remaining = entity.getQuantity() - entity.getUsedQuantity();
        entity.setRemainingQuantity(dto.getRemainingQuantity() != null ? dto.getRemainingQuantity() : remaining);
        entity.setIsAutoGenerate(dto.getIsAutoGenerate() != null ? dto.getIsAutoGenerate() : false);
        entity.setIsUnlimited(dto.getIsUnlimited() != null ? dto.getIsUnlimited() : false);

        if (dto.getBranchId() != null) {
            Branch b = branchRepository.findById(dto.getBranchId())
                    .orElseThrow(() -> new BusinessException("Không tìm thấy chi nhánh", HttpStatus.BAD_REQUEST.value()));
            entity.setBranch(b);
        } else {
            entity.setBranch(null);
        }

        // chọn status theo isActive
        String statusCode = isActive ? "ACTIVE" : "INACTIVE";
        Status st = statusRepository.findByEntityTypeAndCode("VoucherCampaign", statusCode)
                .orElseThrow(() -> new BusinessException("Thiếu status VoucherCampaign/" + statusCode, 500));
        entity.setStatus(st);

        VoucherCampaign saved = campaignRepository.save(entity);
        return toDto(saved);
    }

    private VoucherCampaignDto toDto(VoucherCampaign vc) {
        VoucherCampaignDto dto = new VoucherCampaignDto();
        dto.setId(vc.getId());
        dto.setCode(vc.getCode());
        dto.setName(vc.getName());
        dto.setDescription(vc.getDescription());
        dto.setStartDate(vc.getStartDate());
        dto.setEndDate(vc.getEndDate());
        dto.setIsActive(vc.getIsActive());
        dto.setBranchId(vc.getBranch() != null ? vc.getBranch().getId() : null);
        dto.setDiscountType(vc.getDiscountType());
        dto.setDiscountValue(vc.getDiscountValue());
        dto.setMinOrderValue(vc.getMinOrderValue());
        dto.setMaxDiscountValue(vc.getMaxDiscountValue());
        dto.setQuantity(vc.getQuantity());
        dto.setUsedQuantity(vc.getUsedQuantity());
        dto.setRemainingQuantity(vc.getRemainingQuantity());
        dto.setIsAutoGenerate(vc.getIsAutoGenerate());
        dto.setIsUnlimited(vc.getIsUnlimited());
        return dto;
    }

    @Override
    public List<VoucherDto> generateVouchers(Integer campaignId, Integer quantity) {
        VoucherCampaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new BusinessException("Không tìm thấy chiến dịch", HttpStatus.NOT_FOUND.value()));

        if (!campaign.getIsActive()) {
            throw new BusinessException("Chiến dịch không hoạt động", HttpStatus.BAD_REQUEST.value());
        }

        if (!campaign.getIsUnlimited() && campaign.getRemainingQuantity() < quantity) {
            throw new BusinessException("Không đủ số lượng voucher còn lại", HttpStatus.BAD_REQUEST.value());
        }

        List<VoucherDto> result = new ArrayList<>();
        Status activeStatus = statusRepository.findByEntityTypeAndCode("Voucher", "ACTIVE")
                .orElseThrow(() -> new BusinessException("Thiếu status Voucher/ACTIVE", 500));

        for (int i = 0; i < quantity; i++) {
            Voucher voucher = new Voucher();
            voucher.setCode(generateVoucherCode(campaign.getCode()));
            voucher.setVoucherCampaign(campaign);
            voucher.setStartDate(campaign.getStartDate());
            voucher.setEndDate(campaign.getEndDate());
            voucher.setStatus(activeStatus);
            voucher.setIsUsed(false);
            voucher.setDiscountValue(campaign.getDiscountValue());

            Voucher saved = voucherRepository.save(voucher);
            result.add(toVoucherDto(saved));
        }

        // Cập nhật số lượng còn lại của campaign
        if (!campaign.getIsUnlimited()) {
            campaign.setRemainingQuantity(campaign.getRemainingQuantity() - quantity);
            campaignRepository.save(campaign);
        }

        return result;
    }

    private String generateVoucherCode(String campaignCode) {
        String uuid = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        return campaignCode + "-" + uuid;
    }

    private VoucherDto toVoucherDto(Voucher v) {
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
