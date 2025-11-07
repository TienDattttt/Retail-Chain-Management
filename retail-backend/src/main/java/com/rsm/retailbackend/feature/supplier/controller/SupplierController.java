package com.rsm.retailbackend.feature.supplier.controller;

import com.rsm.retailbackend.feature.supplier.dto.SupplierDto;
import com.rsm.retailbackend.feature.supplier.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@SecurityRequirement(name = "bearerAuth")

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    // Lấy tất cả (cả active và inactive)
    @GetMapping
    public ResponseEntity<List<SupplierDto>> getAll() {
        return ResponseEntity.ok(supplierService.getAll());
    }

    // Lấy theo id
    @GetMapping("/{id}")
    public ResponseEntity<SupplierDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(supplierService.getById(id));
    }

    // Upsert + bật/tắt isActive luôn
    @PostMapping("/upsert")
    @PreAuthorize("hasAuthority('1')")
    public ResponseEntity<MessageResponse> upsert(@RequestBody SupplierDto dto) {
        SupplierDto result = supplierService.upsert(dto);

        String msg = (dto.getId() == null)
                ? "Thêm mới nhà cung cấp thành công!"
                : "Cập nhật nhà cung cấp thành công!";

        return ResponseEntity.ok(new MessageResponse(msg, result));
    }

    private record MessageResponse(String message, Object data) {}
}
