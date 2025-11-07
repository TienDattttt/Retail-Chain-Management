package com.rsm.retailbackend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        // cho phép đăng nhập / đăng ký
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/profile/**").authenticated()

                        // chỉ admin tổng mới được xem hoặc duyệt user
                        .requestMatchers(HttpMethod.GET, "/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/users/**").hasRole("ADMIN")


                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/categories/upsert").hasAuthority("1")
                        .requestMatchers(HttpMethod.POST, "/api/suppliers/upsert").hasAuthority("1")
                        .requestMatchers(HttpMethod.POST, "/api/voucher-campaigns/upsert").hasAuthority("1") // đúng path
                        .requestMatchers(HttpMethod.POST, "/api/vouchers/upsert").hasAuthority("1")
                        .requestMatchers(HttpMethod.POST, "/api/products/upsert").hasAuthority("1")
                        .requestMatchers(HttpMethod.POST, "/api/products/bulk-create").hasAuthority("1")
                        .requestMatchers(HttpMethod.POST, "/api/products/bulk-update").hasAuthority("1")



                        // còn lại phải đăng nhập
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
