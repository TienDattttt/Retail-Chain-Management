package com.rsm.retailbackend.feature.supplier.service;

import com.rsm.retailbackend.entity.Branch;
import com.rsm.retailbackend.entity.Supplier;
import com.rsm.retailbackend.exception.BusinessException;
import com.rsm.retailbackend.feature.branch.repository.BranchRepository;
import com.rsm.retailbackend.feature.supplier.dto.SupplierDto;
import com.rsm.retailbackend.feature.supplier.repository.SupplierRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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
            // CREATE - tự động tạo mã
            supplier = new Supplier();
            supplier.setCreatedDate(Instant.now());
            // nếu UI không gửi isActive thì mặc định true
            supplier.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
            
            // Tự động tạo mã nhà cung cấp
            String code = generateSupplierCode();
            supplier.setCode(code);
        }

        // Chỉ set code khi update (không cho phép thay đổi code khi tạo mới)
        if (dto.getId() != null && dto.getCode() != null) {
            supplier.setCode(dto.getCode());
        }
        supplier.setName(dto.getName());
        supplier.setContactNumber(dto.getContactNumber());
        supplier.setEmail(dto.getEmail());
        supplier.setAddress(dto.getAddress());
        supplier.setWardName(dto.getWardName());
        supplier.setOrganization(dto.getOrganization());
        // Bỏ taxCode
        // supplier.setTaxCode(dto.getTaxCode());
        supplier.setComments(dto.getComments());
        supplier.setDescription(dto.getDescription());
        supplier.setDebt(dto.getDebt() != null ? dto.getDebt() : BigDecimal.ZERO);
        supplier.setTotalInvoiced(dto.getTotalInvoiced() != null ? dto.getTotalInvoiced() : BigDecimal.ZERO);
        
        // Sử dụng createdBy từ DTO hoặc lấy từ SecurityContext
        String createdBy = dto.getCreatedBy();
        if (createdBy == null || createdBy.isEmpty()) {
            createdBy = getCurrentUsername();
        }
        supplier.setCreatedBy(createdBy);

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

    private String generateSupplierCode() {
        // Tìm mã lớn nhất hiện tại
        List<Supplier> suppliers = supplierRepository.findAll();
        int maxNumber = 0;
        
        for (Supplier supplier : suppliers) {
            String code = supplier.getCode();
            if (code != null && code.startsWith("SUP")) {
                try {
                    int number = Integer.parseInt(code.substring(3));
                    maxNumber = Math.max(maxNumber, number);
                } catch (NumberFormatException e) {
                    // Ignore invalid codes
                }
            }
        }
        
        return String.format("SUP%03d", maxNumber + 1);
    }

    @Override
    public SupplierDto toggleStatus(Integer id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy nhà cung cấp", HttpStatus.NOT_FOUND.value()));
        
        supplier.setIsActive(!supplier.getIsActive());
        supplier.setModifiedDate(Instant.now());
        
        Supplier saved = supplierRepository.save(supplier);
        return toDto(saved);
    }

    /**
     * Lấy username của user hiện tại từ SecurityContext
     */
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return "system"; // fallback nếu không có authentication
    }
}
