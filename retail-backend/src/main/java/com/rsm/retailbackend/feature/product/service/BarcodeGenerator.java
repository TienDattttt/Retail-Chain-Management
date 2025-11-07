package com.rsm.retailbackend.feature.product.service;

import java.security.SecureRandom;

public class BarcodeGenerator {
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generate13Digits() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 13; i++) {
            sb.append(RANDOM.nextInt(10));
        }
        return sb.toString();
    }
}