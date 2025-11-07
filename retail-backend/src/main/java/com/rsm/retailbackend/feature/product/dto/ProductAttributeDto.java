package com.rsm.retailbackend.feature.product.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductAttributeDto {
    private Integer id;
    private String attributeName;
    private String attributeValue;
}