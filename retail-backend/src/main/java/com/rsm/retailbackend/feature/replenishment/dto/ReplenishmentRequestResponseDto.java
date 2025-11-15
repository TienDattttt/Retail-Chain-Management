package com.rsm.retailbackend.feature.replenishment.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReplenishmentRequestResponseDto {

    private Integer requestId;
    private String requestCode;

    public ReplenishmentRequestResponseDto(Integer requestId, String requestCode) {
        this.requestId = requestId;
        this.requestCode = requestCode;
    }
}
