package com.rsm.retailbackend.feature.branch.controller;

import com.rsm.retailbackend.feature.branch.dto.BranchDto;
import com.rsm.retailbackend.feature.branch.service.BranchService;
import com.rsm.retailbackend.feature.common.dto.MessageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
public class BranchController {

    private final BranchService branchService;

    public BranchController(BranchService branchService) {
        this.branchService = branchService;
    }

    // Lấy danh sách tất cả chi nhánh
    @GetMapping
    public ResponseEntity<List<BranchDto>> getAll() {
        return ResponseEntity.ok(branchService.getAll());
    }

    // Lấy thông tin chi nhánh theo ID
    @GetMapping("/{id}")
    public ResponseEntity<BranchDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(branchService.getById(id));
    }

    // Upsert (tạo mới, cập nhật, toggle active/inactive)
    @PostMapping("/upsert")
    @PreAuthorize("hasAuthority('1')") // chỉ admin
    public ResponseEntity<MessageResponse> upsert(@RequestBody BranchDto dto) {
        BranchDto saved = branchService.upsert(dto);
        String msg;

        if (dto.getId() == null) {
            msg = "Thêm mới chi nhánh thành công!";
        } else if (dto.getIsActive() != null && !dto.getIsActive()) {
            msg = "Chi nhánh đã được chuyển sang trạng thái ngưng hoạt động.";
        } else {
            msg = "Cập nhật chi nhánh thành công!";
        }

        return ResponseEntity.ok(new MessageResponse(msg, saved));
    }


}
