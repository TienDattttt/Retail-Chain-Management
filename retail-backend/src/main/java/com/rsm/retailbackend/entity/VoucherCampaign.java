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
@Table(name = "VoucherCampaigns")
public class VoucherCampaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VoucherCampaignId", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @Column(name = "Code", nullable = false, length = 50)
    private String code;

    @Size(max = 200)
    @NotNull
    @Nationalized
    @Column(name = "Name", nullable = false, length = 200)
    private String name;

    @Size(max = 500)
    @Nationalized
    @Column(name = "Description", length = 500)
    private String description;

    @NotNull
    @Column(name = "StartDate", nullable = false)
    private Instant startDate;

    @NotNull
    @Column(name = "EndDate", nullable = false)
    private Instant endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StatusId")
    private Status status;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BranchId")
    private Branch branch;

    @Column(name = "DiscountType", columnDefinition = "tinyint not null")
    private Short discountType;

    @NotNull
    @Column(name = "DiscountValue", nullable = false, precision = 18, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "MinOrderValue", precision = 18, scale = 2)
    private BigDecimal minOrderValue;

    @Column(name = "MaxDiscountValue", precision = 18, scale = 2)
    private BigDecimal maxDiscountValue;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "Quantity", nullable = false)
    private Integer quantity;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "UsedQuantity", nullable = false)
    private Integer usedQuantity;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "RemainingQuantity", nullable = false)
    private Integer remainingQuantity;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "IsAutoGenerate", nullable = false)
    private Boolean isAutoGenerate = false;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "IsUnlimited", nullable = false)
    private Boolean isUnlimited = false;

    @NotNull
    @ColumnDefault("sysdatetime()")
    @Column(name = "CreatedDate", nullable = false)
    private Instant createdDate;

}