package com.rsm.retailbackend.feature.category.service;

import com.rsm.retailbackend.feature.category.dto.CategoryDto;
import com.rsm.retailbackend.feature.category.dto.CategoryTreeDto;

import java.util.List;

public interface CategoryService {

    List<CategoryDto> getAll();

    CategoryDto upsert(CategoryDto dto);

    void softDelete(Integer id);

    List<CategoryTreeDto> getTree();
}
