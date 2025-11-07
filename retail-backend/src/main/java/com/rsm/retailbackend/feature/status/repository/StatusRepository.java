
package com.rsm.retailbackend.feature.status.repository;

import com.rsm.retailbackend.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StatusRepository extends JpaRepository<Status, Integer> {
    Optional<Status> findByEntityTypeAndCode(String entityType, String code);
}
