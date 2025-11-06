package com.rsm.retailbackend.feature.supplier.repository;

import com.rsm.retailbackend.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {

    boolean existsByCode(String code);

    Optional<Supplier> findByCode(String code);
}
