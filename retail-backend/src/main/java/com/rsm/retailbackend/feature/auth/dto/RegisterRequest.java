package com.rsm.retailbackend.feature.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank
    private String userName;

    @NotBlank
    private String password;

    @NotBlank
    private String givenName;

    private String email;
    private String mobilePhone;
    private Integer branchId;   // cho role 2,3

    @NotNull
    private Short role;         // 1,2,3
}
