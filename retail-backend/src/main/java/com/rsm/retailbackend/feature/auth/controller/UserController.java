package com.rsm.retailbackend.feature.auth.controller;

import com.rsm.retailbackend.entity.User;
import com.rsm.retailbackend.exception.BusinessException;
import com.rsm.retailbackend.feature.auth.dto.UpdateUserStatusRequest;
import com.rsm.retailbackend.feature.auth.dto.UserSummaryDto;
import com.rsm.retailbackend.feature.auth.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Quản lý tài khoản người dùng (dành cho admin).
 * Chỉ đổi trạng thái: pending / active / locked.
 * Không đổi mật khẩu, không đổi thông tin cá nhân ở đây.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Lấy danh sách toàn bộ người dùng
     */
    @GetMapping
    @PreAuthorize("hasAuthority('1')") // chỉ admin
    public ResponseEntity<List<UserSummaryDto>> getAllUsers() {
        List<UserSummaryDto> users = userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    /**
     * Lấy thông tin chi tiết 1 user
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('1')")
    public ResponseEntity<UserSummaryDto> getUserById(@PathVariable Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND.value()));
        return ResponseEntity.ok(toDto(user));
    }

    /**
     * Admin cập nhật trạng thái account
     * body: { "userId": 5, "status": 1 }
     */
    @PostMapping("/status")
    @PreAuthorize("hasAuthority('1')")
    public ResponseEntity<MessageResponse> updateStatus(@RequestBody UpdateUserStatusRequest req) {
        if (req.getUserId() == null || req.getStatus() == null) {
            throw new BusinessException("Thiếu userId hoặc status", HttpStatus.BAD_REQUEST.value());
        }

        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND.value()));

        // chỉ cho phép 0,1,2
        if (req.getStatus() < 0 || req.getStatus() > 2) {
            throw new BusinessException("Trạng thái không hợp lệ", HttpStatus.BAD_REQUEST.value());
        }

        // đồng bộ IsActive với Status
        user.setStatus(req.getStatus());
        if (req.getStatus() == 1) {
            user.setIsActive(true);   // Active
        } else {
            user.setIsActive(false);  // Pending hoặc Locked
        }

        userRepository.save(user);

        String msg = switch (req.getStatus()) {
            case 0 -> "Đã chuyển tài khoản về trạng thái chờ duyệt (Pending).";
            case 1 -> "Đã kích hoạt tài khoản.";
            case 2 -> "Đã khóa tài khoản.";
            default -> "Cập nhật trạng thái tài khoản.";
        };

        return ResponseEntity.ok(new MessageResponse(msg));
    }

    private UserSummaryDto toDto(User u) {
        return new UserSummaryDto(
                u.getId(),
                u.getUserName(),
                u.getGivenName(),
                u.getRole(),
                Boolean.TRUE.equals(u.getIsActive()),
                u.getBranch() != null ? u.getBranch().getName() : null,
                u.getStatus()
        );
    }

    private record MessageResponse(String message) {}
}
