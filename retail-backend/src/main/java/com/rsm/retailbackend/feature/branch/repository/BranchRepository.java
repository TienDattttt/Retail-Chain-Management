package com.rsm.retailbackend.feature.branch.repository;

import com.rsm.retailbackend.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BranchRepository extends JpaRepository<Branch, Integer> {
}
