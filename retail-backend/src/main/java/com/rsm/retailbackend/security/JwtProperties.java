package com.rsm.retailbackend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtProperties {

    @Value("${JWT_SECRET}")
    private String secretKey;

    @Value("${JWT_EXPIRATION:86400000}") // mặc định 1 ngày
    private long expiration;

    public String getSecretKey() {
        return secretKey;
    }

    public long getExpiration() {
        return expiration;
    }
}
