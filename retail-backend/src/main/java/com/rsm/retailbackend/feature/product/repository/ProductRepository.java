package com.rsm.retailbackend.feature.product.repository;

import com.rsm.retailbackend.entity.Product;
import com.rsm.retailbackend.entity.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByStatus(Status status);

    List<Product> findByStatusNot(Status status);
    
    Page<Product> findByStatusNot(Status status, Pageable pageable);

    List<Product> findByCategory_IdAndStatus(Integer categoryId, Status  status);

    List<Product> findByNameContainingIgnoreCase(String name);
    
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Optional<Product> findByBarcode(String barcode);

    boolean existsByBarcode(String barcode);
}