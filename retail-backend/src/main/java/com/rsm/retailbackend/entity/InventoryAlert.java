package com.rsm.retailbackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "InventoryAlerts")
public class InventoryAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AlertId", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ProductId", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BranchId")
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WarehouseId")
    private Warehouse warehouse;

    @Nationalized
    @Column(name = "AlertType", length = 50, nullable = false)
    private String alertType;      // LOW_STOCK / NEAR_EXPIRY / EXPIRED

    @Nationalized
    @Column(name = "Message", length = 500, nullable = false)
    private String message;

    @Column(name = "Quantity")
    private Integer quantity;

    @Column(name = "ExpiredDate")
    private LocalDate expiredDate;

    @Column(name = "CreatedDate", nullable = false)
    private Instant createdDate;

    @Column(name = "IsRead", nullable = false)
    private Boolean isRead;

    @Column(name = "ResolvedDate")
    private Instant resolvedDate;
}
