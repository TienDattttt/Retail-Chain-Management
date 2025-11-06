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
@Table(name = "ProductInventories")
public class ProductInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProductInventoryId", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ProductId", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BranchId")
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WarehouseId")
    private Warehouse warehouse;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "OnHand", nullable = false)
    private Integer onHand;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "Reserved", nullable = false)
    private Integer reserved;

    @ColumnDefault("[OnHand]-[Reserved]")
    @Column(name = "Available")
    private Integer available;

    @NotNull
    @ColumnDefault("sysdatetime()")
    @Column(name = "LastUpdated", nullable = false)
    private Instant lastUpdated;

}