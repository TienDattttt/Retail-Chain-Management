package com.rsm.retailbackend.feature.customer.controller;

import com.rsm.retailbackend.feature.common.dto.MessageResponse;
import com.rsm.retailbackend.feature.customer.dto.CustomerDto;
import com.rsm.retailbackend.feature.customer.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // ADMIN: lấy tất cả hoặc lọc theo branchId
    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('1')")
    public ResponseEntity<List<CustomerDto>> getAllForAdmin(@RequestParam(required = false) Integer branchId) {
        return ResponseEntity.ok(customerService.getAllForAdmin(branchId));
    }

    // MANAGER: lấy danh sách khách hàng thuộc chi nhánh hiện tại
    @GetMapping("/manager/{branchId}")
    @PreAuthorize("hasAuthority('2')")
    public ResponseEntity<List<CustomerDto>> getAllForManager(@PathVariable Integer branchId) {
        return ResponseEntity.ok(customerService.getAllForManager(branchId));
    }

    // TÌM THEO SỐ ĐIỆN THOẠI (ROLE 1,2,3)
    @GetMapping("/phone/{phone}")
    @PreAuthorize("hasAnyAuthority('1','2','3')")
    public ResponseEntity<CustomerDto> getByPhone(@PathVariable String phone) {
        return ResponseEntity.ok(customerService.getByPhone(phone));
    }

    // LẤY CHI TIẾT KHÁCH HÀNG (ROLE 1,2)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('1','2')")
    public ResponseEntity<CustomerDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(customerService.getById(id));
    }

    // UPSERT (TẠO MỚI HOẶC CẬP NHẬT)
    @PostMapping("/upsert")
    @PreAuthorize("hasAnyAuthority('1','2','3')")
    public ResponseEntity<MessageResponse> upsert(@RequestBody CustomerDto dto) {
        CustomerDto saved = customerService.upsert(dto);
        String msg = (dto.getId() == null)
                ? "Thêm mới khách hàng thành công!"
                : "Cập nhật khách hàng thành công!";
        return ResponseEntity.ok(new MessageResponse(msg, saved));
    }
}
