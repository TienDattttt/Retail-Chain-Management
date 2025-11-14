package com.rsm.retailbackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "ProductInventoryLots")
public class ProductInventoryLot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProductInventoryLotId", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ProductId", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WarehouseId")
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BranchId")
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BatchId")
    private Batch batch;

    @Column(name = "ExpiredDate")
    private LocalDate expiredDate;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "OnHand", nullable = false)
    private Integer onHand;

    @NotNull
    @ColumnDefault("sysdatetime()")
    @Column(name = "LastUpdated", nullable = false)
    private Instant lastUpdated;

}