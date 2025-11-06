package com.rsm.retailbackend.feature.auth.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserSummaryDto {
    private Integer userId;
    private String userName;
    private String givenName;
    private Short role;
    private boolean active;
    private String branchName;
    private Short status; // 0 = Pending, 1 = Active, 2 = Locked
}
