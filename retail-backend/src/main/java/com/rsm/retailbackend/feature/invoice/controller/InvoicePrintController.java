package com.rsm.retailbackend.feature.invoice.controller;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.rsm.retailbackend.entity.Invoice;
import com.rsm.retailbackend.entity.InvoiceDetail;
import com.rsm.retailbackend.feature.invoice.repository.InvoiceDetailRepository;
import com.rsm.retailbackend.feature.invoice.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoicePrintController {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceDetailRepository invoiceDetailRepository;

    @GetMapping("/{id}/print")
    public ResponseEntity<ByteArrayResource> printInvoice(@PathVariable Integer id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));

        List<InvoiceDetail> details = invoiceDetailRepository.findByInvoice(invoice);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A6, 25, 25, 15, 15);
            PdfWriter.getInstance(doc, out);
            doc.open();

            //Font Unicode tiếng Việt
            BaseFont bf = BaseFont.createFont(
                    "c:/windows/fonts/arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            Font titleFont = new Font(bf, 12, Font.BOLD);
            Font text = new Font(bf, 9);
            Font bold = new Font(bf, 9, Font.BOLD);

            NumberFormat nf = new DecimalFormat("#,###");

            // ===================== HEADER =====================
            Paragraph header = new Paragraph("PHIẾU THANH TOÁN RSM MART", titleFont);
            header.setAlignment(Element.ALIGN_CENTER);
            doc.add(header);

            Paragraph branch = new Paragraph("Chi nhánh: " +
                    (invoice.getBranch() != null ? invoice.getBranch().getName() : "Trung tâm"), text);
            branch.setAlignment(Element.ALIGN_CENTER);
            doc.add(branch);

            doc.add(new Paragraph("--------------------------------------------", text));

            LocalDateTime date = LocalDateTime.ofInstant(invoice.getCreatedDate(), ZoneId.systemDefault());
            Paragraph info = new Paragraph(
                    "Mã hóa đơn: " + invoice.getCode() + "\n" +
                            "Ngày: " + date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) + "\n" +
                            "Khách hàng: " + (invoice.getCustomer() != null ? invoice.getCustomer().getName() : "Khách lẻ"),
                    text
            );
            doc.add(info);
            doc.add(new Paragraph(" "));

            // ===================== BẢNG SẢN PHẨM =====================
            PdfPTable table = new PdfPTable(new float[]{3.5f, 0.9f, 2f, 2f});
            table.setWidthPercentage(100);

            addHeaderCell(table, "Tên sản phẩm", bold);
            addHeaderCell(table, "SL", bold);
            addHeaderCell(table, "Giá bán", bold);
            addHeaderCell(table, "Thành tiền", bold);

            for (InvoiceDetail d : details) {
                BigDecimal lineTotal = d.getUnitPrice().multiply(BigDecimal.valueOf(d.getQuantity()));

                addTextCell(table, d.getProduct() != null ? d.getProduct().getName() : "Sản phẩm", text, Element.ALIGN_LEFT);
                addTextCell(table, String.valueOf(d.getQuantity()), text, Element.ALIGN_CENTER);
                addTextCell(table, nf.format(d.getUnitPrice()) + "đ", text, Element.ALIGN_RIGHT);
                addTextCell(table, nf.format(lineTotal) + "đ", text, Element.ALIGN_RIGHT);
            }

            doc.add(table);
            doc.add(new Paragraph("--------------------------------------------", text));

            // ===================== TỔNG TIỀN =====================
            BigDecimal total = invoice.getTotal() != null ? invoice.getTotal() : BigDecimal.ZERO;

            Paragraph totalText = new Paragraph("Phải thanh toán: " + nf.format(total) + "đ", bold);
            totalText.setAlignment(Element.ALIGN_RIGHT);
            doc.add(totalText);

            Paragraph methodText = new Paragraph("Thanh toán: " +
                    (invoice.getStatus() != null ? invoice.getStatus().getName() : "Tiền mặt"), text);
            methodText.setAlignment(Element.ALIGN_RIGHT);
            doc.add(methodText);

            doc.add(new Paragraph(" "));

            // ===================== FOOTER =====================
            Paragraph thank = new Paragraph("Cảm ơn Quý khách và hẹn gặp lại!", text);
            thank.setAlignment(Element.ALIGN_CENTER);
            doc.add(thank);

            Paragraph hotline = new Paragraph("Liên hệ hỗ trợ: 18001067\nHóa đơn điện tử: hoadon.rsm.vn", text);
            hotline.setAlignment(Element.ALIGN_CENTER);
            doc.add(hotline);

            doc.close();

            ByteArrayResource resource = new ByteArrayResource(out.toByteArray());
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=" + invoice.getCode() + ".pdf")
                    .body(resource);

        } catch (Exception e) {
            log.error("Lỗi tạo PDF: {}", e.getMessage(), e);
            throw new RuntimeException("Không thể in hóa đơn");
        }
    }

    // ===================== HÀM PHỤ =====================
    private void addHeaderCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBorder(Rectangle.NO_BORDER);
        table.addCell(cell);
    }

    private void addTextCell(PdfPTable table, String text, Font font, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(align);
        cell.setBorder(Rectangle.NO_BORDER);
        table.addCell(cell);
    }
}
