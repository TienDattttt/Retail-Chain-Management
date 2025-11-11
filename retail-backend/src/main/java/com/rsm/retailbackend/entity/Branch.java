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
@Table(name = "Branches")
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @Nationalized
    @Column(name = "BranchCode", length = 50)
    private String branchCode;

    @Size(max = 200)
    @NotNull
    @Nationalized
    @Column(name = "Name", nullable = false, length = 200)
    private String name;

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
    @Column(name = "DistrictName", length = 200)
    private String districtName;

    @Size(max = 200)
    @Nationalized
    @Column(name = "CityName", length = 200)
    private String cityName;

    @Size(max = 50)
    @Nationalized
    @Column(name = "PhoneNumber", length = 50)
    private String phoneNumber;

    @Size(max = 200)
    @Nationalized
    @Column(name = "Email", length = 200)
    private String email;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = false;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "IsMain", nullable = false)
    private Boolean isMain = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ParentId")
    private Branch parent;

    @Column(name = "\"Level\"")
    private Integer level;

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

    @Column(name = "Latitude", precision = 11, scale = 8)
    private BigDecimal latitude;

    @Column(name = "Longitude", precision = 11, scale = 8)
    private BigDecimal longitude;

}