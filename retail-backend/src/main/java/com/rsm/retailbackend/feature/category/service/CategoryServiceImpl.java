package com.rsm.retailbackend.feature.category.service;

import com.rsm.retailbackend.entity.Category;
import com.rsm.retailbackend.feature.category.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllActiveCategories() {
        return categoryRepository.findByIsDeletedFalse();
    }

    @Override
    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Override
    public Category createCategory(Category category) {
        category.setCreatedDate(Instant.now());
        category.setIsDeleted(false);
        return categoryRepository.save(category);
    }
}