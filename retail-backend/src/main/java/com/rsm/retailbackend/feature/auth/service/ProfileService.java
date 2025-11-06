package com.rsm.retailbackend.feature.auth.service;

import com.rsm.retailbackend.feature.auth.dto.ProfileDto;

public interface ProfileService {

    ProfileDto getCurrentProfile(String username);

    ProfileDto updateCurrentProfile(String username, ProfileDto dto);
}
