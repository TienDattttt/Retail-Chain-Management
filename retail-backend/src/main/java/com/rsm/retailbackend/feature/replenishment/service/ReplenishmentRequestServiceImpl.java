package com.rsm.retailbackend.feature.replenishment.service;

import com.rsm.retailbackend.feature.replenishment.dto.*;
import com.rsm.retailbackend.feature.replenishment.repository.ReplenishmentRequestRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class ReplenishmentRequestServiceImpl implements ReplenishmentRequestService {

    private final ReplenishmentRequestRepository repo;

    public ReplenishmentRequestServiceImpl(ReplenishmentRequestRepository repo) {
        this.repo = repo;
    }

    @Override
    public ReplenishmentRequestResponseDto create(ReplenishmentRequestCreateDto dto) {

        // 1. tạo request
        var header = repo.createRequest(
                dto.getBranchId(),
                dto.getDescription(),
                dto.getCreatedBy()
        );

        Integer requestId = (Integer) header.get("requestId");

        // 2. thêm detail
        dto.getItems().forEach(i ->
                repo.addDetail(requestId, i.getProductId(), i.getQuantity())
        );

        return new ReplenishmentRequestResponseDto(
                requestId,
                (String) header.get("requestCode")
        );
    }
}
