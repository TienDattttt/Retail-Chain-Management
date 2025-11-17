package com.rsm.retailbackend.feature.product.repository;

import com.rsm.retailbackend.entity.ProductUnit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductUnitRepository extends JpaRepository<ProductUnit, Integer> {

    List<ProductUnit> findByProduct_Id(Integer productId);

    void deleteByProduct_Id(Integer productId);
}