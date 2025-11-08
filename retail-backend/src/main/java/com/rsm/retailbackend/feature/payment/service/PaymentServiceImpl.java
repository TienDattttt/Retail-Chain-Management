package com.rsm.retailbackend.feature.payment.service;

import com.rsm.retailbackend.feature.payment.dto.CreateMomoResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final JdbcTemplate jdbcTemplate;
    private final MomoService momoService;

    public PaymentServiceImpl(JdbcTemplate jdbcTemplate, MomoService momoService) {
        this.jdbcTemplate = jdbcTemplate;
        this.momoService = momoService;
    }

    @Override
    public Object createPayment(Integer invoiceId, BigDecimal amount, String method, Integer createdBy) {
        if (method == null || method.isBlank()) {
            throw new IllegalArgumentException("Phương thức thanh toán không được để trống.");
        }

        String methodUpper = method.trim().toUpperCase();

        switch (methodUpper) {
            case "CASH":
                return createCashPayment(invoiceId, amount, createdBy);

            case "MOMO":
                return createMomoPayment(invoiceId, amount, createdBy);

            case "VNPAY":
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

    private Map<String, Object> createMomoPayment(Integer invoiceId, BigDecimal amount, Integer createdBy) {
        String orderId = UUID.randomUUID().toString();
        String orderInfo = "Thanh toán đơn hàng: " + invoiceId;
        long amountLong = amount.longValue();

        CreateMomoResponse response = momoService.createQR(orderId, orderInfo, amountLong);

        if (response == null || response.getPayUrl() == null) {
            throw new RuntimeException("Không thể tạo giao dịch MoMo.");
        }

        // Lưu Payment vào DB
        String sql = "EXEC sp_CreateMomoPayment @InvoiceId=?, @Amount=?, @TransactionCode=?, @CreatedBy=?";
        Map<String, Object> result = jdbcTemplate.queryForMap(sql,
                invoiceId, amount, response.getOrderId(), createdBy);

        Integer paymentId = ((Number) result.get("PaymentId")).intValue();

        // Lưu link thanh toán vào RawResponse (để truy vết)
        jdbcTemplate.update(
                "UPDATE Payments SET RawResponse=? WHERE PaymentId=?",
                response.getPayUrl(), paymentId
        );

        System.out.printf("Tạo payment MOMO thành công. PaymentId=%d, RedirectURL=%s%n",
                paymentId, response.getPayUrl());

        // Trả về cả paymentId và payUrl
        return Map.of(
                "paymentId", paymentId,
                "payUrl", response.getPayUrl()
        );
    }

    public void confirmMomoPayment(String transactionCode, BigDecimal amount, Long transId) {
        try {
            String sql = "EXEC sp_ConfirmMomoPayment @TransactionCode=?, @Amount=?, @TransId=?";
            Map<String, Object> result = jdbcTemplate.queryForMap(sql, transactionCode, amount, transId);

            Integer invoiceId = ((Number) result.get("InvoiceId")).intValue();
            System.out.printf("Đã xác nhận thanh toán MOMO cho InvoiceId=%d (Transaction=%s)%n", invoiceId, transactionCode);
        } catch (Exception e) {
            System.err.printf("⚠Lỗi xác nhận MOMO: %s%n", e.getMessage());
        }
    }



}
