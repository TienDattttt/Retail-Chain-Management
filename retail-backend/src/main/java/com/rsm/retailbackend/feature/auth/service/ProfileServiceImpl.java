package com.rsm.retailbackend.feature.auth.service;

import com.rsm.retailbackend.entity.User;
import com.rsm.retailbackend.exception.BusinessException;
import com.rsm.retailbackend.feature.auth.dto.ProfileDto;
import com.rsm.retailbackend.feature.auth.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@Transactional
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;

    public ProfileServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public ProfileDto getCurrentProfile(String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new BusinessException("Không tìm thấy tài khoản", HttpStatus.NOT_FOUND.value()));

        return toDto(user);
    }

    @Override
    public ProfileDto updateCurrentProfile(String username, ProfileDto dto) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new BusinessException("Không tìm thấy tài khoản", HttpStatus.NOT_FOUND.value()));

        // chỉ cho sửa thông tin cá nhân
        if (dto.getGivenName() != null) user.setGivenName(dto.getGivenName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getMobilePhone() != null) user.setMobilePhone(dto.getMobilePhone());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress());
        if (dto.getDescription() != null) user.setDescription(dto.getDescription());
        if (dto.getAvatarUrl() != null) user.setAvatarUrl(dto.getAvatarUrl());

        user.setModifiedDate(Instant.now());

        User saved = userRepository.save(user);
        return toDto(saved);
    }

    private ProfileDto toDto(User u) {
        ProfileDto dto = new ProfileDto();
        dto.setUserId(u.getId());
        dto.setUserName(u.getUserName());
        dto.setGivenName(u.getGivenName());
        dto.setEmail(u.getEmail());
        dto.setMobilePhone(u.getMobilePhone());
        dto.setAddress(u.getAddress());
        dto.setDescription(u.getDescription());
        dto.setAvatarUrl(u.getAvatarUrl());
        dto.setBranchId(u.getBranch() != null ? u.getBranch().getId() : null);
        return dto;
    }
}
