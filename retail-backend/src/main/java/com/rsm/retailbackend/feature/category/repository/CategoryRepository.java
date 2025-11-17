package com.rsm.retailbackend.feature.category.repository;

import com.rsm.retailbackend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByIsDeletedFalse();
}