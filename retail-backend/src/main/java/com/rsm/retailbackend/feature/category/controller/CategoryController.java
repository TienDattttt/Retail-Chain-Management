package com.rsm.retailbackend.feature.category.controller;

import com.rsm.retailbackend.feature.category.dto.CategoryDto;
import com.rsm.retailbackend.feature.category.dto.CategoryTreeDto;
import com.rsm.retailbackend.feature.category.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@SecurityRequirement(name = "bearerAuth")

/**
 * CRUD đơn giản cho danh mục
 * - chỉ GET và POST như yêu cầu
 * - upsert gộp create/update
 * - chỉ admin (role=1) được upsert và xóa
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * Lấy danh sách danh mục (chưa xóa)
     */
    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    /**
     * Lấy cấu trúc cây danh mục
     */
    @GetMapping("/tree")
    public ResponseEntity<List<CategoryTreeDto>> getTree() {
        return ResponseEntity.ok(categoryService.getTree());
    }

    /**
     * Upsert danh mục
     * - nếu dto.id == null -> tạo mới
     * - nếu dto.id != null -> cập nhật
     * Chỉ admin được thao tác
     */
    @PostMapping("/upsert")
    @PreAuthorize("hasAuthority('1')")
    public ResponseEntity<MessageResponse> upsert(@RequestBody CategoryDto dto) {
        CategoryDto result = categoryService.upsert(dto);

        String msg = (dto.getId() == null)
                ? "Thêm mới danh mục thành công!"
                : "Cập nhật danh mục thành công!";

        return ResponseEntity.ok(new MessageResponse(msg, result));
    }

    /**
     * Xóa mềm danh mục
     * Chỉ admin được thao tác
     */
    @PostMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('1')")
    public ResponseEntity<MessageResponse> delete(@PathVariable Integer id) {
        categoryService.softDelete(id);
        return ResponseEntity.ok(new MessageResponse(" Đã xóa danh mục.", null));
    }

    private record MessageResponse(String message, Object data) {}

}
