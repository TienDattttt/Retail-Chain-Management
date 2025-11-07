// feature/voucher/controller/VoucherController.java
package com.rsm.retailbackend.feature.voucher.controller;

import com.rsm.retailbackend.feature.voucher.dto.VoucherDto;
import com.rsm.retailbackend.feature.voucher.service.VoucherService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/vouchers")
public class VoucherController {

    private final VoucherService voucherService;

    public VoucherController(VoucherService voucherService) {
        this.voucherService = voucherService;
    }

    @GetMapping
    public ResponseEntity<List<VoucherDto>> getAll() {
        return ResponseEntity.ok(voucherService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VoucherDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(voucherService.getById(id));
    }

    @GetMapping("/by-code/{code}")
    public ResponseEntity<VoucherDto> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(voucherService.getByCode(code));
    }
}
