package com.rsm.retailbackend.feature.category.service;

import com.rsm.retailbackend.entity.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getAllActiveCategories();
    Category getCategoryById(Integer id);
    Category createCategory(Category category);
}