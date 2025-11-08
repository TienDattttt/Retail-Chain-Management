package com.rsm.retailbackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "Payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PaymentId", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "InvoiceId")
    private Invoice invoice;

    @NotNull
    @Column(name = "Amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @Column(name = "Method", nullable = false, length = 50)
    private String method;

    @Size(max = 100)
    @Nationalized
    @Column(name = "TransactionCode", length = 100)
    private String transactionCode;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @ColumnDefault("'PENDING'")
    @Column(name = "Status", nullable = false, length = 50)
    private String status;

    @NotNull
    @ColumnDefault("sysutcdatetime()")
    @Column(name = "CreatedDate", nullable = false)
    private Instant createdDate;

    @Column(name = "ConfirmedDate")
    private Instant confirmedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CreatedBy")
    private User createdBy;

    @Nationalized
    @Lob
    @Column(name = "RawResponse")
    private String rawResponse;

}