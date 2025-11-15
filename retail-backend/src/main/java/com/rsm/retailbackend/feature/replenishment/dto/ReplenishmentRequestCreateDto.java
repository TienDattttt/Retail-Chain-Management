package com.rsm.retailbackend.feature.replenishment.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class ReplenishmentRequestCreateDto {

    private Integer branchId;
    private String description;
    private Integer createdBy;

    private List<ReplenishmentRequestDetailDto> items;
}
