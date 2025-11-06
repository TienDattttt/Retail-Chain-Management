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
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "Customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CustomerId", nullable = false)
    private Integer id;

    @Size(max = 50)
    @Nationalized
    @Column(name = "Code", length = 50)
    private String code;

    @Size(max = 200)
    @NotNull
    @Nationalized
    @Column(name = "Name", nullable = false, length = 200)
    private String name;

    @Column(name = "Type", columnDefinition = "tinyint")
    private Short type;

    @Column(name = "Gender")
    private Boolean gender;

    @Column(name = "BirthDate")
    private LocalDate birthDate;

    @Size(max = 50)
    @Nationalized
    @Column(name = "ContactNumber", length = 50)
    private String contactNumber;

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
    @Column(name = "LocationName", length = 200)
    private String locationName;

    @Size(max = 200)
    @Nationalized
    @Column(name = "Email", length = 200)
    private String email;

    @Size(max = 200)
    @Nationalized
    @Column(name = "Organization", length = 200)
    private String organization;

    @Size(max = 500)
    @Nationalized
    @Column(name = "Comments", length = 500)
    private String comments;

    @Size(max = 100)
    @Nationalized
    @Column(name = "TaxCode", length = 100)
    private String taxCode;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "Debt", nullable = false, precision = 18, scale = 2)
    private BigDecimal debt;

    @Column(name = "TotalInvoiced", precision = 18, scale = 2)
    private BigDecimal totalInvoiced;

    @Column(name = "TotalPoint", precision = 18, scale = 2)
    private BigDecimal totalPoint;

    @Column(name = "TotalRevenue", precision = 18, scale = 2)
    private BigDecimal totalRevenue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BranchId")
    private Branch branch;

    @Size(max = 100)
    @Nationalized
    @Column(name = "CreatedBy", length = 100)
    private String createdBy;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = false;

    @NotNull
    @ColumnDefault("sysdatetime()")
    @Column(name = "CreatedDate", nullable = false)
    private Instant createdDate;

    @Column(name = "ModifiedDate")
    private Instant modifiedDate;

}