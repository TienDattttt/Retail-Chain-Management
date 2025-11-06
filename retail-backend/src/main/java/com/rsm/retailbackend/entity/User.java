package com.rsm.retailbackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserId", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "UserName", nullable = false, length = 100)
    private String userName;

    @Size(max = 200)
    @NotNull
    @Nationalized
    @Column(name = "PasswordHash", nullable = false, length = 200)
    private String passwordHash;

    @Size(max = 200)
    @NotNull
    @Nationalized
    @Column(name = "GivenName", nullable = false, length = 200)
    private String givenName;

    @Size(max = 500)
    @Nationalized
    @Column(name = "Address", length = 500)
    private String address;

    @Size(max = 50)
    @Nationalized
    @Column(name = "MobilePhone", length = 50)
    private String mobilePhone;

    @Size(max = 200)
    @Nationalized
    @Column(name = "Email", length = 200)
    private String email;

    @Size(max = 500)
    @Nationalized
    @Column(name = "Description", length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BranchId")
    private Branch branch;

    @Column(name = "Role", columnDefinition = "tinyint not null")
    private Short role;

    @Column(name = "BirthDate")
    private LocalDate birthDate;

    // vẫn giữ để tương thích
    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = false;

    // 👇 mới: trạng thái rõ ràng
    // 0 = PENDING, 1 = ACTIVE, 2 = LOCKED
    @Column(name = "Status", nullable = false)
    private Short status = 0;

    @NotNull
    @ColumnDefault("sysdatetime()")
    @Column(name = "CreatedDate", nullable = false)
    private Instant createdDate;

    @Column(name = "ModifiedDate")
    private Instant modifiedDate;

    @Size(max = 500)
    @Nationalized
    @Column(name = "AvatarUrl", length = 500)
    private String avatarUrl;
}
