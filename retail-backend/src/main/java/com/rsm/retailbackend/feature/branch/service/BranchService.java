package com.rsm.retailbackend.feature.branch.service;

import com.rsm.retailbackend.feature.branch.dto.BranchDto;
import java.util.List;

public interface BranchService {
    List<BranchDto> getAll();
    BranchDto getById(Integer id);
    BranchDto upsert(BranchDto dto);
}
