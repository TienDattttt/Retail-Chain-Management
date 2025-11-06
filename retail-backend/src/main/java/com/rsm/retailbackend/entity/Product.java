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
@Table(name = "Products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProductId", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "Code", nullable = false, length = 100)
    private String code;

    @Size(max = 200)
    @NotNull
    @Nationalized
    @Column(name = "Name", nullable = false, length = 200)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CategoryId")
    private Category category;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "BasePrice", nullable = false, precision = 18, scale = 2)
    private BigDecimal basePrice;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "RetailPrice", nullable = false, precision = 18, scale = 2)
    private BigDecimal retailPrice;

    @Column(name = "Weight", precision = 18, scale = 3)
    private BigDecimal weight;

    @Size(max = 50)
    @Nationalized
    @Column(name = "Unit", length = 50)
    private String unit;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "AllowsSale", nullable = false)
    private Boolean allowsSale = false;

    @Size(max = 20)
    @NotNull
    @Nationalized
    @ColumnDefault("'Active'")
    @Column(name = "Status", nullable = false, length = 20)
    private String status;

    @Nationalized
    @Lob
    @Column(name = "Description")
    private String description;

    @NotNull
    @ColumnDefault("sysdatetime()")
    @Column(name = "CreatedDate", nullable = false)
    private Instant createdDate;

    @Column(name = "ModifiedDate")
    private Instant modifiedDate;

    @Size(max = 100)
    @Nationalized
    @Column(name = "Barcode", length = 100)
    private String barcode;

    @Size(max = 500)
    @Nationalized
    @Column(name = "ImageUrl", length = 500)
    private String imageUrl;

}