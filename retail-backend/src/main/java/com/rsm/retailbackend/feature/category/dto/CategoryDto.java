package com.rsm.retailbackend.feature.category.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class CategoryDto {
    private Integer id;
    private String categoryName;
    private Integer parentId;
    private String description;
    private Integer rank;
    private Boolean isDeleted;
    private Instant createdDate;
    private Instant modifiedDate;
}
