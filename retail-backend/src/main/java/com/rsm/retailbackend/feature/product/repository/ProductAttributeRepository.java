package com.rsm.retailbackend.feature.product.repository;

import com.rsm.retailbackend.entity.ProductAttribute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductAttributeRepository extends JpaRepository<ProductAttribute, Integer> {
    List<ProductAttribute> findByProduct_Id(Integer productId);

    void deleteByProduct_Id(Integer productId);
}