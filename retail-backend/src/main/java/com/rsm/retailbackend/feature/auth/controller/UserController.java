package com.rsm.retailbackend.feature.auth.controller;

import com.rsm.retailbackend.entity.User;
import com.rsm.retailbackend.exception.BusinessException;
import com.rsm.retailbackend.feature.auth.dto.UserSummaryDto;
import com.rsm.retailbackend.feature.auth.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Quản lý người dùng trong hệ thống.
 * Admin có thể xem danh sách, kích hoạt, hoặc khóa tài khoản nhân viên / quản lý chi nhánh.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     *  Lấy danh sách toàn bộ người dùng
     */
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        List<UserSummaryDto> users = userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    /**
     *  Lấy danh sách người dùng đang hoạt động (Status = 1)
     */
    @GetMapping("/active")
    public ResponseEntity<?> getActiveUsers() {
        List<UserSummaryDto> users = userRepository.findAll().stream()
                .filter(u -> u.getStatus() == 1)
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    /**
     *  Lấy danh sách người dùng đang chờ kích hoạt (Status = 0)
     */
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingUsers() {
        List<UserSummaryDto> users = userRepository.findAll().stream()
                .filter(u -> u.getStatus() == 0)
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    /**
     *  Lấy danh sách người dùng bị khóa (Status = 2)
     */
    @GetMapping("/locked")
    public ResponseEntity<?> getLockedUsers() {
        List<UserSummaryDto> users = userRepository.findAll().stream()
                .filter(u -> u.getStatus() == 2)
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    /**
     *  Admin kích hoạt tài khoản
     */
    @PatchMapping("/{id}/activate")
    public ResponseEntity<?> activateUser(@PathVariable Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND.value()));

        if (user.getStatus() == 1) {
            throw new BusinessException("Tài khoản này đã được kích hoạt", HttpStatus.BAD_REQUEST.value());
        }

        user.setIsActive(true);
        user.setStatus((short) 1);
        userRepository.save(user);

        return ResponseEntity.ok(new ResponseMessage(
                "Tài khoản " + user.getUserName() + " đã được kích hoạt thành công."
        ));
    }

    /**
     *  Admin khóa tài khoản nhân viên / quản lý chi nhánh
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND.value()));

        if (user.getStatus() == 2) {
            throw new BusinessException("Tài khoản này đã bị khóa trước đó", HttpStatus.BAD_REQUEST.value());
        }

        user.setIsActive(false);
        user.setStatus((short) 2);
        userRepository.save(user);

        return ResponseEntity.ok(new ResponseMessage(
                "Tài khoản " + user.getUserName() + " đã bị khóa."
        ));
    }

    /**
     *  Chuyển Entity → DTO gọn gàng
     */
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

    /**
     * Lớp nội bộ để trả phản hồi JSON thống nhất
     */
    private record ResponseMessage(String thongBao) {}
}
