package com.rsm.retailbackend.feature.payment.service;

import java.math.BigDecimal;

import java.math.BigDecimal;

public interface PaymentService {
    Object createPayment(Integer invoiceId, BigDecimal amount, String method, Integer createdBy);
}
