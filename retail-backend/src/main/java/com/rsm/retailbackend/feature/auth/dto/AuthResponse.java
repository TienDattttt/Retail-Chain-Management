package com.rsm.retailbackend.feature.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private Integer userId;
    private String userName;
    private String givenName;
    private Short role;
    private boolean active;
    private String token;
}

