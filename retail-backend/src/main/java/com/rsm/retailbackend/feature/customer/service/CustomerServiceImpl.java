package com.rsm.retailbackend.feature.customer.service;

import com.rsm.retailbackend.entity.Branch;
import com.rsm.retailbackend.entity.Customer;
import com.rsm.retailbackend.feature.customer.dto.CustomerDto;
import com.rsm.retailbackend.feature.customer.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    private CustomerDto toDto(Customer entity) {
        CustomerDto dto = new CustomerDto();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setName(entity.getName());
        dto.setContactNumber(entity.getContactNumber());
        dto.setAddress(entity.getAddress());
        dto.setEmail(entity.getEmail());
        dto.setIsActive(entity.getIsActive());
        dto.setBranchId(entity.getBranch() != null ? entity.getBranch().getId() : null);
        dto.setCreatedDate(entity.getCreatedDate());
        dto.setBirthDate(entity.getBirthDate());
        return dto;
    }

    @Override
    public List<CustomerDto> getAllForAdmin(Integer branchId) {
        return customerRepository.findAllByBranchId(branchId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<CustomerDto> getAllForManager(Integer branchId) {
        return customerRepository.findByBranch_Id(branchId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public CustomerDto getById(Integer id) {
        return customerRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng ID = " + id));
    }

    @Override
    public CustomerDto getByPhone(String phone) {
        return customerRepository.findByContactNumber(phone)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng có số điện thoại " + phone));
    }

    @Override
    public CustomerDto upsert(CustomerDto dto) {
        String sql = "EXEC sp_UpsertCustomer @CustomerId=?, @Name=?, @ContactNumber=?, @BranchId=?, @Email=?, @Address=?";
        Map<String, Object> result = jdbcTemplate.queryForMap(
                sql,
                dto.getId(),
                dto.getName(),
                dto.getContactNumber(),
                dto.getBranchId(),
                dto.getEmail(),
                dto.getAddress()
        );

        Integer id = ((Number) result.get("CustomerId")).intValue();
        String action = (String) result.get("Action");

        // Lấy lại entity để trả DTO đầy đủ
        Customer saved = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng sau khi upsert"));

        CustomerDto response = toDto(saved);
        response.setId(id);
        return response;
    }
}
