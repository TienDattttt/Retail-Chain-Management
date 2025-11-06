package com.rsm.retailbackend.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Bắt tất cả exception và trả JSON gọn cho FE.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<?> handleBusinessException(BusinessException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("thoiGian", LocalDateTime.now());
        body.put("maLoi", ex.getStatus());
        body.put("thongBao", ex.getMessage());
        return ResponseEntity.status(ex.getStatus()).body(body);
    }

    // fallback cho lỗi không lường trước
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleOtherException(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("thoiGian", LocalDateTime.now());
        body.put("maLoi", 500);
        body.put("thongBao", "Lỗi hệ thống. Vui lòng thử lại sau.");
        return ResponseEntity.internalServerError().body(body);
    }
}
