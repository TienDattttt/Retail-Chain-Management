package com.rsm.retailbackend.feature.product.controller;

import com.rsm.retailbackend.feature.common.dto.MessageResponse;
import com.rsm.retailbackend.feature.product.dto.*;
import com.rsm.retailbackend.feature.product.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Lấy tất cả sản phẩm (đang Active)
    @GetMapping
    public ResponseEntity<List<ProductDto>> getAll() {
        return ResponseEntity.ok(productService.getAll());
    }

    // Lấy theo id
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    // Lấy theo barcode (để POS / mobile quét)
    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<ProductDto> getByBarcode(@PathVariable String barcode) {
        return ResponseEntity.ok(productService.getByBarcode(barcode));
    }

    // Lấy theo danh mục
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductDto>> getByCategory(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(productService.getByCategory(categoryId));
    }

    // Tìm kiếm theo tên
    @GetMapping("/search")
    public ResponseEntity<List<ProductDto>> search(@RequestParam("q") String keyword) {
        return ResponseEntity.ok(productService.searchByName(keyword));
    }

    // Lấy thuộc tính sản phẩm
    @GetMapping("/{id}/attributes")
    public ResponseEntity<List<ProductAttributeDto>> getAttributes(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getAttributes(id));
    }

    // Lấy tồn kho của sản phẩm
    @GetMapping("/{id}/inventories")
    public ResponseEntity<List<ProductInventoryDto>> getInventories(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getInventories(id));
    }

    // Upsert (create/update/soft delete) – chỉ admin
    @PostMapping("/upsert")
    @PreAuthorize("hasAuthority('1')")
    public ResponseEntity<MessageResponse> upsert(@RequestBody ProductDto dto) {
        ProductDto saved = productService.upsert(dto);

        String msg;
        if ("Deleted".equalsIgnoreCase(saved.getStatus())) {
            msg = "Đã xóa (mềm) sản phẩm.";
        } else if (dto.getId() == null) {
            msg = "Thêm mới sản phẩm thành công!";
        } else {
            msg = "Cập nhật sản phẩm thành công!";
        }

        return ResponseEntity.ok(new MessageResponse(msg, saved));
    }

    // Upload ảnh lên cloudinary
    @PostMapping("/{id}/image")
    @PreAuthorize("hasAuthority('1')")
    public ResponseEntity<MessageResponse> uploadImage(@PathVariable Integer id,
                                                       @RequestParam("file") MultipartFile file) throws IOException {
        String url = productService.uploadImage(id, file.getBytes(), file.getOriginalFilename());
        return ResponseEntity.ok(new MessageResponse("Upload ảnh thành công", url));
    }

    // Bulk create
    @PostMapping("/bulk-create")
    @PreAuthorize("hasAuthority('1')")
    public ResponseEntity<MessageResponse> bulkCreate(@RequestBody ProductBulkCreateDto dto) {
        productService.bulkCreate(dto);
        return ResponseEntity.ok(new MessageResponse("Tạo nhiều sản phẩm thành công"));
    }

    // Bulk update
    @PostMapping("/bulk-update")
    @PreAuthorize("hasAuthority('1')")
    public ResponseEntity<MessageResponse> bulkUpdate(@RequestBody ProductBulkUpdateDto dto) {
        productService.bulkUpdate(dto);
        return ResponseEntity.ok(new MessageResponse("Cập nhật nhiều sản phẩm thành công"));
    }
}