package com.rsm.retailbackend.feature.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileDto {
    private Integer userId;
    private String userName;   // chỉ xem, không sửa
    private String givenName;
    private String email;
    private String mobilePhone;
    private String address;
    private String description;
    private String avatarUrl;
    private Integer branchId;  // chỉ xem, không cho đổi ở đây (tùy bạn)
}
