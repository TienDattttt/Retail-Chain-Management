package com.rsm.retailbackend.feature.invoice.repository;

import com.rsm.retailbackend.entity.Invoice;
import com.rsm.retailbackend.entity.InvoiceDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceDetailRepository extends JpaRepository<InvoiceDetail, Integer> {

    // 🔹 Lấy tất cả chi tiết theo hóa đơn
    List<InvoiceDetail> findByInvoice(Invoice invoice);
}
