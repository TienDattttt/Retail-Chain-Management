package com.rsm.retailbackend.feature.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserStatusRequest {
    private Integer userId;  // user cần đổi trạng thái
    private Short status;    // 0 = Pending, 1 = Active, 2 = Locked
}
