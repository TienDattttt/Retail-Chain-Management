package com.rsm.retailbackend.feature.product.service;

import com.rsm.retailbackend.feature.product.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {

    List<ProductDto> getAll();
    
    Page<ProductDto> getAllPaged(Pageable pageable);

    ProductDto getById(Integer id);

    ProductDto getByBarcode(String barcode);

    List<ProductDto> getByCategory(Integer categoryId);

    List<ProductDto> searchByName(String keyword);
    
    Page<ProductDto> searchByNamePaged(String keyword, Pageable pageable);

    ProductDto upsert(ProductDto dto);

    List<ProductAttributeDto> getAttributes(Integer productId);

    List<ProductUnitDto> getUnits(Integer productId);

    List<ProductInventoryDto> getInventories(Integer productId);

    void bulkCreate(ProductBulkCreateDto dto);

    void bulkUpdate(ProductBulkUpdateDto dto);

    String uploadImage(Integer productId, byte[] bytes, String originalFilename);
    
    // Lấy sản phẩm với thông tin tồn kho theo kho/chi nhánh
    List<ProductDto> getAllWithStock(Integer warehouseId, Integer branchId);
}