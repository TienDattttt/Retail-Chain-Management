package com.rsm.retailbackend.feature.category.service;

import com.rsm.retailbackend.entity.Category;
import com.rsm.retailbackend.exception.BusinessException;
import com.rsm.retailbackend.feature.category.dto.CategoryDto;
import com.rsm.retailbackend.feature.category.dto.CategoryTreeDto;
import com.rsm.retailbackend.feature.category.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<CategoryDto> getAll() {
        return categoryRepository.findByIsDeletedFalse()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDto upsert(CategoryDto dto) {
        Category category;

        // update
        if (dto.getId() != null) {
            category = categoryRepository.findById(dto.getId())
                    .orElseThrow(() -> new BusinessException("Danh mục không tồn tại", HttpStatus.NOT_FOUND.value()));
            category.setModifiedDate(Instant.now());
        } else {
            // create
            category = new Category();
            category.setCreatedDate(Instant.now());
            category.setIsDeleted(false);
        }

        category.setCategoryName(dto.getCategoryName());
        category.setDescription(dto.getDescription());
        category.setRank(dto.getRank());

        // set parent
        if (dto.getParentId() != null) {
            if (dto.getId() != null && dto.getId().equals(dto.getParentId())) {
                throw new BusinessException("Danh mục cha không được trùng với chính nó", HttpStatus.BAD_REQUEST.value());
            }
            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new BusinessException("Danh mục cha không tồn tại", HttpStatus.BAD_REQUEST.value()));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        Category saved = categoryRepository.save(category);
        return toDto(saved);
    }

    @Override
    public void softDelete(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Danh mục không tồn tại", HttpStatus.NOT_FOUND.value()));

        category.setIsDeleted(true);
        category.setModifiedDate(Instant.now());
        categoryRepository.save(category);
    }

    @Override
    public List<CategoryTreeDto> getTree() {
        List<Category> categories = categoryRepository.findByIsDeletedFalse();

        // map id -> dto
        Map<Integer, CategoryTreeDto> map = new HashMap<>();
        for (Category c : categories) {
            CategoryTreeDto dto = toTreeDto(c);
            map.put(c.getId(), dto);
        }

        // build tree
        List<CategoryTreeDto> roots = new ArrayList<>();
        for (Category c : categories) {
            CategoryTreeDto node = map.get(c.getId());
            if (c.getParent() != null) {
                CategoryTreeDto parentNode = map.get(c.getParent().getId());
                if (parentNode != null) {
                    parentNode.getChildren().add(node);
                }
            } else {
                roots.add(node);
            }
        }

        // sort children by rank if needed
        roots.forEach(this::sortChildrenRecursive);
        return roots;
    }

    private void sortChildrenRecursive(CategoryTreeDto node) {
        node.getChildren().sort(Comparator.comparing(
                c -> c.getRank() == null ? 0 : c.getRank()
        ));
        node.getChildren().forEach(this::sortChildrenRecursive);
    }

    private CategoryDto toDto(Category c) {
        CategoryDto dto = new CategoryDto();
        dto.setId(c.getId());
        dto.setCategoryName(c.getCategoryName());
        dto.setParentId(c.getParent() != null ? c.getParent().getId() : null);
        dto.setDescription(c.getDescription());
        dto.setRank(c.getRank());
        dto.setIsDeleted(c.getIsDeleted());
        dto.setCreatedDate(c.getCreatedDate());
        dto.setModifiedDate(c.getModifiedDate());
        return dto;
    }

    private CategoryTreeDto toTreeDto(Category c) {
        CategoryTreeDto dto = new CategoryTreeDto();
        dto.setId(c.getId());
        dto.setCategoryName(c.getCategoryName());
        dto.setParentId(c.getParent() != null ? c.getParent().getId() : null);
        dto.setDescription(c.getDescription());
        dto.setRank(c.getRank());
        return dto;
    }
}
