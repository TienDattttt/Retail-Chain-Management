package com.rsm.retailbackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.time.Instant;

@Getter
@Setter
@Entity
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StatusId", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "EntityType", nullable = false, length = 100)
    private String entityType;

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