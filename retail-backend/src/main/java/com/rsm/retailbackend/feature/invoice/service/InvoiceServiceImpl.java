package com.rsm.retailbackend.feature.invoice.service;

import com.rsm.retailbackend.entity.Invoice;
import com.rsm.retailbackend.entity.InvoiceDetail;
import com.rsm.retailbackend.feature.invoice.repository.InvoiceDetailRepository;
import com.rsm.retailbackend.feature.invoice.repository.InvoiceRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private final JdbcTemplate jdbcTemplate;
    private final InvoiceRepository invoiceRepository;
    private final InvoiceDetailRepository invoiceDetailRepository;

    public InvoiceServiceImpl(JdbcTemplate jdbcTemplate,
                              InvoiceRepository invoiceRepository,
                              InvoiceDetailRepository invoiceDetailRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.invoiceRepository = invoiceRepository;
        this.invoiceDetailRepository = invoiceDetailRepository;
    }

    @Override
    public Invoice createInvoice(String code,
                                 Integer branchId,
                                 Integer customerId,
                                 BigDecimal total,
                                 BigDecimal totalPayment,
                                 BigDecimal discount,
                                 BigDecimal discountRatio,
                                 String description,
                                 String paymentMethod,
                                 Integer createdBy,
                                 List<InvoiceDetail> details) {

        // 1️⃣ Gọi stored procedure tạo hóa đơn
        String sql = "EXEC sp_CreateInvoiceWithDetails @Code=?, @BranchId=?, @CustomerId=?, " +
                "@Total=?, @TotalPayment=?, @Discount=?, @DiscountRatio=?, " +
                "@Description=?, @PaymentMethod=?, @CreatedBy=?";

        Map<String, Object> result = jdbcTemplate.queryForMap(sql,
                code, branchId, customerId, total, totalPayment,
                discount, discountRatio, description, paymentMethod, createdBy);

        Integer invoiceId = ((Number) result.get("InvoiceId")).intValue();
        Integer statusId = ((Number) result.get("StatusId")).intValue();

        // 2️⃣ Lấy lại đối tượng hóa đơn để lưu chi tiết
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn vừa tạo."));

        // 3️⃣ Lưu chi tiết hóa đơn
        for (InvoiceDetail d : details) {
            d.setInvoice(invoice);
            invoiceDetailRepository.save(d);
        }

        System.out.printf("Hóa đơn %s tạo thành công (StatusId=%d, Method=%s).%n",
                code, statusId, paymentMethod);

        return invoice;
    }
}
