package com.rsm.retailbackend.feature.replenishment.controller;

import com.rsm.retailbackend.feature.replenishment.dto.*;
import com.rsm.retailbackend.feature.replenishment.service.ReplenishmentRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/replenishment")
@PreAuthorize("hasAnyAuthority('1','2','3')")

public class ReplenishmentRequestController {

    private final ReplenishmentRequestService service;

    public ReplenishmentRequestController(ReplenishmentRequestService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ReplenishmentRequestCreateDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }
}
