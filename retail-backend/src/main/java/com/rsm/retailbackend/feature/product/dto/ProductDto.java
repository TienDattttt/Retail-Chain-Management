package com.rsm.retailbackend.feature.product.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
    private Integer id;
    private String code;
    private String name;
    private Integer categoryId;
    private BigDecimal basePrice;
    private BigDecimal retailPrice;
    private BigDecimal weight;
    private String unit;
    private Boolean allowsSale;
    private String status;     // Active | Inactive | Deleted
    private String description;
    private String barcode;
    private String imageUrl;
    private Instant createdDate;
    private Instant modifiedDate;
    private Integer statusId;
    private String statusCode;
    // để tạo/sửa thuộc tính nhanh
    private List<ProductAttributeDto> attributes;

    // để tạo/sửa đơn vị sản phẩm
    private List<ProductUnitDto> units;

    // nếu = true và barcode trống thì server tự sinh
    private Boolean autoGenerateBarcode;
    
    // Thông tin tồn kho (chỉ dùng khi cần hiển thị tồn kho)
    private Integer stock;
    private Integer availableStock;
}