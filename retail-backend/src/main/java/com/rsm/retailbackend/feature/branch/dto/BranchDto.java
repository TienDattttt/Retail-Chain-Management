package com.rsm.retailbackend.feature.branch.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BranchDto {
    private Integer id;
    private String branchCode;
    private String name;
    private String address;
    private String wardName;
    private String districtName;
    private String cityName;
    private String phoneNumber;
    private String email;
    private Boolean isActive;
    private Boolean isMain;
    private Integer parentId;
    private Integer level;
    private String createdBy;
    private Instant createdDate;
    private Instant modifiedDate;
    private BigDecimal latitude;
    private BigDecimal longitude;

}
