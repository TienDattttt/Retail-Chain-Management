package com.rsm.retailbackend.feature.auth.controller;

import com.rsm.retailbackend.feature.auth.dto.ProfileDto;
import com.rsm.retailbackend.feature.auth.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    /**
     * Lấy thông tin hồ sơ của chính user đang đăng nhập
     */
    @GetMapping("/me")
    public ResponseEntity<ProfileDto> getMyProfile(Authentication authentication) {
        String username = authentication.getName();
        ProfileDto dto = profileService.getCurrentProfile(username);
        return ResponseEntity.ok(dto);
    }

    /**
     * Cập nhật hồ sơ của chính user đang đăng nhập
     * KHÔNG đổi password, KHÔNG đổi role, KHÔNG đổi status
     */
    @PostMapping("/me")
    public ResponseEntity<MessageResponse> updateMyProfile(
            Authentication authentication,
            @RequestBody ProfileDto request
    ) {
        String username = authentication.getName();
        ProfileDto updated = profileService.updateCurrentProfile(username, request);
        return ResponseEntity.ok(new MessageResponse("Cập nhật hồ sơ thành công", updated));
    }

    private record MessageResponse(String message, Object data) {}
}
