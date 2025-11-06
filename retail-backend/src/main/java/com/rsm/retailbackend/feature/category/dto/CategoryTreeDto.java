package com.rsm.retailbackend.feature.category.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CategoryTreeDto {
    private Integer id;
    private String categoryName;
    private Integer parentId;
    private String description;
    private Integer rank;
    private List<CategoryTreeDto> children = new ArrayList<>();
}
