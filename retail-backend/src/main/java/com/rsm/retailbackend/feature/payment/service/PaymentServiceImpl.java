package com.rsm.retailbackend.feature.payment.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final JdbcTemplate jdbcTemplate;

    public PaymentServiceImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Integer createPayment(Integer invoiceId, BigDecimal amount, String method, Integer createdBy) {
        if (method == null || method.isBlank()) {
            throw new IllegalArgumentException("Phương thức thanh toán không được để trống.");
        }

        String methodUpper = method.trim().toUpperCase();

        switch (methodUpper) {
            case "CASH":
                return createCashPayment(invoiceId, amount, createdBy);

            case "MOMO":
                // TODO: gọi API tạo giao dịch MoMo sau này
                throw new UnsupportedOperationException("Thanh toán MoMo sẽ được tích hợp sau.");

            case "VNPAY":
                // TODO: gọi API VNPAY sau này
                throw new UnsupportedOperationException("Thanh toán VNPAY sẽ được tích hợp sau.");

            default:
                throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ: " + method);
        }
    }

    private Integer createCashPayment(Integer invoiceId, BigDecimal amount, Integer createdBy) {
        String sql = "EXEC sp_CreateCashPayment @InvoiceId=?, @Amount=?, @CreatedBy=?";
        Map<String, Object> result = jdbcTemplate.queryForMap(sql, invoiceId, amount, createdBy);

        Integer paymentId = ((Number) result.get("PaymentId")).intValue();
        String status = (String) result.get("Status");

        System.out.printf("Thanh toán tiền mặt thành công. PaymentId=%d, Status=%s%n", paymentId, status);
        return paymentId;
    }
}
