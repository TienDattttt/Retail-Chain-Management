package com.rsm.retailbackend.feature.supplier.service;

import com.rsm.retailbackend.entity.Branch;
import com.rsm.retailbackend.entity.Supplier;
import com.rsm.retailbackend.exception.BusinessException;
import com.rsm.retailbackend.feature.branch.repository.BranchRepository;
import com.rsm.retailbackend.feature.supplier.dto.SupplierDto;
import com.rsm.retailbackend.feature.supplier.repository.SupplierRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final BranchRepository branchRepository;

    public SupplierServiceImpl(SupplierRepository supplierRepository,
                               BranchRepository branchRepository) {
        this.supplierRepository = supplierRepository;
        this.branchRepository = branchRepository;
    }

    @Override
    public List<SupplierDto> getAll() {
        return supplierRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public SupplierDto getById(Integer id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy nhà cung cấp", HttpStatus.NOT_FOUND.value()));
        return toDto(supplier);
    }

    @Override
    public SupplierDto upsert(SupplierDto dto) {
        Supplier supplier;

        // UPDATE
        if (dto.getId() != null) {
            supplier = supplierRepository.findById(dto.getId())
                    .orElseThrow(() -> new BusinessException("Nhà cung cấp không tồn tại", HttpStatus.NOT_FOUND.value()));
            supplier.setModifiedDate(Instant.now());
        } else {
            // CREATE
            if (supplierRepository.existsByCode(dto.getCode())) {
                throw new BusinessException("Mã nhà cung cấp đã tồn tại", HttpStatus.BAD_REQUEST.value());
            }
            supplier = new Supplier();
            supplier.setCreatedDate(Instant.now());
            // nếu UI không gửi isActive thì mặc định true
            supplier.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        }

        supplier.setCode(dto.getCode());
        supplier.setName(dto.getName());
        supplier.setContactNumber(dto.getContactNumber());
        supplier.setEmail(dto.getEmail());
        supplier.setAddress(dto.getAddress());
        supplier.setWardName(dto.getWardName());
        supplier.setOrganization(dto.getOrganization());
        supplier.setTaxCode(dto.getTaxCode());
        supplier.setComments(dto.getComments());
        supplier.setDescription(dto.getDescription());
        supplier.setDebt(dto.getDebt());
        supplier.setTotalInvoiced(dto.getTotalInvoiced());
        supplier.setCreatedBy(dto.getCreatedBy());

        // cập nhật isActive nếu UI gửi lên
        if (dto.getIsActive() != null) {
            supplier.setIsActive(dto.getIsActive());
        }

        // branch optional (cách 1)
        if (dto.getBranchId() != null) {
            Branch branch = branchRepository.findById(dto.getBranchId())
                    .orElseThrow(() -> new BusinessException("Chi nhánh không tồn tại", HttpStatus.BAD_REQUEST.value()));
            supplier.setBranch(branch);
        } else {
            supplier.setBranch(null);
        }

        Supplier saved = supplierRepository.save(supplier);
        return toDto(saved);
    }

    private SupplierDto toDto(Supplier s) {
        SupplierDto dto = new SupplierDto();
        dto.setId(s.getId());
        dto.setCode(s.getCode());
        dto.setName(s.getName());
        dto.setContactNumber(s.getContactNumber());
        dto.setEmail(s.getEmail());
        dto.setAddress(s.getAddress());
        dto.setWardName(s.getWardName());
        dto.setOrganization(s.getOrganization());
        dto.setTaxCode(s.getTaxCode());
        dto.setComments(s.getComments());
        dto.setDescription(s.getDescription());
        dto.setIsActive(s.getIsActive());
        dto.setBranchId(s.getBranch() != null ? s.getBranch().getId() : null);
        dto.setDebt(s.getDebt());
        dto.setTotalInvoiced(s.getTotalInvoiced());
        dto.setCreatedBy(s.getCreatedBy());
        dto.setCreatedDate(s.getCreatedDate());
        dto.setModifiedDate(s.getModifiedDate());
        return dto;
    }
}
