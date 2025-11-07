package com.rsm.retailbackend.feature.product.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductBulkCreateDto {
    private List<ProductDto> items;
}