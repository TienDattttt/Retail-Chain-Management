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
@Table(name = "Suppliers")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SupplierId", nullable = false)
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

    @Size(max = 50)
    @Nationalized
    @Column(name = "ContactNumber", length = 50)
    private String contactNumber;

    @Size(max = 200)
    @Nationalized
    @Column(name = "Email", length = 200)
    private String email;

    @Size(max = 500)
    @Nationalized
    @Column(name = "Address", length = 500)
    private String address;

    @Size(max = 200)
    @Nationalized
    @Column(name = "WardName", length = 200)
    private String wardName;

    @Size(max = 200)
    @Nationalized
    @Column(name = "Organization", length = 200)
    private String organization;

    @Size(max = 100)
    @Nationalized
    @Column(name = "TaxCode", length = 100)
    private String taxCode;

    @Size(max = 500)
    @Nationalized
    @Column(name = "Comments", length = 500)
    private String comments;

    @Size(max = 500)
    @Nationalized
    @Column(name = "Description", length = 500)
    private String description;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BranchId")
    private Branch branch;

    @Column(name = "Debt", precision = 18, scale = 2)
    private BigDecimal debt;

    @Column(name = "TotalInvoiced", precision = 18, scale = 2)
    private BigDecimal totalInvoiced;

    @Size(max = 100)
    @Nationalized
    @Column(name = "CreatedBy", length = 100)
    private String createdBy;

    @NotNull
    @ColumnDefault("sysdatetime()")
    @Column(name = "CreatedDate", nullable = false)
    private Instant createdDate;

    @Column(name = "ModifiedDate")
    private Instant modifiedDate;

}