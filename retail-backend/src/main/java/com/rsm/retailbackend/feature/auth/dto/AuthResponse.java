package com.rsm.retailbackend.feature.auth.dto;

import com.rsm.retailbackend.entity.Branch;
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
    private Branch branch;
    
    public AuthResponse(Integer userId, String userName, String givenName, Short role, boolean active, String token) {
        this.userId = userId;
        this.userName = userName;
        this.givenName = givenName;
        this.role = role;
        this.active = active;
        this.token = token;
    }
}

