package com.rsm.retailbackend.feature.replenishment.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReplenishmentRequestDetailDto {
    private Integer productId;
    private Integer quantity;
}
