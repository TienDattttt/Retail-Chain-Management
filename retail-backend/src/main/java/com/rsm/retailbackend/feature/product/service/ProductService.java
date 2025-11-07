package com.rsm.retailbackend.feature.product.service;

import com.rsm.retailbackend.feature.product.dto.*;

import java.util.List;

public interface ProductService {

    List<ProductDto> getAll();

    ProductDto getById(Integer id);

    ProductDto getByBarcode(String barcode);

    List<ProductDto> getByCategory(Integer categoryId);

    List<ProductDto> searchByName(String keyword);

    ProductDto upsert(ProductDto dto);

    List<ProductAttributeDto> getAttributes(Integer productId);

    List<ProductInventoryDto> getInventories(Integer productId);

    void bulkCreate(ProductBulkCreateDto dto);

    void bulkUpdate(ProductBulkUpdateDto dto);

    String uploadImage(Integer productId, byte[] bytes, String originalFilename);
}