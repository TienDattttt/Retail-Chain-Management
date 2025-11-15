package com.rsm.retailbackend.exception;

public class BusinessException extends RuntimeException {
    private final int status;

    // Constructor cũ – giữ nguyên
    public BusinessException(String message, int status) {
        super(message);
        this.status = status;
    }

    public BusinessException(String message) {
        super(message);
        this.status = 400;
    }

    public int getStatus() {
        return status;
    }
}
