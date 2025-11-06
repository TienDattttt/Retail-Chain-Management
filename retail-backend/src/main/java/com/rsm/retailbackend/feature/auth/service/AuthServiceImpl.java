package com.rsm.retailbackend.feature.auth.service;

import com.rsm.retailbackend.entity.Branch;
import com.rsm.retailbackend.entity.User;
import com.rsm.retailbackend.feature.auth.dto.AuthResponse;
import com.rsm.retailbackend.feature.auth.dto.LoginRequest;
import com.rsm.retailbackend.feature.auth.dto.RegisterRequest;
import com.rsm.retailbackend.feature.auth.repository.UserRepository;
import com.rsm.retailbackend.feature.branch.repository.BranchRepository;
import com.rsm.retailbackend.security.JwtUtils;
import com.rsm.retailbackend.exception.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthServiceImpl(UserRepository userRepository,
                           BranchRepository branchRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.branchRepository = branchRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByUserName(request.getUserName())) {
            throw new BusinessException("Tên đăng nhập đã tồn tại", HttpStatus.BAD_REQUEST.value());
        }
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email đã tồn tại", HttpStatus.BAD_REQUEST.value());
        }

        User user = new User();
        user.setUserName(request.getUserName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setGivenName(request.getGivenName());
        user.setEmail(request.getEmail());
        user.setMobilePhone(request.getMobilePhone());
        user.setRole(request.getRole());
        user.setCreatedDate(Instant.now());

        // Nếu là quản lý / nhân viên chi nhánh
        if (request.getRole() == 2 || request.getRole() == 3) {
            if (request.getBranchId() == null) {
                throw new BusinessException("Vui lòng chọn chi nhánh khi đăng ký vai trò này", HttpStatus.BAD_REQUEST.value());
            }
            Branch branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new BusinessException("Không tìm thấy chi nhánh", HttpStatus.NOT_FOUND.value()));
            user.setBranch(branch);
            user.setIsActive(false);
            user.setStatus((short) 0); // PENDING
        } else if (request.getRole() == 1) {
            user.setIsActive(true);
            user.setStatus((short) 1); // ACTIVE
        } else {
            user.setIsActive(false);
            user.setStatus((short) 0); // default pending
        }

        User saved = userRepository.save(user);

        String msg = saved.getIsActive()
                ? "Đăng ký thành công và đã được kích hoạt"
                : "Đăng ký thành công, vui lòng chờ quản trị viên duyệt";

        return new AuthResponse(
                saved.getId(),
                saved.getUserName(),
                saved.getGivenName(),
                saved.getRole(),
                saved.getIsActive(),
                msg
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUserName(request.getUserName())
                .orElseThrow(() -> new BusinessException("Sai tên đăng nhập hoặc mật khẩu", HttpStatus.UNAUTHORIZED.value()));

        if (user.getStatus() == null || user.getStatus() != 1) {
            throw new BusinessException("Tài khoản chưa được kích hoạt hoặc đã bị khóa", HttpStatus.FORBIDDEN.value());
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException("Sai tên đăng nhập hoặc mật khẩu", HttpStatus.UNAUTHORIZED.value());
        }

        String token = jwtUtils.generateToken(user.getUserName(), String.valueOf(user.getRole()));

        return new AuthResponse(
                user.getId(),
                user.getUserName(),
                user.getGivenName(),
                user.getRole(),
                true,
                token
        );
    }
}
