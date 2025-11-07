package com.rsm.retailbackend.feature.product.repository;

import com.rsm.retailbackend.entity.ProductInventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductInventoryRepository extends JpaRepository<ProductInventory, Integer> {

    List<ProductInventory> findByProduct_Id(Integer productId);

    Optional<ProductInventory> findByProduct_IdAndBranch_Id(Integer productId, Integer branchId);
}