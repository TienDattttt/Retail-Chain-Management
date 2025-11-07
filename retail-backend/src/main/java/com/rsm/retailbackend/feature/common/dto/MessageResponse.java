package com.rsm.retailbackend.feature.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MessageResponse {
    private String message;
    private Object data;
}