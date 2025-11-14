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
@Table(name = "ProductUnits")
public class ProductUnit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProductUnitId", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ProductId", nullable = false)
    private Product product;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @Column(name = "UnitName", nullable = false, length = 50)
    private String unitName;

    @NotNull
    @Column(name = "ConversionRate", nullable = false, precision = 18, scale = 3)
    private BigDecimal conversionRate;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "IsBaseUnit", nullable = false)
    private Boolean isBaseUnit = false;

    @NotNull
    @ColumnDefault("sysdatetime()")
    @Column(name = "CreatedDate", nullable = false)
    private Instant createdDate;

}