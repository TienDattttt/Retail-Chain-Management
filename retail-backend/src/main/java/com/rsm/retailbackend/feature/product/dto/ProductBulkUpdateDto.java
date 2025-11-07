package com.rsm.retailbackend.feature.product.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductBulkUpdateDto {
    private List<ProductDto> items;
}