package com.rsm.retailbackend.feature.branch.service;

import com.rsm.retailbackend.entity.Branch;
import com.rsm.retailbackend.exception.BusinessException;
import com.rsm.retailbackend.feature.branch.dto.BranchDto;
import com.rsm.retailbackend.feature.branch.repository.BranchRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;

    public BranchServiceImpl(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    @Override
    public List<BranchDto> getAll() {
        return branchRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BranchDto getById(Integer id) {
        Branch b = branchRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy chi nhánh", HttpStatus.NOT_FOUND.value()));
        return toDto(b);
    }

    @Override
    public BranchDto upsert(BranchDto dto) {
        Branch b;
        boolean isCreate = (dto.getId() == null);

        if (isCreate) {
            b = new Branch();
            b.setCreatedDate(Instant.now());
            if (dto.getBranchCode() == null || dto.getBranchCode().isBlank()) {
                b.setBranchCode("BR" + System.currentTimeMillis());
            } else {
                b.setBranchCode(dto.getBranchCode());
            }
        } else {
            b = branchRepository.findById(dto.getId())
                    .orElseThrow(() -> new BusinessException("Không tìm thấy chi nhánh để cập nhật", HttpStatus.NOT_FOUND.value()));
            b.setModifiedDate(Instant.now());
        }

        if (dto.getName() != null) b.setName(dto.getName());
        b.setAddress(dto.getAddress());
        b.setWardName(dto.getWardName());
        b.setDistrictName(dto.getDistrictName());
        b.setCityName(dto.getCityName());
        b.setPhoneNumber(dto.getPhoneNumber());
        b.setEmail(dto.getEmail());
        b.setIsMain(dto.getIsMain() != null ? dto.getIsMain() : Boolean.FALSE);
        b.setLevel(dto.getLevel());
        b.setCreatedBy(dto.getCreatedBy());

        // Toggle active/inactive logic
        if (dto.getIsActive() != null) {
            b.setIsActive(dto.getIsActive());
        } else if (isCreate) {
            b.setIsActive(Boolean.TRUE);
        }

        // Parent (nếu có)
        if (dto.getParentId() != null) {
            Branch parent = branchRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new BusinessException("Chi nhánh cha không tồn tại", HttpStatus.BAD_REQUEST.value()));
            b.setParent(parent);
        }

        Branch saved = branchRepository.save(b);
        return toDto(saved);
    }

    private BranchDto toDto(Branch b) {
        return BranchDto.builder()
                .id(b.getId())
                .branchCode(b.getBranchCode())
                .name(b.getName())
                .address(b.getAddress())
                .wardName(b.getWardName())
                .districtName(b.getDistrictName())
                .cityName(b.getCityName())
                .phoneNumber(b.getPhoneNumber())
                .email(b.getEmail())
                .isActive(b.getIsActive())
                .isMain(b.getIsMain())
                .parentId(b.getParent() != null ? b.getParent().getId() : null)
                .level(b.getLevel())
                .createdBy(b.getCreatedBy())
                .createdDate(b.getCreatedDate())
                .modifiedDate(b.getModifiedDate())
                .build();
    }
}
