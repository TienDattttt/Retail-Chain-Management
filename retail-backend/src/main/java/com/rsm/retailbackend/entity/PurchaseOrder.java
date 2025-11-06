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
@Table(name = "PurchaseOrders")
public class PurchaseOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PurchaseOrderId", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @Column(name = "Code", nullable = false, length = 50)
    private String code;

    @Size(max = 50)
    @Nationalized
    @Column(name = "DocumentCode", length = 50)
    private String documentCode;

    @NotNull
    @Column(name = "PurchaseDate", nullable = false)
    private Instant purchaseDate;

    @Column(name = "ExpectedDeliveryDate")
    private Instant expectedDeliveryDate;

    @Column(name = "DeliveryDate")
    private Instant deliveryDate;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "WarehouseId", nullable = false)
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SupplierId")
    private Supplier supplier;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "Total", nullable = false, precision = 18, scale = 2)
    private BigDecimal total;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "TotalPayment", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalPayment;

    @Column(name = "Discount", precision = 18, scale = 2)
    private BigDecimal discount;

    @Column(name = "DiscountRatio", precision = 5, scale = 2)
    private BigDecimal discountRatio;

    @Size(max = 500)
    @Nationalized
    @Column(name = "Description", length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StatusId")
    private Status status;

    @NotNull
    @ColumnDefault("sysdatetime()")
    @Column(name = "CreatedDate", nullable = false)
    private Instant createdDate;

    @Column(name = "ModifiedDate")
    private Instant modifiedDate;

}