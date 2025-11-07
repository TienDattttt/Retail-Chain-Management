
package com.rsm.retailbackend.feature.voucher.service;

import com.rsm.retailbackend.entity.Branch;
import com.rsm.retailbackend.entity.Status;
import com.rsm.retailbackend.entity.VoucherCampaign;
import com.rsm.retailbackend.exception.BusinessException;
import com.rsm.retailbackend.feature.branch.repository.BranchRepository;
import com.rsm.retailbackend.feature.status.repository.StatusRepository;
import com.rsm.retailbackend.feature.voucher.dto.VoucherCampaignDto;
import com.rsm.retailbackend.feature.voucher.repository.VoucherCampaignRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class VoucherCampaignServiceImpl implements VoucherCampaignService {

    private final VoucherCampaignRepository campaignRepository;
    private final StatusRepository statusRepository;
    private final BranchRepository branchRepository;

    public VoucherCampaignServiceImpl(VoucherCampaignRepository campaignRepository,
                                      StatusRepository statusRepository,
                                      BranchRepository branchRepository) {
        this.campaignRepository = campaignRepository;
        this.statusRepository = statusRepository;
        this.branchRepository = branchRepository;
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
}
