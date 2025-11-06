package com.rsm.retailbackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "InventoryAudits")
public class InventoryAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InventoryAuditId", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "BranchId", nullable = false)
    private Branch branch;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ProductId", nullable = false)
    private Product product;

    @NotNull
    @Column(name = "SystemQty", nullable = false)
    private Integer systemQty;

    @NotNull
    @Column(name = "CountedQty", nullable = false)
    private Integer countedQty;

    @ColumnDefault("[CountedQty]-[SystemQty]")
    @Column(name = "Difference")
    private Integer difference;

    @NotNull
    @ColumnDefault("sysdatetime()")
    @Column(name = "ScanTime", nullable = false)
    private Instant scanTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ScannedBy")
    private User scannedBy;

}