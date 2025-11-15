package com.rsm.retailbackend.feature.replenishment.service;

import com.rsm.retailbackend.feature.replenishment.dto.ReplenishmentRequestCreateDto;
import com.rsm.retailbackend.feature.replenishment.dto.ReplenishmentRequestResponseDto;

public interface ReplenishmentRequestService {
    ReplenishmentRequestResponseDto create(ReplenishmentRequestCreateDto dto);
}
